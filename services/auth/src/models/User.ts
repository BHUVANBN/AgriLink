import { config } from 'dotenv';
config({ path: '../../.env' });
import { PrismaClient } from '../../prisma/client/index.js';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_AUTH
    }
  }
});
export const User = prisma.user;
