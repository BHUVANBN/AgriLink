'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Leaf, BarChart3, FileCheck, TrendingUp, Link2, Map as MapIcon,
  ShoppingBag, Settings, LogOut, Menu, X, Bell, User, Search, ChevronRight
} from 'lucide-react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const NAV = [
  { icon: BarChart3,   label: 'Overview',         href: '/dashboard/farmer' },
  { icon: FileCheck,   label: 'KYC & Documents',  href: '/dashboard/farmer/kyc' },
  { icon: MapIcon,     label: 'Land Mapping',     href: '/dashboard/farmer/land' },
  { icon: TrendingUp,  label: 'Crop Prices',       href: '/dashboard/farmer/prices' },
  { icon: Leaf,        label: 'Govt. Schemes',     href: '/dashboard/farmer/schemes' },
  { icon: Link2,       label: 'Integration',       href: '/dashboard/farmer/integration' },
  { icon: ShoppingBag, label: 'Marketplace',       href: '/marketplace' },
  { icon: Settings,    label: 'Settings',           href: '/dashboard/farmer/settings' },
];

export default function FarmerSidebar({ pageTitle }: { pageTitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: profile } = useSWR(`${API}/farmer/profile`, fetcher);
  const { data: stats } = useSWR(`${API}/farmer/stats`, fetcher);

  const kycStatus = stats?.kycStatus ?? 'not_started';
  
  const getKycBadge = () => {
    switch(kycStatus) {
      case 'approved': return { label: 'Verified', cls: 'bg-[#d1fae5] text-[#065f46] border-[#10b981]/20' };
      case 'submitted': return { label: 'Reviewing', cls: 'bg-[#dbeafe] text-[#1e3a8a] border-[#3b82f6]/20' };
      case 'rejected': return { label: 'Action Req', cls: 'bg-[#fee2e2] text-[#991b1b] border-[#ef4444]/20' };
      default: return { label: 'Pending', cls: 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/20' };
    }
  };

  const badge = getKycBadge();

  async function logout() {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
      toast.success('Securely logged out');
      router.push('/auth/login');
    } catch (err) {
      router.push('/auth/login');
    }
  }

  // Notifications are handled globally by NotificationProvider via WebSockets

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed bottom-8 right-8 z-[60] w-16 h-16 rounded-2xl bg-brand-green shadow-2xl shadow-brand-green/30 flex items-center justify-center text-white active:scale-90 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Aside */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-24 px-8 flex items-center gap-4 border-b border-[#f8f7f4] relative overflow-hidden group">
          <div className="w-11 h-11 rounded-xl bg-brand-green flex items-center justify-center shadow-xl shadow-brand-green/20 relative z-10 transition-transform group-hover:scale-110">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-text-dark font-serif tracking-tighter relative z-10">AgriLink</span>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f6f3eb] rounded-full blur-3xl -translate-y-16 translate-x-16 opacity-50" />
        </div>

        {/* Profile Brief */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#f8f7f4] border border-[#eae6de]/50 hover:bg-white hover:shadow-xl hover:shadow-brand-green/5 transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-brand-green flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-green/20 group-hover:rotate-6 transition-transform">
              {profile?.nameDisplay?.[0]?.toUpperCase() ?? 'F'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-text-dark font-serif truncate leading-none mb-1">{profile?.nameDisplay ?? 'Farmer Cluster'}</p>
              {profile?.village && (
                <p className="text-[10px] text-text-muted font-bold truncate mb-1">{profile.village}, {profile.hobli || profile.district}</p>
              )}
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${badge.cls} shadow-sm`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                {badge.label}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4 mt-2">OPERATIONAL MATRIX</p>
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
                    ? 'bg-[#f6f3eb] text-brand-green shadow-sm' 
                    : 'text-text-muted hover:text-brand-green'
                  }
                `}
              >
                {isActive && (
                   <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-[#f6f3eb] border-r-4 border-brand-green" />
                )}
                <item.icon className={`w-5 h-5 relative z-10 transition-all ${isActive ? 'scale-110 text-brand-green' : 'text-text-muted group-hover:scale-110 group-hover:text-brand-green'}`} />
                <span className="flex-1 relative z-10">{item.label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-green relative z-10 shadow-[0_0_8px_rgba(26,77,46,0.6)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#f8f7f4] space-y-2 pb-8">
          <Link 
            href="/dashboard/farmer/help"
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-text-muted hover:bg-[#f8f7f4] hover:text-text-dark transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#f8f7f4] flex items-center justify-center text-text-muted font-bold">?</div>
            Help Oracle
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-red-500 hover:bg-[#fee2e2] transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#fee2e2] flex items-center justify-center text-red-500 transition-transform group-hover:rotate-12">
              <LogOut className="w-4 h-4" />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Header */}
      <header className={`
        lg:ml-72 h-24 flex items-center justify-between px-10 bg-brand-bg/95 backdrop-blur-xl border-b border-[#eae6de] sticky top-0 z-40
      `}>
        <div className="flex items-center gap-4">
           <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white border border-[#eae6de] rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none pt-0.5">Network active</span>
           </div>
           <h1 className="text-2xl font-bold text-text-dark font-serif tracking-tighter">{pageTitle ?? 'Overview'}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Internal Search */}
          <div className="hidden xl:flex items-center bg-white border border-[#eae6de] rounded-xl px-5 py-3 w-80 shadow-sm focus-within:ring-4 focus-within:ring-brand-green/5 transition-all">
            <Search className="w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Scan records..." className="bg-transparent border-none text-[11px] font-bold uppercase tracking-wider focus:ring-0 ml-3 w-full text-text-dark placeholder:text-text-muted" />
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-[#eae6de]">
            <button className="relative w-12 h-12 rounded-2xl bg-white border border-[#eae6de] shadow-sm hover:shadow-md flex items-center justify-center text-text-muted transition-all hover:text-brand-green active:scale-90">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-brand-orange rounded-full border-[3px] border-white" />
            </button>
            <Link href="/dashboard/farmer/settings" className="w-12 h-12 rounded-2xl bg-text-dark shadow-xl shadow-[#eae6de] flex items-center justify-center text-white hover:bg-[#1a1a1a] transition-all active:scale-95">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
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
