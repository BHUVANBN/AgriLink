import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const JoinDealSchema = z.object({
  quantity: z.number().min(1),
});

export async function communityRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;

  // GET /marketplace/community/deals
  fastify.get('/deals', async (req: FastifyRequest, reply: FastifyReply) => {
    const deals = await prisma.communityDeal.findMany({
      where: { isActive: true, endsAt: { gt: new Date() } },
      include: { _count: { select: { participants: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send({ success: true, data: deals });
  });

  // POST /marketplace/community/deals/:id/join
  fastify.post('/deals/:id/join', async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const userId = (req as any).user.sub;
    
    const result = JoinDealSchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: result.error.flatten() });

    const deal = await prisma.communityDeal.findUnique({ where: { id } });
    if (!deal || !deal.isActive) return reply.status(404).send({ success: false, error: 'Deal not found or inactive' });

    try {
      const participation = await prisma.dealParticipant.upsert({
        where: { dealId_farmerId: { dealId: id, farmerId: userId } },
        update: { quantity: result.data.quantity },
        create: {
          dealId: id,
          farmerId: userId,
          quantity: result.data.quantity,
        },
      });

      // Update total quantity in deal
      const participants = await prisma.dealParticipant.findMany({ where: { dealId: id } });
      const totalQuantity = participants.reduce((sum: number, p: any) => sum + p.quantity, 0);

      await prisma.communityDeal.update({
        where: { id },
        data: { currentQuantity: totalQuantity },
      });

      return reply.send({ success: true, data: participation });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // Supplier: Create Deal
  fastify.post('/deals', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    const body = req.body as any;

    const deal = await prisma.communityDeal.create({
      data: {
        ...body,
        supplierId: userId,
        endsAt: new Date(body.endsAt),
      },
    });

    return reply.send({ success: true, data: deal });
  });
}
