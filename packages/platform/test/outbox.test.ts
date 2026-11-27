import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOutbox, backoffMs } from '../src/outbox.js';

/** In-memory stand-in for prisma.outboxEvent */
function memoryStore() {
  let rows: any[] = [];
  let n = 0;
  return {
    rows: () => rows,
    outboxEvent: {
      create: async ({ data }: any) => { const r = { id: String(++n), attempts: 0, nextAttemptAt: new Date(0), createdAt: new Date(), ...data }; rows.push(r); return r; },
      findMany: async ({ where, take }: any) => rows.filter((r) => r.nextAttemptAt <= where.nextAttemptAt.lte).slice(0, take),
      updateMany: async ({ where, data }: any) => {
        const r = rows.find((x) => x.id === where.id && (!where.nextAttemptAt || x.nextAttemptAt === where.nextAttemptAt));
        if (!r) return { count: 0 };
        if (data.attempts?.increment) r.attempts += data.attempts.increment;
        if (data.nextAttemptAt) r.nextAttemptAt = data.nextAttemptAt;
        if ('lastError' in data) r.lastError = data.lastError;
        return { count: 1 };
      },
      delete: async ({ where }: any) => { rows = rows.filter((r) => r.id !== where.id); },
      count: async () => rows.length,
    },
  };
}

const quiet = { warn: () => {}, error: () => {} };

describe('outbox', () => {
  let db: ReturnType<typeof memoryStore>;
  beforeEach(() => { db = memoryStore(); });

  it('sends directly when Kafka is up and stores nothing', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const ob = createOutbox({ service: 't', prisma: db as any, send, log: quiet });
    await ob.publish('order.placed', '{"a":1}');
    expect(send).toHaveBeenCalledWith('order.placed', '{"a":1}');
    expect(db.rows()).toHaveLength(0);
  });

  it('stores the event when Kafka is down, then delivers it once Kafka recovers', async () => {
    let up = false;
    const send = vi.fn(async () => { if (!up) throw new Error('ECONNREFUSED'); });
    const ob = createOutbox({ service: 't', prisma: db as any, send, log: quiet });

    await ob.publish('kyc.approved', '{"u":1}');
    expect(db.rows()).toHaveLength(1);

    expect(await ob.drain()).toBe(0);          // still down → kept, backoff scheduled
    expect(db.rows()[0].attempts).toBe(1);

    up = true;
    db.rows()[0].nextAttemptAt = new Date(0);  // make it due now
    expect(await ob.drain()).toBe(1);
    expect(db.rows()).toHaveLength(0);
  });

  it('transactional enqueue is delivered by the relay', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const ob = createOutbox({ service: 't', prisma: db as any, send, log: quiet });
    await ob.enqueue(db as any, 'order.placed', 'x');
    expect(send).not.toHaveBeenCalled();
    await ob.drain();
    expect(send).toHaveBeenCalledWith('order.placed', 'x');
  });

  it('backs off exponentially, capped at 5 minutes', () => {
    expect(backoffMs(1)).toBe(2000);
    expect(backoffMs(3)).toBe(8000);
    expect(backoffMs(50)).toBe(300_000);
  });
});
