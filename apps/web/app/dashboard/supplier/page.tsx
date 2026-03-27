'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingCart, DollarSign, Store, Bell, Settings,
  TrendingUp, TrendingDown, ChevronRight, Upload, List,
  AlertTriangle, CheckCircle, Clock, FileCheck, LogOut, Menu, X, User, ArrowUpRight,
  BarChart3, History, PieChart, Activity, ShieldCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SupplierSidebar from '@/components/SupplierSidebar';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

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
      className={`${c.bg} ${c.border} border p-5 rounded-[2rem] flex items-center gap-4 mb-8 shadow-sm`}
    >
      <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ${c.text}`}>
        <c.icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className={`${c.text} text-sm font-bold font-serif`}>{c.msg}</p>
      </div>
      {c.action && c.href && (
        <Link href={c.href} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
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
    <div className="bg-white rounded-[2rem] p-6 border border-[#eae6de] shadow-sm hover:shadow-soft transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color] || colors.slate}`}>
          <Icon className="w-6 h-6" />
        </div>
        {delta && (
          <div className="flex items-center gap-0.5 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-[9px] font-black uppercase tracking-tighter">
            +{delta}% <ArrowUpRight className="w-3 h-3" />
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 italic">{label}</h4>
        <p className="text-3xl font-bold text-text-dark font-serif tracking-tighter">{value}</p>
        <p className="text-[10px] font-medium text-slate-400 mt-2 uppercase tracking-widest italic">{subtext}</p>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#f8f7f4] rounded-full blur-3xl -translate-y-8 translate-x-8 opacity-50" />
    </div>
  );
}

export default function SupplierDashboard() {
  const router = useRouter();
  const { data: profile, error, isLoading } = useSWR(`${API}/auth/me`, fetcher);
  const { data: stats, isLoading: statsLoading } = useSWR(`${API}/supplier/stats`, fetcher);

  useEffect(() => {
    if (!isLoading && error?.status === 401) router.push('/auth/login');
  }, [isLoading, error, router]);

  if (isLoading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="animate-pulse text-brand-green font-bold text-center">Configuring Operations Hub...<br/><span className="text-[10px] uppercase opacity-50 font-sans tracking-widest">Supplier V2 Enterprise</span></div></div>;

  if (error && error.status !== 401) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-red-200/20">
          <Store className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-text-dark font-serif mb-3 tracking-tighter">Gateway Synchronization Offline</h1>
        <p className="text-text-muted text-sm max-w-xs mb-10 leading-relaxed font-medium italic">
          We encountered a cross-service error connecting to the supplier core (Error {error.status}). Check system infrastructure.
        </p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-brand-green text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-green/20 hover:scale-105 active:scale-95 transition-all">
          Retry Logic
        </button>
      </div>
    );
  }

  if (!profile) return null;

  // Transform daily analytics for the chart
  const chartData = stats?.dailyAnalytics?.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    revenue: d.revenuePaise / 100,
    orders: d.orderCount
  })).reverse() || [];

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Business Ledger" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <KycBanner profile={{ kycStatus: stats?.kycStatus, kycRejectionReason: profile?.kycRejectionReason }} />

        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-5xl font-bold text-text-dark font-serif tracking-tighter">
              Acknowledge, {profile?.name?.split(' ')[0] || 'Partner'} 👋
            </h2>
            <p className="text-brand-orange font-black text-[10px] mt-2 uppercase tracking-[0.2em] italic">
              Centralizing supply logistics for your agriculture hub // V2.0 Stable
            </p>
          </motion.div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-[#eae6de] shadow-sm">
             <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] flex items-center justify-center text-text-muted">
                <Clock className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mb-1">Last Data Sync</p>
                <p className="text-xs font-bold text-text-dark">Just now</p>
             </div>
          </div>
        </div>

        {/* Core KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 bg-white rounded-[2rem] border border-[#eae6de] animate-pulse" />
            ))
          ) : (
            <>
              <StatCard
                label="Aggregate Revenue"
                value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}`}
                subtext="Total verified sales volume"
                icon={DollarSign}
                color="green"
              />
              <StatCard
                label="Asset Density"
                value={stats?.activeProducts ?? '0'}
                subtext="Items active in market"
                icon={Package}
                color="blue"
              />
              <StatCard
                label="Pipeline Queue"
                value={stats?.pendingOrders ?? '0'}
                subtext="Awaiting fulfillment"
                icon={ShoppingCart}
                color="amber"
              />
              <StatCard
                label="Business Tier"
                value={stats?.kycStatus === 'approved' ? 'Gold' : 'Basic'}
                subtext={stats?.kycStatus === 'approved' ? 'Verified Partner' : 'Identity Incomplete'}
                icon={CheckCircle}
                color={stats?.kycStatus === 'approved' ? 'green' : 'slate'}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-12">
          {/* Market Performance Visualizer */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 border border-[#eae6de] shadow-soft">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-bold text-text-dark font-serif tracking-tighter">Market Velocity</h3>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1 italic">Real-time revenue & order influx tracking</p>
              </div>
              <div className="flex items-center gap-3 bg-[#f8f7f4] p-1 rounded-xl border border-[#eae6de]">
                 <button className="px-4 py-1.5 bg-white rounded-lg text-[9px] font-black uppercase tracking-widest text-text-dark shadow-sm">7D</button>
                 <button className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-text-dark transition-colors">30D</button>
              </div>
            </div>

            <div className="h-[300px] w-full mt-6 relative">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#345243" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#345243" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0efed" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 700, fill: '#69665f' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 700, fill: '#69665f' }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', fontSize: '10px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#345243" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#f8f7f4]/40 rounded-3xl border border-dashed border-[#eae6de]">
                   <BarChart3 className="w-10 h-10 text-slate-200 mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#929285] italic">No Market Velocity Data Recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Operational Radar / Tools */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#eae6de] shadow-soft">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-text-dark font-serif tracking-tighter">Business Assets</h3>
                <Link href="/dashboard/supplier/products" className="p-3 bg-[#f8f7f4] rounded-xl text-text-muted hover:text-text-dark transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Package, label: 'Asset Intake', desc: 'Sync new inventory items', href: '/dashboard/supplier/products/new', color: 'blue' },
                  { icon: History, label: 'Audit Ledger', desc: 'View inventory fluctuations', href: '/dashboard/supplier/products/logs', color: 'purple' },
                  { icon: List, label: 'Operational Hub', desc: 'Process bulk requirements', href: '/dashboard/supplier/orders', color: 'amber' },
                  { icon: ShieldCheck, label: 'Compliance', desc: 'Manage legal certifications', href: '/dashboard/supplier/kyc', color: 'green' },
                ].map(a => (
                  <Link key={a.href} href={a.href} className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8f7f4] hover:bg-white hover:shadow-xl hover:shadow-brand-green/5 transition-all group border border-transparent hover:border-[#eae6de]">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#eae6de] flex items-center justify-center text-text-muted group-hover:bg-brand-green group-hover:text-white group-hover:border-transparent transition-all">
                      <a.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-dark text-[11px] font-black uppercase tracking-widest">{a.label}</p>
                      <p className="text-text-muted text-[10px] italic font-medium truncate">{a.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-green transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Depletion Alert List (New - BPFIS inspired) */}
            <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-[2rem] p-6">
               <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-brand-orange" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Depletion Warnings</h4>
               </div>
               <div className="space-y-2">
                  {stats?.lowStockCount > 0 ? (
                    <p className="text-xs font-bold text-text-dark">{stats.lowStockCount} items require immediate restocking to prevent market dropout.</p>
                  ) : (
                    <p className="text-xs font-medium text-text-muted italic">All operational pipelines are stable.</p>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Fulfillment Queue Block */}
        <div className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft overflow-hidden">
          <div className="p-8 border-b border-[#f8f7f4] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 rounded-xl bg-[#f8f7f4] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-brand-green" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-text-dark font-serif tracking-tighter">Fulfillment Pipeline</h3>
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-[0.2em] italic">Live order processing stream</p>
               </div>
            </div>
            <Link href="/dashboard/supplier/orders" className="px-6 py-2.5 bg-[#f8f7f4] rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dark hover:bg-[#eae6de] transition-colors shadow-sm">
              Process All Orders →
            </Link>
          </div>
          
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-[2rem] bg-[#f8f7f4] flex items-center justify-center relative">
              <ShoppingCart className="w-10 h-10 text-slate-300" />
              <div className="absolute top-0 right-0 w-8 h-8 bg-brand-green/10 rounded-full blur-xl" />
            </div>
            <div>
              <p className="text-text-dark font-serif text-xl font-bold tracking-tight">Queue Synchronized</p>
              <p className="text-text-muted text-xs mt-1 italic font-medium max-w-xs mx-auto">No pending requirements detected in your sector. New farmer requests will materialize here automatically.</p>
            </div>
          </div>

          <div className="px-8 py-5 bg-[#f8f7f4] border-t border-[#eae6de] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">Global Discovery Matrix Active</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold italic tracking-tighter">Encrypted by AgriLink Protocol V2</p>
          </div>
        </div>
      </main>
    </div>
  );
}
