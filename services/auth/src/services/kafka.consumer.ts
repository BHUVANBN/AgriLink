/**
 * Kafka Consumer — Auth Service
 * Listens for KYC submission events from other services to update User state.
 * 
 * Topics:
 *   - kyc.submitted: Triggered when a farmer or supplier uploads docs.
 */
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { prisma } from '../models/User.js';

let consumer: Consumer | null = null;

export async function connectKafkaConsumer(): Promise<void> {
  const brokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');
  
  const kafka = new Kafka({
    clientId: 'auth-service-consumer',
    brokers,
    retry: { retries: 5 },
  });

  consumer = kafka.consumer({ groupId: 'auth-service-group' });

  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ['kyc.submitted', 'audit.log'], fromBeginning: false });
    
    console.log('[kafka-consumer] Auth consumer connected to kyc.submitted, audit.log ✓');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const prefix = `[kafka-consumer][${topic}/${partition}]`;
        
        try {
          if (!message.value) return;
          const event = JSON.parse(message.value.toString());

          if (topic === 'kyc.submitted') {
            const { userId, role, aadhaarUrl, rtcUrl, nameMatchStatus, nameMatchConfidence } = event.data;
            console.log(`${prefix} Processing kyc.submitted for user ${userId} (${role})`);

            if (userId) {
              await prisma.user.update({
                where: { id: userId },
                data: {
                  kycStatus: 'pending',
                  kycSubmittedAt: new Date(),
                  aadhaarUrl,
                  rtcUrl,
                  nameMatchStatus,
                  nameMatchConfidence,
                },
              });
              console.log(`${prefix} User ${userId} kycStatus updated to pending ✓`);
            }
          } 
          else if (topic === 'audit.log') {
            const { actorId, targetId, action, metadata, ipAddress } = event;
            console.log(`${prefix} Recording audit log: ${action} by ${actorId}`);
            
            await prisma.auditLog.create({
              data: {
                actorId,
                targetId,
                action,
                metadata,
                ipAddress,
                createdAt: new Date(),
              }
            });
          }

        } catch (err) {
          console.error(`${prefix} Error processing message:`, err);
        }
      },
    });
  } catch (err) {
    console.error('[kafka-consumer] Failed to start consumer:', err);
  }
}

export async function disconnectKafkaConsumer(): Promise<void> {
  if (consumer) {
    await consumer.disconnect();
    console.log('[kafka-consumer] Auth consumer disconnected');
  }
}
