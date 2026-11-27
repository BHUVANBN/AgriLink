/**
 * Event outbox — "never lose a domain event because Kafka was down".
 *
 * publish(topic, value)        → send to Kafka now; if that fails, store the
 *                                 event in the service's own DB and retry.
 * enqueue(tx, topic, value)    → write the event in the SAME database
 *                                 transaction as the state change (true
 *                                 transactional outbox); the relay delivers it.
 *
 * A relay loop delivers stored events with exponential backoff. Every replica
 * runs the relay; each event is claimed with a conditional update so only one
 * replica sends it. Delivery is at-least-once, so consumers must be idempotent.
 *
 * Each service's Prisma schema needs:
 *
 *   model OutboxEvent {
 *     id            String   @id @default(uuid())
 *     topic         String
 *     payload       String   @db.Text
 *     attempts      Int      @default(0)
 *     lastError     String?
 *     nextAttemptAt DateTime @default(now())
 *     createdAt     DateTime @default(now())
 *     @@index([nextAttemptAt])
 *     @@map("outbox_events")
 *   }
 */
import { eventsPublished, outboxPending } from './metrics.js';

export type SendFn = (topic: string, value: string) => Promise<void>;

interface OutboxDelegate {
  create(args: { data: { topic: string; payload: string } }): Promise<unknown>;
  findMany(args: any): Promise<{ id: string; topic: string; payload: string; attempts: number; nextAttemptAt: Date }[]>;
  updateMany(args: any): Promise<{ count: number }>;
  delete(args: { where: { id: string } }): Promise<unknown>;
  count(args?: any): Promise<number>;
}

export interface OutboxOptions {
  service: string;
  /** Prisma client (or anything exposing `.outboxEvent`). */
  prisma: { outboxEvent: OutboxDelegate };
  send: SendFn;
  log?: { warn: (...a: any[]) => void; error: (...a: any[]) => void };
  intervalMs?: number;
  batchSize?: number;
}

const MAX_BACKOFF_MS = 5 * 60_000;
export const backoffMs = (attempts: number) => Math.min(MAX_BACKOFF_MS, 1000 * 2 ** Math.min(attempts, 12));

export function createOutbox(opts: OutboxOptions) {
  const { service, prisma, send } = opts;
  const log = opts.log ?? console;
  const intervalMs = opts.intervalMs ?? 5000;
  const batchSize = opts.batchSize ?? 100;
  let timer: NodeJS.Timeout | null = null;
  let running = false;

  async function store(topic: string, value: string, err?: unknown) {
    await prisma.outboxEvent.create({ data: { topic, payload: value } });
    if (err) log.warn({ topic, err: (err as Error)?.message }, '[outbox] Kafka unavailable — event stored for retry');
  }

  /** Direct send with durable fallback. Never throws on Kafka errors. */
  async function publish(topic: string, value: string): Promise<void> {
    try {
      await send(topic, value);
      eventsPublished.inc({ service, topic, path: 'direct' });
    } catch (err) {
      try {
        await store(topic, value, err);
      } catch (dbErr) {
        // Both Kafka and the DB are down: nothing durable is possible.
        log.error({ topic, err: (dbErr as Error)?.message }, '[outbox] could not persist event');
      }
    }
  }

  /** Transactional: call with the Prisma transaction client. */
  async function enqueue(tx: { outboxEvent: OutboxDelegate }, topic: string, value: string) {
    await tx.outboxEvent.create({ data: { topic, payload: value } });
  }

  /** Deliver due events once. Returns how many were sent. */
  async function drain(): Promise<number> {
    if (running) return 0;
    running = true;
    let sent = 0;
    try {
      const due = await prisma.outboxEvent.findMany({
        where: { nextAttemptAt: { lte: new Date() } },
        orderBy: { createdAt: 'asc' },
        take: batchSize,
      });
      for (const ev of due) {
        // Claim: push nextAttemptAt forward only if nobody else touched it
        const claim = await prisma.outboxEvent.updateMany({
          where: { id: ev.id, nextAttemptAt: ev.nextAttemptAt },
          data: { nextAttemptAt: new Date(Date.now() + 60_000) },
        });
        if (claim.count === 0) continue;
        try {
          await send(ev.topic, ev.payload);
          await prisma.outboxEvent.delete({ where: { id: ev.id } });
          eventsPublished.inc({ service, topic: ev.topic, path: 'outbox' });
          sent++;
        } catch (err) {
          await prisma.outboxEvent.updateMany({
            where: { id: ev.id },
            data: {
              attempts: { increment: 1 },
              lastError: String((err as Error)?.message ?? err).slice(0, 500),
              nextAttemptAt: new Date(Date.now() + backoffMs(ev.attempts + 1)),
            },
          });
          break; // Kafka is likely down — stop this round, retry later
        }
      }
      outboxPending.set({ service }, await prisma.outboxEvent.count());
    } catch (err) {
      log.error({ err: (err as Error)?.message }, '[outbox] relay error');
    } finally {
      running = false;
    }
    return sent;
  }

  function start() {
    if (timer) return;
    timer = setInterval(() => { void drain(); }, intervalMs);
    timer.unref();
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  return { publish, enqueue, drain, start, stop };
}

export type Outbox = ReturnType<typeof createOutbox>;

/**
 * Keep a kafkajs consumer alive. kafkajs restarts by itself after retriable
 * errors, but some failures (e.g. a broker restart mid-request) crash it with
 * `restart: false`, leaving the service silently deaf. This re-runs `start`
 * after a delay whenever that happens.
 */
export function superviseConsumer(
  // kafkajs Consumer (typed loosely: its `on` is heavily overloaded)
  consumer: { on: (...args: any[]) => unknown; events: { CRASH: any }; disconnect: () => Promise<void> },
  start: () => Promise<unknown>,
  log: { warn: (...a: any[]) => void } = console,
  delayMs = 10_000,
) {
  consumer.on(consumer.events.CRASH, (e: any) => {
    if (e?.payload?.restart) return; // kafkajs will handle it
    log.warn({ err: e?.payload?.error?.message }, '[kafka] consumer crashed — restarting');
    setTimeout(async () => {
      await consumer.disconnect().catch(() => {});
      start().catch((err) => log.warn({ err: (err as Error)?.message }, '[kafka] consumer restart failed'));
    }, delayMs).unref?.();
  });
}
