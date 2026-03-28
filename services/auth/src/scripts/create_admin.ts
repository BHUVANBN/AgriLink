import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../prisma/client/index.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_AUTH
    }
  }
});

async function main() {
  const email = 'admin@agrilink.in';
  const password = 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log(`Admin user ${email} already exists.`);
    const updated = await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
        role: 'admin',
        isActive: true,
        emailVerified: true
      }
    });
    console.log('Ensure user has admin role, is verified and password reset.');
    return;
  }


  const admin = await prisma.user.create({
    data: {
      email,
      phone: '0000000000',
      passwordHash: hashedPassword,
      role: 'admin',
      fullName: 'System Admin',
      emailVerified: true,
      kycStatus: 'approved',
      isActive: true
    }
  });

  console.log(`Successfully created admin user: ${admin.email}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
