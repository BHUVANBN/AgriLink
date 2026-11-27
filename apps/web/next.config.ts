import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Monorepo: trace dependencies from the repo root so the standalone
  // bundle includes hoisted pnpm packages.
  outputFileTracingRoot: path.join(__dirname, '../../'),
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // One farmer shopping flow: the public /marketplace is the storefront for
  // browsing; cart, checkout and orders live in the farmer dashboard.
  async redirects() {
    return [
      { source: '/marketplace/cart', destination: '/dashboard/farmer/marketplace/cart', permanent: false },
      { source: '/marketplace/checkout', destination: '/dashboard/farmer/marketplace/checkout', permanent: false },
      { source: '/marketplace/orders', destination: '/dashboard/farmer/marketplace/orders', permanent: false },
      { source: '/marketplace/orders/:id', destination: '/dashboard/farmer/marketplace/orders', permanent: false },
      { source: '/dashboard/farmer/orders', destination: '/dashboard/farmer/marketplace/orders', permanent: false },
      { source: '/register', destination: '/auth/register', permanent: true },
      { source: '/login', destination: '/auth/login', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },
};

export default nextConfig;
