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

// ── Consumer Logic ───────────────────────────────────────────

const consumer = kafka.consumer({ groupId: 'marketplace-group' });

export async function startConsumer(prisma: any) {
  try {
    await consumer.connect();
    // Start listening for status changes from supplier service
    await consumer.subscribe({ topic: 'order.status.updated', fromBeginning: false });
    
    await consumer.run({
      eachMessage: async ({ message }) => {
        const payload = JSON.parse(message.value?.toString() ?? '{}');
        const { topic, data } = payload;
        
        if (topic === 'order.status.updated') {
          const { orderId, newStatus } = data;
          console.log(`[Marketplace] Updating order ${orderId} status to ${newStatus}`);
          
          await prisma.order.update({
            where: { orderNumber: orderId }, // Supplier service uses orderNumber as its primary identifier for status events
            data: { orderStatus: newStatus }
          }).catch((err: any) => console.error(`Failed to sync order ${orderId}`, err.message));
        }
      }
    });
    console.log('✅ Marketplace Kafka Consumer Active');
  } catch (err) {
    console.error('Failed to start marketplace consumer', err);
  }
}

export async function disconnectKafka() {
  if (producerConnected) {
    await producer.disconnect();
    producerConnected = false;
  }
  await consumer.disconnect();
}
