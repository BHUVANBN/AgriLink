import { Kafka } from 'kafkajs';
import { randomUUID } from 'crypto';

const kafka = new Kafka({
  clientId: 'marketplace-service',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
});

const producer = kafka.producer();
let producerConnected = false;

async function ensureProducer() {
  if (!producerConnected) {
    await producer.connect();
    producerConnected = true;
  }
}

export async function publishEvent(topic: string, data: any) {
  try {
    await ensureProducer();
    await producer.send({
      topic,
      messages: [{
        value: JSON.stringify({
          eventId: randomUUID(),
          topic,
          source: 'marketplace-service',
          timestamp: new Date().toISOString(),
          data,
        }),
      }],
    });
  } catch (err) {
    console.error(`Failed to publish ${topic} event`, err);
  }
}

export async function disconnectKafka() {
  if (producerConnected) {
    await producer.disconnect();
    producerConnected = false;
  }
}
