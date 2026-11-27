'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/NotificationBell';
import { ADMIN_NAV, isAdminNavActive } from '@/config/admin.nav';

const InShell = createContext(false);
export const useInAdminShell = () => useContext(InShell);

/** The one admin frame: sidebar, header, role guard, logout. */
export default function AdminShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.replace(user.role === 'supplier' ? '/dashboard/supplier' : '/dashboard/farmer');
    }
  }, [loading, user, router]);

  const heading = title ?? ADMIN_NAV.find((i) => i.href === pathname)?.label ?? 'Admin';
  const initials = (user?.fullName || user?.email || 'A').slice(0, 2).toUpperCase();

  const nav = (onClick?: () => void) =>
    ADMIN_NAV.map((item) => {
      const active = isAdminNavActive(pathname, item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          aria-current={active ? 'page' : undefined}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
            active ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
          <span className="text-sm">{item.label}</span>
        </Link>
      );
    });

  return (
    <InShell.Provider value={true}>
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col lg:flex-row">
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col h-screen sticky top-0">
          <div className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tight">AgriLink</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Admin</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-6 space-y-1 overflow-y-auto">{nav()}</nav>
          <div className="p-6 border-t border-slate-50">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold">
              <LogOut className="w-5 h-5" /> Sign out
            </button>
          </div>
        </aside>

        <header className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-slate-900" />
            <span className="font-black text-slate-900 uppercase tracking-tighter">AgriLink Admin</span>
          </div>
          <button aria-label="Menu" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="lg:hidden fixed inset-0 bg-white z-40 pt-20 p-6 space-y-2 overflow-y-auto"
            >
              {nav(() => setMobileOpen(false))}
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold">
                <LogOut className="w-5 h-5" /> Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 min-w-0 p-6 lg:p-12">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{heading}</h1>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="h-10 w-px bg-slate-200 mx-2" />
              <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-full border border-slate-200 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">{initials}</div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 leading-none">{user?.fullName ?? 'Administrator'}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </InShell.Provider>
  );
}
