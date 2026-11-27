'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  Activity, 
  Settings, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Zap, 
  Server,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Save,
  Trash2,
  RefreshCcw,
  Network,
  Lock,
  MessageSquare,
  Globe,
  MoreVertical,
  Terminal,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function ConfigPage() {
  const { data: configs, mutate, isLoading } = useSWR(`${API}/auth/admin/config`, fetcher);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: healthNodes, isLoading: isHealthLoading } = useSWR(`${API}/auth/admin/health-check`, fetcher, { refreshInterval: 15000 });
  const healthyCount: number = (healthNodes?.services ?? []).filter((n: any) => n.status === 'UP').length;
  const allHealthy = !!healthNodes && healthyCount === (healthNodes.services?.length ?? 0);

  async function updateConfig(key: string, value: string, isActive: boolean) {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API}/auth/admin/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, isActive }),
        credentials: 'include'
      });
      if (res.ok) {
        toast.success(`Saved ${key}`);
        mutate();
        setNewKey('');
        setNewValue('');
      } else {
        toast.error('Could not save the setting');
      }
    } catch {
      toast.error('Network Error during config sync');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="font-sans">
      
      <main>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 font-serif tracking-tighter">{ADMIN_STRINGS.INFRASTRUCTURE.TITLE}</h2>
              <p className="text-emerald-500 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1">{ADMIN_STRINGS.INFRASTRUCTURE.SUBTITLE}</p>
            </div>
            
            <button 
              onClick={() => mutate()}
              className="px-10 py-5 bg-slate-900 text-white hover:bg-emerald-500 hover:text-white rounded-[1.8rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-4 group"
            >
               <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Node Health */}
            <div className="lg:col-span-2 space-y-10">
               <div className="bg-white border border-slate-200 rounded-[3rem] p-12 hover:border-emerald-600/20 transition-all shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-12">
                     <div>
                        <h3 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">{ADMIN_STRINGS.INFRASTRUCTURE.TOPOLOGY_TITLE}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{ADMIN_STRINGS.INFRASTRUCTURE.TOPOLOGY_SUB}</p>
                     </div>
                     <Network className="w-8 h-8 text-slate-300" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     <AnimatePresence mode="popLayout">
                        {isHealthLoading ? (
                           Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)
                        ) : healthNodes?.services?.map((node: any, i: number) => (
                           <motion.div 
                             key={node.name}
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: i * 0.05 }}
                             className="bg-white border border-slate-200 rounded-2xl p-6 hover:bg-slate-100 transition-all group/node"
                           >
                              <div className="flex items-center justify-between mb-4">
                                 <div className={`w-8 h-8 rounded-lg ${node.status === 'UP' ? 'bg-emerald-600/10 text-emerald-600' : 'bg-red-600/10 text-red-600'} flex items-center justify-center`}>
                                    <Server className="w-4 h-4" />
                                 </div>
                                 <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest animate-pulse ${node.status === 'UP' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{node.status}</div>
                              </div>
                              <p className="text-[12px] font-black text-slate-900 font-serif italic mb-1 uppercase tracking-tight truncate">{node.name}</p>
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Latency</p>
                                 <p className={`text-[9px] font-black uppercase tracking-widest ${node.status === 'UP' ? 'text-emerald-500' : 'text-slate-500'}`}>{node.latency}</p>
                              </div>
                           </motion.div>
                        ))}
                     </AnimatePresence>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-[90px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-5 transition-opacity" />
               </div>

               {/* Configuration Store */}
               <div className="bg-white border border-slate-200 rounded-[3rem] p-12 hover:border-slate-300 transition-all shadow-2xl overflow-hidden relative group">
                  <div className="flex items-center justify-between mb-12 relative z-10">
                     <div>
                        <h3 className="text-3xl font-bold text-slate-900 font-serif italic uppercase">{ADMIN_STRINGS.INFRASTRUCTURE.PROTOCOL_TITLE}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mt-1">{ADMIN_STRINGS.INFRASTRUCTURE.PROTOCOL_SUB}</p>
                     </div>
                     <Lock className="w-8 h-8 text-slate-300" />
                  </div>

                  {/* Add New Config */}
                  <div className="flex flex-col md:flex-row gap-4 mb-10 p-6 bg-white rounded-3xl border border-slate-200 border-dashed relative z-10">
                     <input 
                        placeholder="CONFIG_IDENTIFIER" 
                        className="flex-1 bg-transparent border-none text-[12px] font-black uppercase tracking-widest text-slate-900 focus:ring-0 placeholder:text-slate-400"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value.toUpperCase())}
                     />
                     <div className="w-px h-8 bg-slate-100 hidden md:block" />
                     <input 
                        placeholder="Value" 
                        className="flex-1 bg-transparent border-none text-[12px] font-bold text-slate-600 focus:ring-0 placeholder:text-slate-300"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                     />
                     <button 
                       onClick={() => updateConfig(newKey, newValue, true)}
                       disabled={!newKey || !newValue || isUpdating}
                       className="px-8 py-3 bg-slate-900 text-white hover:bg-emerald-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
                     >
                        <Plus className="w-4 h-4" /> Save setting
                     </button>
                  </div>

                  <div className="space-y-4 relative z-10">
                     {configs?.map((c: any) => (
                       <div key={c.key} className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all group/cfg">
                          <div className="flex items-center gap-6">
                             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover/cfg:text-slate-900 group-hover/cfg:bg-slate-100 transition-all">
                                <Terminal className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[12px] font-black text-slate-900 font-serif italic uppercase tracking-widest leading-none mb-1">{c.key}</p>
                                <p className="text-[11px] font-bold text-slate-400 truncate max-w-[200px]">{c.value}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${c.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                {c.isActive ? 'Active' : 'Dormant'}
                             </div>
                             <div className="w-px h-6 bg-slate-100" />
                             <button 
                              onClick={() => updateConfig(c.key, c.value, !c.isActive)}
                              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-emerald-500 transition-all"
                             >
                                <Settings className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-[90px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-5 transition-opacity" />
               </div>
            </div>

            {/* Right: Summary & Infrastructure Log */}
            <div className="space-y-8">
               <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl flex flex-col group overflow-hidden relative">
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200 relative z-10">
                     <div className="w-10 h-10 bg-white text-slate-600 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-slate-900 font-serif italic">{ADMIN_STRINGS.INFRASTRUCTURE.RESOURCE_TITLE}</h3>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic mt-0.5">{ADMIN_STRINGS.INFRASTRUCTURE.RESOURCE_SUB}</p>
                     </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">CPU Saturation</p>
                           <p className="text-sm font-black text-slate-900 italic">{healthNodes?.system?.cpu || 0}%</p>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${healthNodes?.system?.cpu || 0}%` }} 
                             className="h-full bg-emerald-500" 
                            />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">RAM Allocation</p>
                           <p className="text-sm font-black text-slate-900 italic">{healthNodes?.system?.memory?.used || 0} GB / {healthNodes?.system?.memory?.total || 16} GB</p>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${healthNodes?.system?.memory?.percent || 0}%` }} 
                             className="h-full bg-slate-900" 
                            />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Healthy services</p>
                           <p className="text-sm font-black text-slate-900 italic">{healthyCount} / {healthNodes?.services?.length || 0}</p>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${healthNodes?.services?.length ? (healthyCount / healthNodes.services.length) * 100 : 0}%` }} 
                             className="h-full bg-emerald-500" 
                            />
                        </div>
                     </div>
                  </div>

                  <div className={`mt-12 p-6 rounded-2xl relative z-10 border ${allHealthy ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                     <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${allHealthy ? 'text-emerald-600' : 'text-red-600'}`}>
                       {healthNodes ? (allHealthy ? 'All services healthy' : `${(healthNodes.services?.length ?? 0) - healthyCount} service(s) down`) : 'Checking…'}
                     </p>
                     <p className="text-[10px] text-slate-500 mt-1">Detailed metrics and alerts: Grafana (make monitoring).</p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-5 transition-opacity" />
               </div>

               {/* Admin Tip */}
               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 transition-all hover:bg-slate-100">
                  <div className="flex items-start gap-4">
                     <AlertCircle className="w-6 h-6 text-slate-500 mt-1 shrink-0" />
                     <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-2">About settings</p>
                        <p className="text-[11px] font-medium text-slate-400 italic leading-relaxed">Settings are stored in the auth database. Change them carefully — services read them at runtime.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
