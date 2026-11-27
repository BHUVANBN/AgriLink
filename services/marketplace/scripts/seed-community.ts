/**
 * Dev/staging helper: create sample community deals for REAL active products.
 *
 *   pnpm --filter @agrilink/marketplace exec tsx scripts/seed-community.ts
 *
 * - Refuses to run with NODE_ENV=production (pass --force to override).
 * - Uses live products from the supplier service, so deals can actually be
 *   settled into orders (the old version used made-up product IDs).
 * - Starts every deal at 0 pledges; nothing is faked.
 */
import '../src/config.js';
import { PrismaClient } from '../prisma/client/index.js';

const SUPPLIER_URL = process.env.SUPPLIER_SERVICE_URL ?? 'http://localhost:4003';

async function main() {
  if (process.env.NODE_ENV === 'production' && !process.argv.includes('--force')) {
    console.error('Refusing to seed demo deals in production (use --force if you really mean it).');
    process.exit(1);
  }

  const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_MARKETPLACE } } });
  try {
    const list = await fetch(`${SUPPLIER_URL}/supplier/products/public?limit=3`).then((r) => r.json()) as any;
    const products: any[] = list?.data?.items ?? [];
    if (!products.length) {
      console.log('No active products in the catalogue yet — publish some products first.');
      return;
    }

    const quote = await fetch(`${SUPPLIER_URL}/supplier/products/public/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: products.map((p) => ({ productId: p.id, quantity: 1 })) }),
    }).then((r) => r.json()) as any;
    const suppliers = quote?.data?.suppliers ?? {};

    for (const [i, p] of products.entries()) {
      const deal = await prisma.communityDeal.create({
        data: {
          productId: p.id,
          supplierId: p.supplierId,
          supplierUserId: suppliers[p.supplierId]?.userId ?? null,
          title: `Group buy: ${p.name}`,
          description: `Order together and save 15% on ${p.name}.`,
          targetQuantity: 20 * (i + 1),
          currentQuantity: 0,
          originalPricePaise: p.price,
          dealPricePaise: Math.round(p.price * 0.85),
          endsAt: new Date(Date.now() + (7 + i * 7) * 86400_000),
        },
      });
      console.log(`✓ ${deal.title} (target ${deal.targetQuantity})`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
