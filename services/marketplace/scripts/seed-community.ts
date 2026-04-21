import { PrismaClient } from '../prisma/client/index.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_MARKETPLACE
    }
  }
});

async function main() {
  const deals = [
    {
      title: 'Monsoon Fertilizer Pool (DAP)',
      description: 'Collective order for DAP fertilizers for the upcoming Monsoon season. Unlock 15% discount when we hit 500 bags.',
      productId: 'paddy-dap-001',
      supplierId: 'supplier-karnataka-01',
      targetQuantity: 500,
      currentQuantity: 342,
      originalPricePaise: 145000,
      dealPricePaise: 123000,
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
    },
    {
      title: 'High-Yield Ragi Seed Group Buy',
      description: 'Organized by Mandya Farmer Union. Pooling orders for MR-1 Hybrid Ragi seeds.',
      productId: 'ragi-seed-002',
      supplierId: 'supplier-karnataka-02',
      targetQuantity: 200,
      currentQuantity: 185,
      originalPricePaise: 85000,
      dealPricePaise: 68000,
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      isActive: true,
    },
    {
      title: 'Solar Water Pump (5HP) Community Deal',
      description: 'Subsidized community purchase for 5HP Solar Pumps. Requires 10 farmers to unlock bulk pricing.',
      productId: 'solar-pump-003',
      supplierId: 'supplier-tech-01',
      targetQuantity: 10,
      currentQuantity: 4,
      originalPricePaise: 8500000,
      dealPricePaise: 7200000,
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      isActive: true,
    }
  ];

  for (const d of deals) {
    await prisma.communityDeal.create({ data: d });
  }

  console.log('✅ Community Buying Hub seeded with active deals!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
