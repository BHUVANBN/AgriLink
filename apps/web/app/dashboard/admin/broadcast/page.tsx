'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Users, 
  ShieldCheck, 
  Mail, 
  Smartphone,
  Send,
  AlertTriangle,
  History,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  Megaphone,
  Radio,
  Clock,
  CheckCircle2
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function BroadcastPage() {
  const [targetRole, setTargetRole] = useState<'farmer' | 'supplier' | 'all'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { data: stats } = useSWR(`${API}/auth/admin/stats`, fetcher);
  const { data: broadcastHistory } = useSWR(`${API}/auth/admin/audit?action=SYSTEM_BROADCAST&limit=5`, fetcher);

  async function handleBroadcast() {
    if (!subject || !body) {
      toast.error('Manifest Incomplete: Subject and Body required');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch(`${API}/auth/admin/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, subject, body, priority }),
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Broadcast Broadcasted: Sector ${targetRole.toUpperCase()} Engaged`);
        setSubject('');
        setBody('');
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Signal Error: Transmission failed');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <AdminSidebar pageTitle="System Command" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                     <Zap className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="px-4 py-1.5 bg-red-600/5 text-red-600 border border-red-600/20 rounded-full text-[9px] font-bold uppercase tracking-widest animate-pulse">Critical Vector Engaged</div>
               </div>
              <h2 className="text-4xl font-bold text-white font-serif tracking-tighter">{ADMIN_STRINGS.BROADCAST.TITLE}</h2>
              <p className="text-white/30 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1 max-w-xl">{ADMIN_STRINGS.BROADCAST.SUBTITLE}</p>
            </div>

            <div className="hidden xl:flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl shadow-2xl transition-all hover:border-red-600/20">
               <div className="text-center px-6 border-r border-white/5">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1 leading-none">{ADMIN_STRINGS.BROADCAST.REACH_LABEL}</p>
                  <p className="text-2xl font-bold text-white font-serif">{stats?.users?.total || '...'} Nodes</p>
               </div>
               <div className="text-center px-6">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1 leading-none">{ADMIN_STRINGS.BROADCAST.SPEED_LABEL}</p>
                  <p className="text-2xl font-bold text-emerald-500 font-serif">{ADMIN_STRINGS.BROADCAST.SPEED_VALUE}</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Input Console */}
            <div className="lg:col-span-2 space-y-10">
               <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 hover:border-red-600/30 transition-all shadow-2xl relative overflow-hidden group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 pb-10 border-b border-white/5">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Engagement Sector</label>
                        <div className="flex gap-2">
                           {(['all', 'farmer', 'supplier'] as const).map(role => (
                              <button 
                                key={role}
                                onClick={() => setTargetRole(role)}
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${targetRole === role ? 'bg-white text-black border-white' : 'bg-[#0f0f0f] text-white/40 border-white/5 hover:border-white/20'}`}
                              >
                                 {role}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Signal Priority</label>
                        <div className="flex gap-2">
                           {(['low', 'medium', 'high'] as const).map(p => (
                              <button 
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${priority === p ? (p === 'high' ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-600/30' : 'bg-white text-black border-white') : 'bg-[#0f0f0f] text-white/40 border-white/5 hover:border-white/20'}`}
                              >
                                 {p}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Manifest Subject</label>
                        <input 
                           placeholder="Signal Identifier (e.g. Platform Update, Critical Maintenance)"
                           className="w-full bg-[#0f0f0f] border border-white/5 rounded-2xl px-8 py-5 text-lg font-bold text-white font-serif placeholder:text-white/10 focus:ring-1 focus:ring-red-600 transition-all shadow-inner"
                           value={subject}
                           onChange={(e) => setSubject(e.target.value)}
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Payload Content</label>
                        <textarea 
                           placeholder="Detail signal content here... Minimum 30 characters for high-priority vectors."
                           className="w-full h-64 bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 text-[15px] font-medium text-white/80 leading-relaxed placeholder:text-white/10 focus:ring-1 focus:ring-red-600 transition-all shadow-inner"
                           value={body}
                           onChange={(e) => setBody(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                     <div className="flex items-center gap-4 py-4 px-6 bg-red-600/5 border border-red-600/10 rounded-2xl">
                        <Radio className="w-5 h-5 text-red-600 animate-ping" />
                        <p className="text-[9px] font-bold text-red-600/60 uppercase tracking-widest leading-tight">Ready for Transmission // Multi-channel Active</p>
                     </div>
                     <button 
                       onClick={handleBroadcast}
                       disabled={isSending}
                       className="px-16 py-6 bg-white text-black hover:bg-red-600 hover:text-white rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 flex items-center gap-4 group/send disabled:opacity-50"
                     >
                        {isSending ? 'Transmitting Signal...' : 'Initiate Broadcast Sequence'}
                        {!isSending && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-600 rounded-full blur-[100px] -translate-y-24 translate-x-24 opacity-5 group-hover:scale-125 transition-transform" />
               </div>
            </div>

            {/* Signal Logs / History */}
            <div className="space-y-8">
               <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-10 shadow-2xl flex flex-col group overflow-hidden relative">
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5 relative z-10">
                     <div className="w-10 h-10 bg-white/5 text-white/60 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <History className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white font-serif italic">{ADMIN_STRINGS.BROADCAST.HISTORY_TITLE}</h3>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 italic mt-0.5">{ADMIN_STRINGS.BROADCAST.HISTORY_SUB}</p>
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 relative z-10">
                     {broadcastHistory?.items?.length > 0 ? (
                       broadcastHistory.items.map((log: any, i: number) => (
                         <div key={log.id} className="flex items-center justify-between group/item cursor-pointer">
                            <div className="flex items-center gap-4">
                               <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover/item:text-white transition-all">
                                  <CheckCircle2 className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-[12px] font-bold text-white font-serif italic mb-0.5 truncate max-w-[150px]">{log.metadata?.subject || 'Platform Signal'}</p>
                                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 leading-none">{log.metadata?.targetRole || 'ALL'} // {new Date(log.createdAt).toLocaleDateString()}</p>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/10 group-hover/item:text-red-500 transition-all" />
                         </div>
                       ))
                     ) : (
                       <div className="py-10 text-center opacity-20 italic">
                          <p className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em] mb-1 leading-none">Archive Null</p>
                          <p className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em] leading-none">Scanning Cluster...</p>
                       </div>
                     )}
                  </div>

                  <div className="pt-8 mt-10 border-t border-white/5 border-dashed relative z-10">
                     <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] text-center italic">Archive indexed // Temporal Records Intact</p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-5 transition-opacity" />
               </div>

               {/* Protocol Alert */}
               <div className="bg-red-600/5 border border-red-600/10 rounded-[2.5rem] p-8 transition-all hover:bg-red-600/10">
                  <div className="flex items-start gap-4">
                     <AlertTriangle className="w-6 h-6 text-red-600 mt-1 shrink-0" />
                     <div>
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic mb-2">Protocol: High-Impact Warning</p>
                        <p className="text-[11px] font-medium text-white/40 italic leading-relaxed">Broadcasts are immutable and cross-service. Multi-channel delivery includes Push, Email, and In-App persistence. Review all manifests before firing signal.</p>
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
