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
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function ConfigPage() {
  const { data: configs, mutate, isLoading } = useSWR(`${API}/auth/admin/config`, fetcher);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: healthNodes, isLoading: isHealthLoading } = useSWR(`${API}/auth/admin/health-check`, fetcher, { refreshInterval: 5000 });

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
        toast.success(`Protocol Updated: ${key.toUpperCase()}`);
        mutate();
        setNewKey('');
        setNewValue('');
      } else {
        toast.error('Protocol Update Refused');
      }
    } catch {
      toast.error('Network Error during config sync');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <AdminSidebar pageTitle="System Architecture" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-white font-serif tracking-tighter">{ADMIN_STRINGS.INFRASTRUCTURE.TITLE}</h2>
              <p className="text-emerald-500 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1">{ADMIN_STRINGS.INFRASTRUCTURE.SUBTITLE}</p>
            </div>
            
            <button 
              onClick={() => mutate()}
              className="px-10 py-5 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-[1.8rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-4 group"
            >
               <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" /> Refresh Cluster Status
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Node Health */}
            <div className="lg:col-span-2 space-y-10">
               <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 hover:border-emerald-600/20 transition-all shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-12">
                     <div>
                        <h3 className="text-3xl font-bold text-white font-serif tracking-tight">{ADMIN_STRINGS.INFRASTRUCTURE.TOPOLOGY_TITLE}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">{ADMIN_STRINGS.INFRASTRUCTURE.TOPOLOGY_SUB}</p>
                     </div>
                     <Network className="w-8 h-8 text-white/10" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     <AnimatePresence mode="popLayout">
                        {isHealthLoading ? (
                           Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)
                        ) : healthNodes?.services?.map((node: any, i: number) => (
                           <motion.div 
                             key={node.name}
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: i * 0.05 }}
                             className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group/node"
                           >
                              <div className="flex items-center justify-between mb-4">
                                 <div className={`w-8 h-8 rounded-lg ${node.status === 'UP' ? 'bg-emerald-600/10 text-emerald-600' : 'bg-red-600/10 text-red-600'} flex items-center justify-center`}>
                                    <Server className="w-4 h-4" />
                                 </div>
                                 <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest animate-pulse ${node.status === 'UP' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{node.status}</div>
                              </div>
                              <p className="text-[12px] font-black text-white font-serif italic mb-1 uppercase tracking-tight truncate">{node.name}</p>
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                 <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Latency</p>
                                 <p className={`text-[9px] font-black uppercase tracking-widest ${node.status === 'UP' ? 'text-emerald-500' : 'text-white/40'}`}>{node.latency}</p>
                              </div>
                           </motion.div>
                        ))}
                     </AnimatePresence>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-[90px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-5 transition-opacity" />
               </div>

               {/* Configuration Store */}
               <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-12 hover:border-white/10 transition-all shadow-2xl overflow-hidden relative group">
                  <div className="flex items-center justify-between mb-12 relative z-10">
                     <div>
                        <h3 className="text-3xl font-bold text-white font-serif italic uppercase">{ADMIN_STRINGS.INFRASTRUCTURE.PROTOCOL_TITLE}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic mt-1">{ADMIN_STRINGS.INFRASTRUCTURE.PROTOCOL_SUB}</p>
                     </div>
                     <Lock className="w-8 h-8 text-white/10" />
                  </div>

                  {/* Add New Config */}
                  <div className="flex flex-col md:flex-row gap-4 mb-10 p-6 bg-white/5 rounded-3xl border border-white/5 border-dashed relative z-10">
                     <input 
                        placeholder="CONFIG_IDENTIFIER" 
                        className="flex-1 bg-transparent border-none text-[12px] font-black uppercase tracking-widest text-white focus:ring-0 placeholder:text-white/20"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value.toUpperCase())}
                     />
                     <div className="w-px h-8 bg-white/10 hidden md:block" />
                     <input 
                        placeholder="Configuration Payload Value" 
                        className="flex-1 bg-transparent border-none text-[12px] font-bold text-white/60 focus:ring-0 placeholder:text-white/10"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                     />
                     <button 
                       onClick={() => updateConfig(newKey, newValue, true)}
                       disabled={!newKey || !newValue || isUpdating}
                       className="px-8 py-3 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
                     >
                        <Plus className="w-4 h-4" /> Inject Protocol
                     </button>
                  </div>

                  <div className="space-y-4 relative z-10">
                     {configs?.map((c: any) => (
                       <div key={c.key} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group/cfg">
                          <div className="flex items-center gap-6">
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover/cfg:text-white group-hover/cfg:bg-white/10 transition-all">
                                <Terminal className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[12px] font-black text-white font-serif italic uppercase tracking-widest leading-none mb-1">{c.key}</p>
                                <p className="text-[11px] font-bold text-white/30 truncate max-w-[200px]">{c.value}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${c.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                {c.isActive ? 'Active' : 'Dormant'}
                             </div>
                             <div className="w-px h-6 bg-white/10" />
                             <button 
                              onClick={() => updateConfig(c.key, c.value, !c.isActive)}
                              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-emerald-500 transition-all"
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
               <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-10 shadow-2xl flex flex-col group overflow-hidden relative">
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5 relative z-10">
                     <div className="w-10 h-10 bg-white/5 text-white/60 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white font-serif italic">{ADMIN_STRINGS.INFRASTRUCTURE.RESOURCE_TITLE}</h3>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 italic mt-0.5">{ADMIN_STRINGS.INFRASTRUCTURE.RESOURCE_SUB}</p>
                     </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">CPU Saturation</p>
                           <p className="text-sm font-black text-white italic">{healthNodes?.system?.cpu || 0}%</p>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${healthNodes?.system?.cpu || 0}%` }} 
                             className="h-full bg-emerald-500" 
                            />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">RAM Allocation</p>
                           <p className="text-sm font-black text-white italic">{healthNodes?.system?.memory?.used || 0} GB / {healthNodes?.system?.memory?.total || 16} GB</p>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${healthNodes?.system?.memory?.percent || 0}%` }} 
                             className="h-full bg-white/60" 
                            />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Cluster Node Count</p>
                           <p className="text-sm font-black text-white italic">{healthNodes?.services?.length || 0} Unified Nodes</p>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: '100%' }} 
                             className="h-full bg-emerald-500/20" 
                            />
                        </div>
                     </div>
                  </div>

                  <div className="mt-12 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between relative z-10">
                     <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Cluster Optimization: Maximum</p>
                     <div className="flex gap-1">
                        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-1 h-3 bg-emerald-500/40 rounded-full" />)}
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-5 transition-opacity" />
               </div>

               {/* Admin Tip */}
               <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 transition-all hover:bg-white/10">
                  <div className="flex items-start gap-4">
                     <AlertCircle className="w-6 h-6 text-white/40 mt-1 shrink-0" />
                     <div>
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest italic mb-2">Architect Protocol</p>
                        <p className="text-[11px] font-medium text-white/20 italic leading-relaxed">Dynamic configurations take effect immediately across all service instances via the shared Postgres config store. Avoid injecting destructive payloads into critical keys.</p>
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
