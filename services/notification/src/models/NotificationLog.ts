import { PrismaClient } from '../../prisma/client/index.js';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_NOTIFICATION
    }
  }
});
export const NotificationLog = prisma.notificationLog;
