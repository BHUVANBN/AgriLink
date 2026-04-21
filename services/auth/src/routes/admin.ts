import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { User, prisma } from '../models/User.js';
import { publishEvent } from '../services/kafka.producer.js';

// ── Schemas ───────────────────────────────────────────────────

const DecideKycSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  reason: z.string().optional(),
  adminNote: z.string().optional(),
});

const SuspendUserSchema = z.object({
  reason: z.string().min(1, 'Suspension reason is required'),
});

const BroadcastSchema = z.object({
  targetRole: z.enum(['farmer', 'supplier', 'all']),
  subject: z.string().min(3).max(100),
  body: z.string().min(10).max(500),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

const UpdateConfigSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  isActive: z.boolean().optional(),
});


// ── Admin Routes ────────────────────────────────────────────────

export async function adminRoutes(fastify: FastifyInstance) {
  // Role guard middleware
  const requireAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
    const internalSecret = req.headers['x-internal-secret'];
    if (!internalSecret || internalSecret !== process.env.INTERNAL_SECRET) {
      return reply.status(403).send({ success: false, error: 'Access denied: Invalid internal secret' });
    }

    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return reply.status(403).send({ success: false, error: 'Admin access required' });
    }
  };

  // ── GET /auth/admin/users ───────────────────────────────────
  fastify.get(
    '/users',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { page = 1, limit = 20, role, kycStatus, search } = req.query as any;
      
      const skip = (Number(page) - 1) * Number(limit);
      const where: Record<string, any> = {};
      
      if (role) where.role = role;
      if (kycStatus) where.kycStatus = kycStatus;
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        User.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            fullName: true,
            companyName: true,
            emailVerified: true,
            kycStatus: true,
            kycSubmittedAt: true,
            kycReviewedAt: true,
            isActive: true,
            suspendedAt: true,
            createdAt: true,
          },
        }),
        User.count({ where }),
      ]);

      return reply.send({
        success: true,
        data: {
          users,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
            hasNext: skip + Number(limit) < total,
            hasPrev: Number(page) > 1,
          },
        },
      });
    }
  );

  // ── GET /auth/admin/users/:id ─────────────────────────────────
  fastify.get(
    '/users/:id',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { id } = req.params as { id: string };
      
      const user = await User.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          fullName: true,
          companyName: true,
          emailVerified: true,
          kycStatus: true,
          kycSubmittedAt: true,
          kycReviewedAt: true,
          kycReviewedBy: true,
          kycRejectionReason: true,
          isActive: true,
          suspendedAt: true,
          suspendedBy: true,
          suspendReason: true,
          tokenVersion: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }

      return reply.send({ success: true, data: user });
    }
  );

  // ── GET /auth/admin/kyc-queue ────────────────────────────────
  fastify.get(
    '/kyc-queue',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { page = 1, limit = 20 } = req.query as any;
        
        const skip = (Number(page) - 1) * Number(limit);
        
        const [users, total] = await Promise.all([
          User.findMany({
            where: { 
              kycStatus: 'pending',
              emailVerified: true,
              isActive: true,
            },
            skip,
            take: Number(limit),
            orderBy: { kycSubmittedAt: 'asc' },
            select: {
              id: true,
              email: true,
              phone: true,
              role: true,
              fullName: true,
              companyName: true,
              kycSubmittedAt: true,
              createdAt: true,
            },
          }),
          User.count({ 
            where: { 
              kycStatus: 'pending',
              emailVerified: true,
              isActive: true,
            } 
          }),
        ]);

        return reply.send({
          success: true,
          data: {
            users,
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (err: any) {
        console.error('[KYC-QUEUE] Error fetching queue:', err);
        return reply.status(500).send({ success: false, error: 'Internal Server Error during KYC queue fetch', details: err.message });
      }
    }
  );

  // ── POST /auth/admin/kyc/:id/decide ───────────────────────────
  fastify.post(
    '/kyc/:id/decide',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { id } = req.params as { id: string };
      const { decision, reason, adminNote } = DecideKycSchema.parse(req.body);
      
      const adminId = (req as any).user.sub;
      
      const user = await User.findUnique({ where: { id } });
      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }
      
      if (user.kycStatus !== 'pending') {
        return reply.status(400).send({ 
          success: false, 
          error: `KYC already ${user.kycStatus}` 
        });
      }

      const updateData: any = {
        kycStatus: decision,
        kycReviewedAt: new Date(),
        kycReviewedBy: adminId,
      };

      if (decision === 'rejected') {
        updateData.kycRejectionReason = reason || 'Rejected by admin';
      }

      await User.update({ where: { id }, data: updateData });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          actorId: adminId,
          targetId: id,
          action: decision === 'approved' ? 'KYC_APPROVE' : 'KYC_REJECT',
          metadata: { reason, adminNote },
          ipAddress: req.ip,
        }
      });


      // Publish KYC decision event
      await publishEvent(decision === 'approved' ? 'kyc.approved' : 'kyc.rejected', {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        displayName: user.fullName ?? user.companyName ?? user.email,
        decidedAt: new Date().toISOString(),
        decisionBy: adminId,
        ...(decision === 'rejected' && { reason: reason || 'Rejected by admin' }),
      });

      return reply.send({
        success: true,
        data: {
          message: `KYC ${decision} successfully`,
          kycStatus: decision,
        },
      });
    }
  );

  // ── POST /auth/admin/users/:id/suspend ────────────────────────
  fastify.post(
    '/users/:id/suspend',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { id } = req.params as { id: string };
      const { reason } = SuspendUserSchema.parse(req.body);
      
      const adminId = (req as any).user.sub;
      
      const user = await User.findUnique({ where: { id } });
      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }
      
      if (!user.isActive) {
        return reply.status(400).send({ 
          success: false, 
          error: 'User already suspended' 
        });
      }

      if (user.role === 'admin') {
        return reply.status(403).send({ 
          success: false, 
          error: 'Cannot suspend admin users' 
        });
      }

      await User.update({
        where: { id },
        data: {
          isActive: false,
          suspendedAt: new Date(),
          suspendedBy: adminId,
          suspendReason: reason,
          tokenVersion: { increment: 1 }, // Force logout
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          actorId: adminId,
          targetId: id,
          action: 'USER_SUSPEND',
          metadata: { reason },
          ipAddress: req.ip,
        }
      });


      // Publish suspension notification
      await publishEvent('notification.send', {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        channels: ['email', 'sms'],
        subject: 'Your AgriLink account has been suspended',
        body: `Your account has been suspended due to: ${reason}. Please contact support for assistance.`,
      });

      return reply.send({
        success: true,
        data: { message: 'User suspended successfully' },
      });
    }
  );

  // ── POST /auth/admin/users/:id/reactivate ─────────────────────
  fastify.post(
    '/users/:id/reactivate',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { id } = req.params as { id: string };
      const adminId = (req as any).user.sub;
      
      const user = await User.findUnique({ where: { id } });
      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }
      
      if (user.isActive) {
        return reply.status(400).send({ 
          success: false, 
          error: 'User is already active' 
        });
      }

      await User.update({
        where: { id },
        data: {
          isActive: true,
          suspendedAt: null,
          suspendedBy: null,
          suspendReason: null,
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          actorId: adminId,
          targetId: id,
          action: 'USER_REACTIVATE',
          ipAddress: req.ip,
        }
      });


      // Publish reactivation notification
      await publishEvent('notification.send', {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        channels: ['email'],
        subject: 'Your AgriLink account has been reactivated',
        body: 'Your account has been reactivated. You can now log in and use AgriLink services.',
      });

      return reply.send({
        success: true,
        data: { message: 'User reactivated successfully' },
      });
    }
  );

  // ── GET /auth/admin/stats ─────────────────────────────────────
  fastify.get(
    '/stats',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (_req: FastifyRequest, reply: FastifyReply) => {
      const [
        totalUsers,
        totalFarmers,
        totalSuppliers,
        pendingKyc,
        approvedKyc,
        rejectedKyc,
        suspendedUsers,
        recentRegistrations,
      ] = await Promise.all([
        User.count(),
        User.count({ where: { role: 'farmer' } }),
        User.count({ where: { role: 'supplier' } }),
        User.count({ where: { kycStatus: 'pending' } }),
        User.count({ where: { kycStatus: 'approved' } }),
        User.count({ where: { kycStatus: 'rejected' } }),
        User.count({ where: { isActive: false } }),
        User.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

      return reply.send({
        success: true,
        data: {
          users: {
            total: totalUsers,
            farmers: totalFarmers,
            suppliers: totalSuppliers,
            suspended: suspendedUsers,
            recentRegistrations,
          },
          kyc: {
            pending: pendingKyc,
            approved: approvedKyc,
            rejected: rejectedKyc,
            approvalRate: totalFarmers > 0 ? (approvedKyc / totalFarmers) * 100 : 0,
          },
        },
      });
    }
  );
  
  // ── GET /auth/admin/stats/registrations ────────────────────────
  fastify.get(
    '/stats/registrations',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (_req, reply) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Raw query for grouping by day in Postgres
      const stats = await prisma.$queryRaw`
        SELECT 
          TO_CHAR("createdAt", 'DY') as name,
          COUNT(*)::int as users,
          MIN("createdAt") as date_order
        FROM "auth"."users"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY name
        ORDER BY date_order ASC
      `;



      return reply.send({ success: true, data: stats });
    }
  );

  // ── GET /auth/admin/audit ────────────────────────────────────
  fastify.get(
    '/audit',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { page = 1, limit = 50, action, actorId } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};
      if (action) where.action = action;
      if (actorId) where.actorId = actorId;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.auditLog.count({ where }),
      ]);


      return reply.send({ success: true, data: { items: logs, total, pages: Math.ceil(total / Number(limit)) } });
    }
  );

  // ── GET /auth/admin/config ───────────────────────────────────
  fastify.get(
    '/config',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (_req, reply) => {
      const configs = await prisma.systemConfig.findMany();
      return reply.send({ success: true, data: configs });
    }
  );

  // ── PUT /auth/admin/config ───────────────────────────────────
  fastify.put(
    '/config',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req, reply) => {
      const { key, value, isActive } = UpdateConfigSchema.parse(req.body);
      const adminId = (req as any).user.sub;

      const config = await (User as any).prisma.systemConfig.upsert({
        where: { key },
        update: { value, isActive, updatedBy: adminId },
        create: { key, value, isActive: isActive ?? true, updatedBy: adminId },
      });

      // Audit it
      await prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'CONFIG_UPDATE',
          targetId: key,
          metadata: { value, isActive },
          ipAddress: req.ip,
        }
      });

      return reply.send({ success: true, data: config });
    }
  );

  // ── GET /auth/admin/health-check ─────────────────────────────
  fastify.get(
    '/health-check',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (_req, reply) => {
      const services = [
        { name: 'Auth Core', url: 'http://localhost:4001/health' },
        { name: 'Farmer Node', url: 'http://localhost:4002/health' },
        { name: 'Supplier Node', url: 'http://localhost:4003/health' },
        { name: 'Marketplace', url: 'http://localhost:4004/health' },
        { name: 'Notification Service', url: 'http://localhost:4005/health' },
        { name: 'ML Engine', url: 'http://localhost:4010/health' },
        { name: 'Blockchain Gateway', url: 'http://localhost:4011/health' },
      ];

      const os = await import('node:os');
      const results = await Promise.all(services.map(async (s) => {
        const start = Date.now();
        try {
          const res = await fetch(s.url, { signal: AbortSignal.timeout(2000) });
          const latency = `${Date.now() - start}ms`;
          return { name: s.name, status: res.ok ? 'UP' : 'DOWN', latency };
        } catch {
          return { name: s.name, status: 'DOWN', latency: 'timeout' };
        }
      }));

      // System metrics
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const load = os.loadavg(); // [1, 5, 15] min loads

      return reply.send({ 
        success: true, 
        data: {
          services: results,
          system: {
            cpu: Math.round((load[0] / os.cpus().length) * 100),
            memory: {
              total: Math.round(totalMem / (1024 * 1024 * 1024)),
              used: Math.round((totalMem - freeMem) / (1024 * 1024 * 1024)),
              percent: Math.round(((totalMem - freeMem) / totalMem) * 100),
            }
          }
        } 
      });
    }
  );

  // ── POST /auth/admin/broadcast ──────────────────────────────
  fastify.post(
    '/broadcast',
    { preHandler: [(fastify as any).authenticate, requireAdmin] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { targetRole, subject, body, priority } = BroadcastSchema.parse(req.body);
      
      const adminId = (req as any).user.sub;
      
      // Publish broadcast event to Kafka
      // The Notification service will consume this and send to all users of that role
      await publishEvent('system.broadcast', {
         targetRole,
         subject,
         body,
         priority,
         adminId,
         timestamp: new Date().toISOString()
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'SYSTEM_BROADCAST',
          metadata: { targetRole, subject, priority },
          ipAddress: req.ip,
        }
      });


      return reply.send({ 
        success: true, 
        message: `Broadcast sequence initiated for sector: ${targetRole.toUpperCase()}` 
      });
    }
  );
}
