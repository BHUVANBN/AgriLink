import { PrismaClient } from '../prisma/client/index.js';

const prisma = new PrismaClient();

async function main() {
  // Find a supplier (or use a default one)
  let supplier = await prisma.supplier.findFirst({
    where: { kycStatus: 'APPROVED' }
  });

  if (!supplier) {
    console.log('No approved supplier found. Creating a dummy one...');
    supplier = await prisma.supplier.create({
      data: {
        userId: 'dummy-supplier-id',
        companyName: 'Karnataka Agri Hub',
        email: 'hub@karnataka.gov.in',
        phone: '9876543210',
        kycStatus: 'APPROVED',
        address: { text: 'Vidhana Soudha, Bengaluru' }
      }
    });
  }

  const products = [
    {
      name: 'Premium Hybrid Paddy Seeds (Sona Masuri)',
      category: 'Seeds',
      description: 'High-yielding, pest-resistant Sona Masuri seeds optimized for Karnataka soil.',
      price: 125000, // ₹1,250.00
      mrp: 150000,
      unit: 'Bag (25kg)',
      stockQuantity: 500,
      slug: 'sona-masuri-seeds',
      sku: 'KAH-SEED-001',
      status: 'active',
      images: ['https://res.cloudinary.com/dxfpm6vjo/image/upload/v1713715200/agrilink/paddy_seeds.jpg']
    },
    {
      name: 'Organic Neem Fertilizer',
      category: 'Fertilizers',
      description: '100% natural neem cake fertilizer. Excellent for soil health and natural pest control.',
      price: 45000, // ₹450.00
      mrp: 55000,
      unit: 'Packet (5kg)',
      stockQuantity: 1200,
      slug: 'neem-fertilizer',
      sku: 'KAH-FERT-002',
      status: 'active',
      images: ['https://res.cloudinary.com/dxfpm6vjo/image/upload/v1713715200/agrilink/neem_fert.jpg']
    },
    {
      name: 'Precision Drip Irrigation Kit',
      category: 'Irrigation',
      description: 'Complete 1-acre drip irrigation system with automatic timers and filtration.',
      price: 2450000, // ₹24,500.00
      mrp: 3000000,
      unit: 'Set',
      stockQuantity: 25,
      slug: 'drip-kit-1acre',
      sku: 'KAH-IRRI-003',
      status: 'active',
      images: ['https://res.cloudinary.com/dxfpm6vjo/image/upload/v1713715200/agrilink/drip_kit.jpg']
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...p, supplierId: supplier.id },
      create: { ...p, supplierId: supplier.id }
    });
  }

  console.log('✅ Marketplace seeded with premium products!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
