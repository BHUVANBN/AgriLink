'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  Users, 
  ShieldCheck, 
  ShoppingCart, 
  TrendingUp,
  Activity,
  UserPlus,
  AlertCircle,
  Clock,
  ChevronRight,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useRouter } from 'next/navigation';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function StatCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-red-600/30 transition-all">
       <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${color}-600/10 text-${color}-600 shadow-xl group-hover:scale-110 transition-transform`}>
             <Icon className="w-7 h-7" />
          </div>
          <div className="p-3 bg-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-white/40">Real-time</div>
       </div>
       <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">{label}</h3>
       <div className="flex items-end gap-3">
          <p className="text-4xl font-bold text-white font-serif tracking-tighter">{value}</p>
          <p className={`text-[10px] font-bold uppercase tracking-widest text-${color}-600 mb-1.5`}>{sub}</p>
       </div>
       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-30 group-hover:scale-125 transition-transform" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: stats, isLoading } = useSWR(`${API}/auth/admin/stats`, fetcher);
  const { data: kycQueue } = useSWR(`${API}/auth/admin/kyc-queue`, fetcher);
  const { data: trendData } = useSWR(`${API}/auth/admin/stats/registrations`, fetcher);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <AdminSidebar pageTitle="Global Overview" />

      <main className="lg:ml-72 p-6 lg:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-white font-serif tracking-tighter">{ADMIN_STRINGS.DASHBOARD.TITLE}</h2>
              <p className="text-red-600 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1">{ADMIN_STRINGS.DASHBOARD.SUBTITLE}</p>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 shadow-lg">
               <div className="text-center px-4 border-r border-white/5">
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-2 leading-none">{ADMIN_STRINGS.DASHBOARD.PULSE_LABEL}</p>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <p className="text-lg font-bold text-white font-serif leading-none">{ADMIN_STRINGS.DASHBOARD.PULSE_STABLE}</p>
                  </div>
               </div>
               <div className="text-center px-8">
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-2 leading-none">{ADMIN_STRINGS.DASHBOARD.NODES_LABEL}</p>
                  <p className="text-lg font-bold text-white font-serif leading-none">{ADMIN_STRINGS.DASHBOARD.NODES_STABLE}</p>
               </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                 <StatCard label={ADMIN_STRINGS.DASHBOARD.STATS.IDENTITIES} value={stats?.users?.total} sub={`${stats?.users?.farmers} Farmers`} icon={Users} color="blue" />
                 <StatCard label={ADMIN_STRINGS.DASHBOARD.STATS.KYC} value={`${stats?.kyc?.approved}`} sub={`${stats?.kyc?.pending} Pending`} icon={ShieldCheck} color="emerald" />
                 <StatCard label={ADMIN_STRINGS.DASHBOARD.STATS.ACQUISITIONS} value={stats?.users?.recentRegistrations} sub="+12% WoW" icon={UserPlus} color="red" />
                 <StatCard label={ADMIN_STRINGS.DASHBOARD.STATS.INTEGRITY} value="High" sub="0 Critical Failures" icon={Activity} color="amber" />
              </div>

              {/* Middle Grid: Monitoring & Growth */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {/* Growth Graph */}
                 <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-12 hover:border-red-600/20 transition-all shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-12 relative z-10">
                       <div>
                          <h3 className="text-3xl font-bold text-white font-serif tracking-tight">{ADMIN_STRINGS.DASHBOARD.CHARTS.GROWTH_TITLE}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">{ADMIN_STRINGS.DASHBOARD.CHARTS.GROWTH_SUB}</p>
                       </div>
                       <button className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all"><TrendingUp className="w-5 h-5" /></button>
                    </div>

                    <div className="h-[400px] w-full relative z-10 pr-4">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={trendData || []}>
                           <defs>
                             <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                           <XAxis dataKey="name" stroke="#ffffff30" fontSize={11} axisLine={false} tickLine={false} tick={{dy: 10}} />
                           <YAxis stroke="#ffffff30" fontSize={11} axisLine={false} tickLine={false} />
                           <Tooltip 
                             contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} 
                             itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                             labelStyle={{ display: 'none' }}
                           />
                           <Area type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 {/* KYC Decision Queue Quickview */}
                 <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col group">
                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5 relative z-10">
                       <div className="w-10 h-10 bg-amber-600/10 text-amber-600 rounded-xl flex items-center justify-center">
                          <Clock className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-white font-serif italic">{ADMIN_STRINGS.DASHBOARD.QUEUE.TITLE}</h3>
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/30 italic">{ADMIN_STRINGS.DASHBOARD.QUEUE.SUB}</p>
                       </div>
                    </div>

                    <div className="flex-1 space-y-6 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                       {kycQueue?.users?.length > 0 ? (
                         kycQueue.users.slice(0, 4).map((user: any, i: number) => (
                           <motion.div 
                             key={user.id} 
                             whileHover={{ x: 5 }} 
                             onClick={() => router.push('/dashboard/admin/users')}
                             className="flex items-center justify-between group/item cursor-pointer"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover/item:text-white transition-all italic font-serif">
                                    {user.companyName?.[0] || 'S'}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-[13px] font-bold text-white font-serif italic truncate">{user.companyName || 'Supplier Node'}</p>
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1 italic">Awaiting Audit</p>
                                 </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-white/10 group-hover/item:text-red-500 transition-all" />
                           </motion.div>
                         ))
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShieldCheck className="w-12 h-12 text-white/5 mb-6 opacity-40 shrink-0" />
                            <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] italic">Queue is clear // Satisfactory compliance level</p>
                         </div>
                       )}
                    </div>

                    <div className="pt-8 border-t border-white/5 mt-auto relative z-10">
                       <button className="w-full py-4 bg-white/5 hover:bg-white text-white/60 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                          Enter Decision Hub
                       </button>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 rounded-full blur-[80px] -translate-y-12 translate-x-12 opacity-5 group-hover:scale-125 transition-transform" />
                 </div>
              </div>

              {/* Bottom: Integrity Alerts */}
              <div className="mt-12 p-8 bg-red-600/5 border border-red-600/10 rounded-[3rem] flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-red-600/20 text-red-600 rounded-2xl flex items-center justify-center">
                       <AlertCircle className="w-7 h-7" />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold text-white font-serif italic mb-1 uppercase tracking-tight">Security Integrity Vector</h4>
                       <p className="text-[11px] text-white/40 font-bold italic">Critical alerts and system unauthorized access attempts will populate here. Standard protocol: Active-Lockdown.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 pr-6">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest italic animate-pulse">Scanning Nodes...</span>
                 </div>
              </div>
            </>
          )}
        </div>
      </main>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffffff10; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffffff20; }
      `}</style>
    </div>
  );
}
