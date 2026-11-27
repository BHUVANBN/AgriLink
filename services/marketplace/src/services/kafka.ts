import { Kafka } from 'kafkajs';
import { randomUUID } from 'crypto';

const kafka = new Kafka({
  clientId: 'marketplace-service',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
});

import { createOutbox, superviseConsumer, type Outbox } from '@agrilink/platform';

const producer = kafka.producer();
let producerConnected = false;

async function sendRaw(topic: string, value: string): Promise<void> {
  if (!producerConnected) {
    await producer.connect();
    producerConnected = true;
  }
  try {
    await producer.send({ topic, messages: [{ value }] });
  } catch (err) {
    producerConnected = false;
    throw err;
  }
}

export function buildEvent(topic: string, data: any): string {
  return JSON.stringify({
    eventId: randomUUID(),
    topic,
    source: 'marketplace-service',
    timestamp: new Date().toISOString(),
    data,
  });
}

let outbox: Outbox | null = null;

export function initOutbox(prisma: any): void {
  outbox = createOutbox({ service: 'marketplace', prisma, send: sendRaw });
  outbox.start();
}

/** Publish now, or store in the outbox if Kafka is unavailable. */
export async function publishEvent(topic: string, data: any): Promise<void> {
  const value = buildEvent(topic, data);
  if (outbox) return outbox.publish(topic, value);
  await sendRaw(topic, value).catch((err) => console.error(`Failed to publish ${topic} event`, err));
}

/**
 * Transactional outbox: write the event inside the caller's Prisma
 * transaction so it is committed atomically with the state change.
 */
export async function enqueueEvent(tx: any, topic: string, data: any): Promise<void> {
  await tx.outboxEvent.create({ data: { topic, payload: buildEvent(topic, data) } });
}

/** Deliver outbox events right away (e.g. just after a transaction commits). */
export function flushOutbox(): void {
  void outbox?.drain();
}

// ── Consumer Logic ───────────────────────────────────────────

const consumer = kafka.consumer({ groupId: 'marketplace-group' });

let supervised = false;
export async function startConsumer(prisma: any): Promise<void> {
  if (!supervised) {
    superviseConsumer(consumer, () => startConsumer(prisma));
    supervised = true;
  }
  try {
    await consumer.connect();
    // Status changes made in the supplier dashboard (supplier service)
    await consumer.subscribe({ topic: 'order.status.updated', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        let payload: any;
        try { payload = JSON.parse(message.value?.toString() ?? '{}'); } catch { return; }
        if (payload.source === 'marketplace-service') return; // our own event

        const data = payload.data ?? {};
        const orderNumber = data.orderNumber ?? data.orderId;
        if (!orderNumber || !data.newStatus) return;

        await prisma.order.updateMany({
          where: { orderNumber },
          data: { orderStatus: data.newStatus },
        }).catch((err: any) => console.error(`Failed to sync order ${orderNumber}`, err.message));
      }
    });
    console.log('✅ Marketplace Kafka Consumer Active');
  } catch (err) {
    console.error('Failed to start marketplace consumer — retrying in 10s', err);
    setTimeout(() => { startConsumer(prisma).catch(() => {}); }, 10_000);
  }
}

export async function disconnectKafka() {
  outbox?.stop();
  if (producerConnected) {
    await producer.disconnect();
    producerConnected = false;
  }
  await consumer.disconnect();
}
