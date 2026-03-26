import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getCache, setCache } from '../services/redis.js';

const SUPPLIER_SERVICE_URL = process.env.SUPPLIER_SERVICE_URL ?? 'http://supplier-service:4003';

export async function productRoutes(fastify: FastifyInstance) {
  // GET /marketplace/products — browse all active products (proxy to supplier)
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
    const cacheKey = `marketplace:products:${queryString || 'default'}`;

    // Try cache first
    const cached = await getCache(cacheKey);
    if (cached) return reply.send(cached);
    
    try {
      const res = await fetch(`${SUPPLIER_SERVICE_URL}/supplier/products/public?${queryString}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return reply.status(res.status).send(err);
      }
      const data = await res.json();

      // Cache successful response for 5 mins
      await setCache(cacheKey, data, 300);

      return reply.send(data);
    } catch (err: any) {
      fastify.log.error({ err }, 'Failed to proxy products from supplier service');
      return reply.status(502).send({ success: false, error: 'Marketplace temporarily unavailable' });
    }
  });

  // GET /marketplace/products/:id
  fastify.get('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const cacheKey = `marketplace:product:${id}`;

    // Try cache first
    const cached = await getCache(cacheKey);
    if (cached) return reply.send(cached);

    try {
      const res = await fetch(`${SUPPLIER_SERVICE_URL}/supplier/products/public/${id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return reply.status(res.status).send(err);
      }
      const data = await res.json();

      // Cache detail for 10 mins
      await setCache(cacheKey, data, 600);

      return reply.send(data);
    } catch (err: any) {
      fastify.log.error({ err }, 'Failed to proxy product detail from supplier service');
      return reply.status(502).send({ success: false, error: 'Marketplace temporarily unavailable' });
    }
  });
}
