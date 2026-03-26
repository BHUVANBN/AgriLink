'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Store, Package, ShoppingCart, BarChart3, Settings, LogOut, Menu, X, Bell, User, Search, ChevronRight } from 'lucide-react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const NAV = [
  { icon: BarChart3,    label: 'Overview',   href: '/dashboard/supplier' },
  { icon: Package,      label: 'Inventory',  href: '/dashboard/supplier/products' },
  { icon: ShoppingCart, label: 'Incoming Orders',     href: '/dashboard/supplier/orders' },
  { icon: BarChart3,    label: 'Sales Insight',  href: '/dashboard/supplier/analytics' },
  { icon: Settings,     label: 'Settings',   href: '/dashboard/supplier/settings' },
];

export default function SupplierSidebar({ pageTitle }: { pageTitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: profile } = useSWR(`${API}/supplier/profile`, fetcher);

  const kycStatus = profile?.kycStatus ?? 'PENDING';
  
  const getKycBadge = () => {
    switch(kycStatus) {
      case 'APPROVED': return { label: 'Verified Partner', cls: 'bg-[#d1fae5] text-[#065f46] border-[#10b981]/20' };
      case 'REJECTED': return { label: 'Action Required', cls: 'bg-[#fee2e2] text-[#991b1b] border-[#ef4444]/20' };
      default: return { label: 'Audit Pending', cls: 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/20' };
    }
  };

  const badge = getKycBadge();

  async function logout() {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
      toast.success('Supplier session closed');
      router.push('/auth/login');
    } catch (err) {
      router.push('/auth/login');
    }
  }

  // Notifications are handled globally via WebSockets in NotificationProvider

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed bottom-8 right-8 z-[60] w-16 h-16 rounded-2xl bg-text-dark shadow-2xl flex items-center justify-center text-white active:scale-95 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-24 px-8 flex items-center gap-4 border-b border-[#f8f7f4] relative overflow-hidden group">
          <div className="w-11 h-11 rounded-2xl bg-text-dark flex items-center justify-center shadow-xl shadow-[#eae6de] relative z-10 group-hover:rotate-12 transition-transform">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-text-dark font-serif tracking-tighter relative z-10">AgriLink</span>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f8f7f4] rounded-full blur-3xl -translate-y-16 translate-x-16" />
        </div>

        <div className="px-6 py-8">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#f8f7f4] border border-[#eae6de]/50 hover:bg-white hover:shadow-xl hover:shadow-brand-green/5 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-brand-green flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-green/20 group-hover:scale-105 transition-transform">
              {profile?.companyName?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-text-dark font-serif truncate leading-none mb-1.5">{profile?.companyName ?? 'Supply Nexus'}</p>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${badge.cls} shadow-sm`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                {badge.label}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4 mt-2">Logistics Matrix</p>
          {NAV.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-4 px-6 py-4 rounded-2xl text-[12px] font-bold uppercase tracking-wider transition-all group relative overflow-hidden
                  ${isActive 
                    ? 'bg-text-dark text-white shadow-xl shadow-[#eae6de]' 
                    : 'text-text-muted hover:text-text-dark hover:bg-[#f8f7f4]'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 relative z-10 transition-all ${isActive ? 'scale-110 text-white' : 'text-text-muted group-hover:scale-110 group-hover:text-text-dark'}`} />
                <span className="flex-1 relative z-10">{item.label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white relative z-10 animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#f8f7f4] space-y-2 pb-8">
          <Link 
            href="/dashboard/supplier/help"
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-text-muted hover:bg-[#f8f7f4] hover:text-text-dark transition-all"
          >
             <div className="w-9 h-9 rounded-xl bg-[#f8f7f4] flex items-center justify-center text-text-muted font-bold">?</div>
            Resource Hub
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-red-500 hover:bg-[#fee2e2] transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#fee2e2] flex items-center justify-center text-red-500 transition-transform group-hover:rotate-12">
              <LogOut className="w-4 h-4" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>

      <header className={`
        lg:ml-72 h-24 flex items-center justify-between px-10 bg-brand-bg/95 backdrop-blur-xl border-b border-[#eae6de] sticky top-0 z-40 transition-all
      `}>
        <div className="flex items-center gap-4">
           <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white border border-[#eae6de] rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-text-dark" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none pt-0.5">Supply sync online</span>
           </div>
           <h1 className="text-2xl font-bold text-text-dark font-serif tracking-tighter">{pageTitle ?? 'Operations Center'}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center bg-white border border-[#eae6de] rounded-xl px-5 py-3 w-80 shadow-sm focus-within:ring-4 focus-within:ring-brand-green/5 transition-all">
            <Search className="w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Audit inventory..." className="bg-transparent border-none text-[11px] font-bold uppercase tracking-wider focus:ring-0 ml-3 w-full text-text-dark placeholder:text-text-muted" />
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-[#eae6de]">
            <button className="relative w-12 h-12 rounded-2xl bg-white border border-[#eae6de] shadow-sm hover:shadow-md flex items-center justify-center text-text-muted transition-all hover:text-text-dark active:scale-90">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-text-dark rounded-full border-[3px] border-white" />
            </button>
            <Link href="/dashboard/supplier/settings" className="w-12 h-12 rounded-2xl bg-brand-green shadow-xl shadow-brand-green/20 flex items-center justify-center text-white hover:bg-brand-green-hover transition-all active:scale-95">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md lg:hidden"
           />
        )}
      </AnimatePresence>
    </>
  );
}
