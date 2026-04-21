'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Package, Search, Heart, HelpCircle, Store, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Shop', href: '/dashboard/farmer/marketplace', icon: Store },
    { name: 'Community', href: '/dashboard/farmer/marketplace/community', icon: Users },
    { name: 'My Orders', href: '/dashboard/farmer/marketplace/orders', icon: Package },
    { name: 'Cart', href: '/dashboard/farmer/marketplace/cart', icon: ShoppingCart },
    { name: 'Wishlist', href: '/dashboard/farmer/marketplace/wishlist', icon: Heart },
    { name: 'Support', href: '/dashboard/farmer/marketplace/help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      {/* Marketplace Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[#eae6de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard/farmer/marketplace" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span className="font-serif font-bold text-xl text-text-dark">Marketplace</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-brand-green/10 text-brand-green'
                          : 'text-text-muted hover:bg-[#f8f7f4] hover:text-text-dark'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-[#f8f7f4] border border-[#eae6de] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all w-64"
                />
              </div>

              <Link
                href="/dashboard/farmer/marketplace/cart"
                className="relative p-2 rounded-xl hover:bg-[#f8f7f4] text-text-dark transition-all"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Bar */}
      <div className="bg-white border-b border-[#eae6de] overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-6 whitespace-nowrap">
          {['All Products', 'Seeds', 'Fertilizers', 'Pesticides', 'Tools', 'Irrigation', 'Machinery', 'Organic'].map((cat) => (
            <button
              key={cat}
              className="text-xs font-bold text-text-muted hover:text-brand-green transition-colors uppercase tracking-wider"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
