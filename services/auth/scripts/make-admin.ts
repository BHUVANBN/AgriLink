import { PrismaClient } from '../prisma/client/index.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_AUTH
    }
  }
});

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Please provide an email: npm run make-admin <email>');
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'admin' },
  });

  console.log(`✅ User ${user.email} is now an ADMIN!`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
