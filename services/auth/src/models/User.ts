import '../config.js';
import { PrismaClient } from '../../prisma/client/index.js';
import { syncAuthState } from '../services/redis.service.js';

const basePrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_AUTH
    }
  }
});

/**
 * Any write that changes `tokenVersion` or `isActive` is mirrored into Redis
 * so every other service rejects revoked/suspended sessions immediately
 * (see @agrilink/auth-middleware). Doing it here means no route can forget.
 */
export const prisma = basePrisma.$extends({
  query: {
    user: {
      async update({ args, query }) {
        const result = await query(args);
        const data: any = args.data ?? {};
        if ('tokenVersion' in data || 'isActive' in data) {
          const fresh = await basePrisma.user.findUnique({
            where: args.where,
            select: { id: true, tokenVersion: true, isActive: true },
          });
          if (fresh) await syncAuthState(fresh.id, fresh.tokenVersion, fresh.isActive);
        }
        return result;
      },
    },
  },
});

export const User = prisma.user;
