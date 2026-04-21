'use client';

import React from 'react';
import useSWR from 'swr';
import { 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Cpu, 
  Database, 
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function StatCard({ title, value, sub, trend, trendValue, icon: Icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trendValue}
        </div>
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">{sub}</p>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const { data: stats, isLoading: statsLoading } = useSWR(`${API}/auth/admin/stats`, fetcher);
  const { data: health, isLoading: healthLoading } = useSWR(`${API}/auth/admin/health-check`, fetcher);

  if (statsLoading || healthLoading) return null;

  return (
    <div className="space-y-12">
      {/* Platform Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Users" 
          value={stats?.users?.total || 0} 
          sub={`${stats?.users?.farmers || 0} Farmers | ${stats?.users?.suppliers || 0} Suppliers`}
          trend="up"
          trendValue="+12%"
          icon={Users}
        />
        <StatCard 
          title="Pending KYC" 
          value={stats?.kyc?.pending || 0} 
          sub="Requires Administrative Review"
          trend="down"
          trendValue="-5%"
          icon={ShieldCheck}
        />
        <StatCard 
          title="Growth Rate" 
          value={`${stats?.users?.recentRegistrations || 0}`} 
          sub="New users in last 7 days"
          trend="up"
          trendValue="+18%"
          icon={Activity}
        />
        <StatCard 
          title="Platform Security" 
          value="99.9%" 
          sub="No unauthorized breaches"
          trend="up"
          trendValue="STABLE"
          icon={ShieldCheck}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Health Monitoring */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-400" />
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tight">System Infrastructure Health</h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                 All Systems Normal
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {health?.services?.map((service: any) => (
                <div key={service.name} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${service.status === 'UP' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-400'}`} />
                      <span className="text-sm font-bold opacity-80">{service.name}</span>
                   </div>
                   <span className="text-[10px] font-black opacity-40 uppercase">{service.latency}</span>
                </div>
              ))}
           </div>

           <div className="mt-10 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-1 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CPU Load</p>
                    <p className="text-2xl font-black">{health?.system?.cpu}%</p>
                 </div>
              </div>
              <div className="flex-1 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Database className="w-6 h-6 text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Memory Usage</p>
                    <p className="text-2xl font-black">{health?.system?.memory?.percent}% <span className="text-xs text-slate-500 font-medium">({health?.system?.memory?.used}GB / {health?.system?.memory?.total}GB)</span></p>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Node Map Placeholder / Stats */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 flex flex-col">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                 <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Regional Distribution</h3>
           </div>
           
           <div className="flex-1 flex flex-col justify-center space-y-6">
              {[
                { region: 'Karnataka North', count: 420, percent: 45, color: 'bg-green-500' },
                { region: 'Karnataka South', count: 310, percent: 35, color: 'bg-brand-orange' },
                { region: 'Andhra Pradesh', count: 180, percent: 15, color: 'bg-blue-500' },
                { region: 'Maharashtra', count: 65, percent: 5, color: 'bg-slate-400' },
              ].map((r) => (
                <div key={r.region} className="space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-900">{r.region}</span>
                      <span className="text-slate-400">{r.count} Active Nodes</span>
                   </div>
                   <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${r.percent}%` }}
                        className={`h-full ${r.color}`}
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-10 p-5 bg-slate-50 rounded-2xl flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase">
                 Network nodes are successfully synchronized across <span className="text-slate-900 font-black">4 states</span>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
