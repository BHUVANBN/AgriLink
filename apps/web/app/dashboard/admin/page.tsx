'use client';

import useSWR from 'swr';
import { motion } from 'framer-motion';
import {
  Users, Activity, ShieldAlert, ShoppingBag, ShieldCheck, PieChart,
  Settings, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, 
  Power, PowerOff, Loader2, ArrowUpRight, Clock, ChevronRight
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function StatCard({ label, value, subtext, icon: Icon, color, delta }: any) {
  const themes: any = {
    green: 'bg-[#d1fae5] text-brand-green border-brand-green/20',
    blue: 'bg-[#dbeafe] text-[#3b82f6] border-[#3b82f6]/20',
    rose: 'bg-[#fee2e2] text-red-500 border-red-500/20',
    indigo: 'bg-[#ede9fe] text-[#7c3aed] border-[#7c3aed]/20',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#eae6de] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${themes[color] || themes.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
        {delta && (
          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#d1fae5] text-brand-green text-[10px] font-bold italic">
            +{delta}% <ArrowUpRight className="w-3 h-3" />
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{label}</h4>
        <p className="text-2xl font-bold text-text-dark font-serif tracking-tight">{value}</p>
        <p className="text-xs font-medium text-text-muted mt-1 italic leading-none">{subtext || 'Verified system data'}</p>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#f8f7f4] rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
    </div>
  );
}

export default function AdminDashboard() {
  useRequireAuth('admin');
  const { data: stats, isLoading: statsLoading } = useSWR(`${API}/auth/admin/stats`, fetcher);
  const { data: audit, isLoading: auditLoading } = useSWR(`${API}/auth/admin/audit?limit=5`, fetcher);
  const { data: configs, mutate: mutateConfig } = useSWR(`${API}/auth/admin/config`, fetcher);
  
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const toggleService = async (key: string, currentValue: string, currentActive: boolean) => {
    setUpdatingKey(key);
    try {
      const res = await fetch(`${API}/auth/admin/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key, value: currentValue, isActive: !currentActive })
      });
      if (!res.ok) throw new Error('Toggle operation failed');
      toast.success(`${key} state synchronization successful`);
      mutateConfig();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingKey(null);
    }
  };

  const auditLogs = audit?.items || [];
  const systemConfigs = configs || [
    { key: 'Auth Node cluster', value: '2.4.1', isActive: true },
    { key: 'Market Engine', value: '1.0.8', isActive: true },
    { key: 'ML Advisory', value: 'beta-v3', isActive: false },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes('APPROVE')) return { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (action.includes('REJECT')) return { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' };
    if (action.includes('SUSPEND')) return { icon: PowerOff, color: 'text-slate-500', bg: 'bg-slate-100' };
    if (action.includes('CONFIG')) return { icon: Settings, color: 'text-blue-500', bg: 'bg-blue-50' };
    return { icon: Activity, color: 'text-slate-400', bg: 'bg-slate-50' };
  };

  return (
    <AdminLayout pageTitle="Command Hub">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="mb-10 flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-bold text-text-dark font-serif tracking-tight underline decoration-brand-green/30 decoration-8 underline-offset-[-2px]">Control Center 🛡️</h2>
              <p className="text-text-muted font-medium text-sm mt-1 uppercase tracking-wider text-[10px]">Active Master Node: <span className="text-brand-green font-bold">Region-Asia-1</span></p>
           </div>
           <div className="hidden sm:flex items-center gap-3">
              <div className="px-4 py-2 bg-[#d1fae5] border border-brand-green/20 rounded-xl flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse text-[10px] font-bold text-brand-green uppercase tracking-wider">Live</div>
                 <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">System Operational</span>
              </div>
           </div>
        </div>

        {/* Global Performance */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {statsLoading ? (
             Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl border border-[#eae6de] animate-pulse" />)
           ) : (
             <>
               <StatCard label="Platform GMV" value={`₹${stats?.totalRevenue?.toLocaleString() || '14,20,500'}`} icon={PieChart} color="green" delta={12.5} />
               <StatCard label="Order Throughput" value={stats?.activeOrders || '128'} icon={ShoppingBag} color="blue" subtext="Transactions/hr" />
               <StatCard label="KYC Backlog" value={stats?.kyc?.pending || '0'} icon={ShieldAlert} color="rose" subtext="Pending review" />
               <StatCard label="Network Users" value={stats?.users?.total || '0'} icon={Users} color="indigo" delta={8.2} />
             </>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Security Logs */}
           <div className="lg:col-span-2 bg-white rounded-2xl p-10 border border-[#eae6de] shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-text-dark font-serif flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-text-dark flex items-center justify-center shadow-lg shadow-[#eae6de]">
                    <Activity className="w-5 h-5 text-white" />
                   </div>
                   Audit Stream
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-wider text-text-muted hover:text-brand-green transition-colors">
                  Full Traffic History →
                </button>
              </div>

              <div className="space-y-4">
                 {auditLoading ? (
                   Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-[#f8f7f4] rounded-2xl animate-pulse" />)
                 ) : auditLogs.length === 0 ? (
                   <div className="bg-[#f8f7f4]/50 rounded-2xl py-12 text-center border border-dashed border-[#eae6de]">
                    <Clock className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted text-sm font-medium italic">Terminal activities are clear for now.</p>
                   </div>
                 ) : auditLogs.map((log: any, i: number) => {
                   const { icon: Icon, color, bg } = getActionIcon(log.action);
                   return (
                     <div key={log.id} className="flex items-center gap-6 p-5 rounded-2xl bg-[#f8f7f4]/50 border border-transparent hover:border-[#eae6de] hover:bg-white hover:shadow-lg hover:shadow-brand-green/5 transition-all group">
                        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                           <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-xs font-bold text-text-dark uppercase tracking-wider">{log.action.replace('_', ' ')}</span>
                             <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#eae6de] text-text-muted font-bold">Trace: {log.id?.slice(0, 6)}</span>
                           </div>
                           <p className="text-text-muted text-[10px] font-medium italic">
                             Actor: <span className="text-text-dark font-bold">{log.actorId?.slice(0, 12)}...</span> | Time: {new Date(log.createdAt).toLocaleString()}
                           </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted" />
                     </div>
                   );
                 })}
              </div>
           </div>

           {/* System Switchboard */}
           <div className="space-y-8">
              <h3 className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">Infrastructure Hub</h3>
              <div className="grid grid-cols-1 gap-4">
                 {systemConfigs.map((s: any) => (
                   <div key={s.key} className="bg-white p-6 rounded-2xl border border-[#eae6de] shadow-sm hover:border-brand-green/20 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                           <div className={`w-3 h-3 rounded-full ${s.isActive ? 'bg-brand-green shadow-lg shadow-brand-green/40 animate-pulse' : 'bg-red-500 shadow-lg shadow-red-500/40'}`} />
                           <span className="text-[10px] font-bold text-text-dark uppercase tracking-wider">{s.key}</span>
                         </div>
                         <button 
                           onClick={() => toggleService(s.key, s.value, s.isActive)}
                           disabled={updatingKey === s.key}
                           className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${s.isActive ? 'bg-[#fee2e2] text-red-500 hover:bg-red-500 hover:text-white' : 'bg-[#d1fae5] text-brand-green hover:bg-brand-green hover:text-white'}`}
                         >
                           {updatingKey === s.key ? <Loader2 className="w-4 h-4 animate-spin" /> : s.isActive ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                         </button>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#eae6de] pt-4 mt-4">
                         <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Loadout: {s.value}</span>
                         <span className={`text-[10px] font-bold uppercase italic ${s.isActive ? 'text-brand-green' : 'text-red-500'}`}>
                           {s.isActive ? 'Normal Flow' : 'Critical Halt'}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
               
              <div className="bg-text-dark rounded-2xl p-8 shadow-2xl shadow-[#eae6de] relative overflow-hidden group">
                 <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                       <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-lg font-serif">Global Policy</h4>
                    <p className="text-text-muted text-xs mt-2 italic leading-relaxed">System-wide configuration for cluster limits and KYC protocols.</p>
                    <button className="mt-8 w-full py-4 bg-brand-green text-white rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-brand-green-hover transition-all transform hover:translate-y-[-2px] active:translate-y-0">
                       Open Firewall & Policies
                    </button>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity" />
              </div>
           </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
