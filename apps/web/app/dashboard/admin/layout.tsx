'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  History, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X,
  Activity,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'KYC Queue', href: '/dashboard/admin/kyc', icon: ShieldCheck },
  { name: 'User Directory', href: '/dashboard/admin/users', icon: Users },
  { name: 'Audit Trails', href: '/dashboard/admin/audit', icon: History },
  { name: 'System Config', href: '/dashboard/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // In a real app, clear cookies/tokens
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col h-screen sticky top-0">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">AgriLink</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Admin Hub v2</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <ShieldCheck className="w-6 h-6 text-slate-900" />
           <span className="font-black text-slate-900 uppercase tracking-tighter">AgriLink Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="lg:hidden fixed inset-0 bg-white z-40 pt-20 p-6 space-y-4"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl text-slate-900 font-bold border border-slate-100"
              >
                <item.icon className="w-6 h-6 text-slate-500" />
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 lg:p-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {NAV_ITEMS.find(i => i.href === pathname)?.name || 'Admin Dashboard'}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs font-medium">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 Platform Status: Optimal Sync
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 relative hover:bg-slate-50 transition-all">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
              </button>
              <div className="h-10 w-px bg-slate-200 mx-2" />
              <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-full border border-slate-200 shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                    AD
                 </div>
                 <div className="hidden sm:block">
                    <p className="text-[10px] font-black text-slate-900 leading-none">SYSTEM ADMIN</p>
                    <p className="text-[10px] text-slate-400 font-medium">super_admin@agrilink.app</p>
                 </div>
              </div>
           </div>
        </header>

        {children}
      </main>
    </div>
  );
}
