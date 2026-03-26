'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, ShoppingCart, DollarSign, Store, Bell, Settings,
  TrendingUp, TrendingDown, ChevronRight, Upload, List,
  AlertTriangle, CheckCircle, Clock, FileCheck, LogOut, Menu, X, User, ArrowUpRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async r => {
    if (!r.ok) {
      const error = new Error('API Error');
      (error as any).status = r.status;
      try { (error as any).info = await r.json(); } catch { }
      throw error;
    }
    return r.json().then(d => d.data);
  });

function KycBanner({ profile }: { profile: any }) {
  if (!profile || profile.kycStatus === 'approved') return null;

  const config: Record<string, { bg: string, border: string, text: string, icon: any; msg: string; action?: string; href?: string }> = {
    not_started: { bg: 'bg-[#fef3c7]', border: 'border-[#f59e0b]/20', text: 'text-[#92400e]', icon: AlertTriangle, msg: 'Complete your business KYC to list products', action: 'Verify Now', href: '/dashboard/supplier/kyc' },
    pending: { bg: 'bg-[#dbeafe]', border: 'border-[#3b82f6]/20', text: 'text-[#1e3a8a]', icon: Clock, msg: 'KYC submitted — admin review in progress (2–3 days)' },
    rejected: { bg: 'bg-[#fee2e2]', border: 'border-[#ef4444]/20', text: 'text-[#991b1b]', icon: AlertTriangle, msg: `KYC rejected: ${profile.kycRejectionReason ?? 'Invalid Documents'}. Please update.`, action: 'Review', href: '/dashboard/supplier/kyc' },
  };

  const c = config[profile.kycStatus] || config.not_started;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${c.bg} ${c.border} border p-4 rounded-2xl flex items-center gap-4 mb-8 shadow-sm`}
    >
      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${c.text}`}>
        <c.icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className={`${c.text} text-sm font-bold`}>{c.msg}</p>
      </div>
      {c.action && c.href && (
        <Link href={c.href} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-700 hover:bg-slate-50 transition-colors">
          {c.action}
        </Link>
      )}
    </motion.div>
  );
}

function StatCard({ label, value, subtext, icon: Icon, color, delta }: any) {
  const colors: any = {
    green: 'bg-[#f6f3eb] text-brand-green border-brand-green/10',
    blue: 'bg-[#dbeafe] text-[#3b82f6] border-[#3b82f6]/20',
    amber: 'bg-[#fef3c7] text-brand-orange border-brand-orange/10',
    purple: 'bg-[#ede9fe] text-[#7c3aed] border-[#7c3aed]/20',
    slate: 'bg-[#f8f7f4] text-text-muted border-[#eae6de]/20'
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color] || colors.slate}`}>
          <Icon className="w-6 h-6" />
        </div>
        {delta && (
          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black italic">
            +{delta}% <ArrowUpRight className="w-3 h-3" />
          </div>
        )}
      </div>
      <div>
        <h4 className="text-text-dark font-serif font-bold mb-1">{label}</h4>
        <p className="text-2xl font-black text-text-dark font-serif font-bold">{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-1">{subtext}</p>
      </div>
    </div>
  );
}

export default function SupplierDashboard() {
  const router = useRouter();
  const { data: profile, error, isLoading } = useSWR(`${API}/auth/me`, fetcher);
  const { data: stats, isLoading: statsLoading } = useSWR(`${API}/supplier/stats`, fetcher);

  useEffect(() => {
    // Only redirect if SWR explicitly returns a 401 Unauthorized error
    if (!isLoading && error?.status === 401) {
      router.push('/auth/login');
    }
  }, [isLoading, error, router]);

  if (isLoading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="animate-pulse text-brand-green font-bold text-center">Opening Business Hub...<br/><span className="text-[10px] uppercase opacity-50 font-sans tracking-widest">Supplier Portal V2.0</span></div></div>;

  if (error && error.status !== 401) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-text-dark font-serif mb-2">Supplier Service Unavailable</h1>
        <p className="text-text-muted text-sm max-w-xs mb-8">
          We encountered an error connecting to the supplier gateway (Error {error.status}).
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Business Overview" />
      
      <main className="lg:ml-72 p-6 lg:p-8">
        {/* Verification Alert */}
        <KycBanner profile={{ kycStatus: stats?.kycStatus, kycRejectionReason: profile?.kycRejectionReason }} />

        {/* Welcome Block */}
        <div className="mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-bold text-text-dark font-serif">
              Welcome back, {profile?.name?.split(' ')[0] || 'Partner'} 📦
            </h2>
            <p className="text-text-muted font-medium text-sm mt-1 uppercase tracking-wider text-[10px]">
              Managing supply logistics for your agriculture hub
            </p>
          </motion.div>
        </div>

        {/* Core Business Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 bg-white rounded-2xl border border-[#eae6de] animate-pulse" />
            ))
          ) : (
            <>
              <StatCard
                label="Total Revenue"
                value={stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0'}
                subtext="All-time verified sales"
                icon={DollarSign}
                color="green"
                delta={12}
              />
              <StatCard
                label="Active Stock"
                value={stats?.activeProducts ?? '0'}
                subtext="Listed in marketplace"
                icon={Package}
                color="blue"
              />
              <StatCard
                label="New Orders"
                value={stats?.pendingOrders ?? '0'}
                subtext="Requires fulfillment"
                icon={ShoppingCart}
                color="amber"
              />
              <StatCard
                label="Partner Tier"
                value={stats?.kycStatus === 'approved' ? 'Gold' : 'Basic'}
                subtext={stats?.kycStatus === 'approved' ? 'Verified Seller' : 'Upgrade Business Profile'}
                icon={CheckCircle}
                color={stats?.kycStatus === 'approved' ? 'green' : 'slate'}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-10">
          {/* Recent Operations */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eae6de] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#f8f7f4] flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-dark font-serif">Fulfillment Queue</h3>
              <Link href="/dashboard/supplier/orders" className="text-xs font-bold uppercase text-brand-green hover:text-brand-green-hover tracking-wider">
                Full Queue →
              </Link>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#f8f7f4] flex items-center justify-center text-text-muted">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <p className="text-text-dark font-bold">No Pending Fulfillments</p>
                <p className="text-text-muted text-xs mt-1 italic font-medium">New orders from farmers will appear here automatically.</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f8f7f4] border-t border-[#eae6de] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Live Monitoring Active</span>
            </div>
          </div>

          {/* Business Tools */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Rapid Tools</h3>
            <div className="space-y-4">
              {[
                { icon: Package, label: 'Add Product', desc: 'Sync new inventory items', href: '/dashboard/supplier/products/new', color: 'blue' },
                { icon: ShoppingCart, label: 'Order Hub', desc: 'Process bulk orders', href: '/dashboard/supplier/orders', color: 'amber' },
                { icon: List, label: 'Inventory', desc: 'Update stock & pricing', href: '/dashboard/supplier/products', color: 'green' },
                { icon: User, label: 'Business Profile', desc: 'Legal & Bank updates', href: '/dashboard/supplier/settings', color: 'purple' },
              ].map(a => (
                <Link key={a.href} href={a.href} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#eae6de] hover:border-brand-green/30 hover:shadow-lg hover:shadow-brand-green/5 transition-all group">
                  <div className={`w-10 h-10 rounded-xl bg-[#f8f7f4] flex items-center justify-center text-text-muted group-hover:bg-brand-green group-hover:text-white transition-all`}>
                    <a.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-dark text-sm font-bold group-hover:text-brand-green">{a.label}</p>
                    <p className="text-text-muted text-[10px] font-medium italic">{a.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-brand-green transition-all translate-x-[-4px] group-hover:translate-x-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
