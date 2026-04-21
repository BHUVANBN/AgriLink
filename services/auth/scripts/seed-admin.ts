import { PrismaClient } from '../prisma/client/index.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_AUTH
    }
  }
});

async function main() {
  // 1. Create a few pending KYC users (mocked)
  const users = [
    { email: 'mallesh@gmail.com', phone: '9845012345', passwordHash: 'dummy', role: 'farmer', fullName: 'Malleshappa Gowda', kycStatus: 'pending', kycSubmittedAt: new Date(Date.now() - 1000 * 60 * 120), aadhaarUrl: 'https://placehold.co/400x300?text=Aadhaar', rtcUrl: 'https://placehold.co/400x300?text=RTC' },
    { email: 'sumathi@kisan.co', phone: '9740112233', passwordHash: 'dummy', role: 'farmer', fullName: 'Sumathi Devi', kycStatus: 'pending', kycSubmittedAt: new Date(Date.now() - 1000 * 60 * 45), aadhaarUrl: 'https://placehold.co/400x300?text=Aadhaar', rtcUrl: 'https://placehold.co/400x300?text=RTC' },
    { email: 'agri_inputs@vashi.com', phone: '2245009988', passwordHash: 'dummy', role: 'supplier', fullName: 'Agri Inputs Ltd', kycStatus: 'pending', kycSubmittedAt: new Date(Date.now() - 1000 * 60 * 300), aadhaarUrl: 'https://placehold.co/400x300?text=TradeLicense', rtcUrl: 'https://placehold.co/400x300?text=GST' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
  }

  // 2. Create Audit Logs
  const auditLogs = [
    { actorId: 'system-init', action: 'SYSTEM_BOOT', metadata: { version: '2.0.0' } },
    { actorId: 'admin-01', action: 'CONFIG_UPDATE', targetId: 'MAX_LOAN_LIMIT', metadata: { old: '50000', new: '75000' } },
    { actorId: 'admin-01', action: 'KYC_APPROVE', targetId: 'farmer-uuid-001', metadata: { reason: 'Verified via Bhoomi API' } },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({ data: log });
  }

  console.log('✅ Admin Hub seeded with sample data!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
