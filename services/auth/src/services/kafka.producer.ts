/**
 * Kafka Producer — Auth Service
 * Publishes domain events when users register, verify KYC, etc.
 * Other services (Notification) consume these.
 * 
 * Non-fatal: Auth works without Kafka; notification just won't fire.
 */
import { Kafka, Producer, CompressionTypes } from 'kafkajs';
import { randomUUID } from 'crypto';
import type { KafkaEvent, KafkaTopic } from '@agrilink/types';
import { createOutbox, type Outbox } from '@agrilink/platform';

let producer: Producer | null = null;
let connected = false;

function getProducer(): Producer {
  if (!producer) {
    const kafka = new Kafka({
      clientId: 'auth-service',
      brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
      connectionTimeout: 3000,   // 3s max to connect
      requestTimeout: 5000,
      retry: { initialRetryTime: 300, retries: 2 }, // Only 2 retries — fast fail
    });
    producer = kafka.producer({ allowAutoTopicCreation: true });
  }
  return producer;
}

async function ensureConnected(): Promise<void> {
  if (connected) return;
  await getProducer().connect();
  connected = true;
}

async function sendRaw(topic: string, value: string): Promise<void> {
  await ensureConnected();
  try {
    await getProducer().send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [{ key: randomUUID(), value }],
    });
  } catch (err) {
    connected = false; // force a reconnect on the next attempt
    throw err;
  }
}

let outbox: Outbox | null = null;

/** Called once at boot with the Prisma client (needs the OutboxEvent model). */
export function initOutbox(prisma: any): void {
  outbox = createOutbox({ service: 'auth', prisma, send: sendRaw });
  outbox.start();
}

export async function connectKafka(): Promise<void> {
  try {
    await ensureConnected();
    console.log('[kafka] Auth producer connected ✓');
  } catch (err) {
    console.warn('[kafka] Auth producer not connected yet (events go to the outbox):', err instanceof Error ? err.message : err);
  }
}

export function buildEvent<T>(topic: KafkaTopic, data: T): string {
  const event: KafkaEvent<T> = {
    eventId: randomUUID(),
    topic,
    source: 'auth-service',
    timestamp: new Date().toISOString(),
    data,
  };
  return JSON.stringify(event);
}

/** Publish now; if Kafka is unavailable the event is stored and retried. */
export async function publishEvent<T>(topic: KafkaTopic, data: T): Promise<void> {
  const value = buildEvent(topic, data);
  if (outbox) return outbox.publish(topic, value);
  await sendRaw(topic, value).catch((err) =>
    console.error(`[kafka] Failed to publish ${topic}:`, err instanceof Error ? err.message : err));
}

export async function disconnectKafka(): Promise<void> {
  outbox?.stop();
  if (connected && producer) {
    await producer.disconnect();
    connected = false;
  }
}
