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

export async function connectKafka(): Promise<void> {
  try {
    await getProducer().connect();
    connected = true;
    console.log('[kafka] Auth producer connected ✓');
  } catch (err) {
    console.warn('[kafka] Auth producer failed to connect (non-fatal):', err instanceof Error ? err.message : err);
    connected = false;
  }
}

export async function publishEvent<T>(topic: KafkaTopic, data: T): Promise<void> {
  if (!connected) return; // Graceful degradation

  const event: KafkaEvent<T> = {
    eventId: randomUUID(),
    topic,
    source: 'auth-service',
    timestamp: new Date().toISOString(),
    data,
  };

  try {
    await getProducer().send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [
        {
          key: randomUUID(),
          value: JSON.stringify(event),
        },
      ],
    });
  } catch (err) {
    console.error(`[kafka] Failed to publish ${topic}:`, err instanceof Error ? err.message : err);
  }
}

export async function disconnectKafka(): Promise<void> {
  if (connected && producer) {
    await producer.disconnect();
    connected = false;
  }
}
