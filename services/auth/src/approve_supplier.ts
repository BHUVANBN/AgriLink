
import { PrismaClient } from '../prisma/client/index.js';
import { connectKafka, publishEvent, disconnectKafka } from './services/kafka.producer.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_AUTH
    }
  }
});

async function main() {
  const userId = 'd299b46e-73bb-457b-b6be-ea89768f90da';
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.error('User not found');
    process.exit(1);
  }

  console.log(`[Script] Approving KYC for user ${userId} (${user.email})...`);

  // 1. Connect Kafka
  await connectKafka();

  // 2. Update Auth DB
  console.log('[Script] Updating Auth DB status to approved...');
  const updatedUser = await prisma.user.update({
    where: { email: 'bhuvanbn01@gmail.com' },
    data: {
      kycStatus: 'pending',
      kycSubmittedAt: new Date(),
      aadhaarUrl: 'https://res.cloudinary.com/dxfpm6vjo/image/upload/v123/aadhaar.jpg',
      rtcUrl: 'https://res.cloudinary.com/dxfpm6vjo/image/upload/v123/rtc.jpg',
    },
  });
  console.log(`User ${updatedUser.id} status updated to pending for admin evaluation`);

  // 3. Publish Event
  console.log('[Script] Publishing kyc.approved event to Kafka...');
  await publishEvent('kyc.approved', {
    userId: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    displayName: user.fullName ?? user.companyName ?? user.email,
    decidedAt: new Date().toISOString(),
    decisionBy: 'admin-001'
  });

  // Wait a bit for Kafka
  await new Promise(r => setTimeout(r, 2000));

  // 4. Disconnect
  await disconnectKafka();
  console.log('[Script] Done');
  process.exit(0);
}

main().catch(err => {
  console.error('[Script] FAILED:', err);
  process.exit(1);
});
