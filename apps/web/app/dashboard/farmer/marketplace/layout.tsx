'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { ShoppingCart, Package, Search, Heart, HelpCircle, MessageSquare, Store, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationBell from '@/components/NotificationBell';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json()).then((d) => d.data ?? []);

const SHOP = '/dashboard/farmer/marketplace';
const NAV = [
  { name: 'Shop', href: SHOP, icon: Store },
  { name: 'Group deals', href: `${SHOP}/community`, icon: Users },
  { name: 'My orders', href: `${SHOP}/orders`, icon: Package },
  { name: 'Wishlist', href: `${SHOP}/wishlist`, icon: Heart },
  { name: 'Messages', href: `${SHOP}/inquiries`, icon: MessageSquare },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

// Must match the supplier service's PRODUCT_CATEGORIES
const CATEGORIES: [string, string][] = [
  ['', 'All products'], ['seeds', 'Seeds'], ['fertilizers', 'Fertilizers'], ['pesticides', 'Pesticides'],
  ['tools', 'Tools'], ['equipment', 'Equipment'], ['feed', 'Animal feed'], ['other', 'Other'],
];

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const activeCategory = params.get('category') ?? '';
  const [q, setQ] = useState(params.get('q') ?? '');
  useEffect(() => setQ(params.get('q') ?? ''), [params]);

  const { data: cart = [] } = useSWR<any[]>(`${API}/marketplace/cart`, fetcher, { refreshInterval: 60_000 });
  const cartCount = cart.reduce((n, i) => n + (i.quantity ?? 0), 0);

  const go = (next: { q?: string; category?: string }) => {
    const sp = new URLSearchParams();
    const nq = next.q ?? q;
    const nc = next.category ?? activeCategory;
    if (nq.trim()) sp.set('q', nq.trim());
    if (nc) sp.set('category', nc);
    router.push(`${SHOP}${sp.toString() ? `?${sp}` : ''}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#eae6de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/dashboard/farmer" aria-label="Back to dashboard" className="p-2 rounded-xl hover:bg-[#f8f7f4] text-text-muted shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href={SHOP} className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-xl text-text-dark hidden sm:inline">Marketplace</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 min-w-0" aria-label="Marketplace">
              {NAV.map((item) => {
                const active = item.href === SHOP ? pathname === SHOP : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={item.name}
                    aria-current={active ? 'page' : undefined}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                      active ? 'bg-brand-green/10 text-brand-green' : 'text-text-muted hover:bg-[#f8f7f4] hover:text-text-dark'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="hidden xl:inline">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <form
              role="search"
              onSubmit={(e) => { e.preventDefault(); go({ q }); }}
              className="relative hidden lg:block ml-auto"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="pl-10 pr-4 py-2 bg-[#f8f7f4] border border-[#eae6de] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all w-56"
              />
            </form>

            <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
              <NotificationBell />
              <Link href={`${SHOP}/cart`} aria-label={`Cart, ${cartCount} items`} className="relative p-2 rounded-xl hover:bg-[#f8f7f4] text-text-dark">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex gap-1 px-4 pb-2 overflow-x-auto" aria-label="Marketplace mobile">
          {NAV.map((item) => (
            <Link key={item.name} href={item.href} className="px-3 py-1.5 rounded-lg text-xs font-bold text-text-muted whitespace-nowrap bg-[#f8f7f4]">
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      {pathname === SHOP && (
        <div className="bg-white border-b border-[#eae6de] overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 whitespace-nowrap">
            <form role="search" onSubmit={(e) => { e.preventDefault(); go({ q }); }} className="lg:hidden mr-2">
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" aria-label="Search products"
                className="px-3 py-1.5 bg-[#f8f7f4] border border-[#eae6de] rounded-lg text-sm w-36" />
            </form>
            {CATEGORIES.map(([value, label]) => (
              <button
                key={label}
                onClick={() => go({ category: value })}
                aria-pressed={activeCategory === value}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeCategory === value ? 'bg-brand-green text-white' : 'text-text-muted hover:text-brand-green'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fdfcfb] overflow-x-hidden">
      <Suspense fallback={<div className="h-16 border-b border-[#eae6de] bg-white" />}>
        <Header />
      </Suspense>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
