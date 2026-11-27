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
      toast.error('Please add a subject and a message');
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
      toast.error('Could not send the announcement');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="font-sans">
      
      <main>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                     <Zap className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="px-4 py-1.5 bg-red-600/5 text-red-600 border border-red-600/20 rounded-full text-[9px] font-bold uppercase tracking-widest animate-pulse">Announcement</div>
               </div>
              <h2 className="text-4xl font-bold text-slate-900 font-serif tracking-tighter">{ADMIN_STRINGS.BROADCAST.TITLE}</h2>
              <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1 max-w-xl">{ADMIN_STRINGS.BROADCAST.SUBTITLE}</p>
            </div>

            <div className="hidden xl:flex items-center gap-6 p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl transition-all hover:border-red-600/20">
               <div className="text-center px-6 border-r border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">{ADMIN_STRINGS.BROADCAST.REACH_LABEL}</p>
                  <p className="text-2xl font-bold text-slate-900 font-serif">{stats?.users?.total ?? '…'}</p>
               </div>
               <div className="text-center px-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">{ADMIN_STRINGS.BROADCAST.SPEED_LABEL}</p>
                  <p className="text-2xl font-bold text-emerald-500 font-serif">{ADMIN_STRINGS.BROADCAST.SPEED_VALUE}</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Input Console */}
            <div className="lg:col-span-2 space-y-10">
               <div className="bg-white border border-slate-200 rounded-[3rem] p-12 hover:border-red-600/30 transition-all shadow-2xl relative overflow-hidden group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 pb-10 border-b border-slate-200">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Audience</label>
                        <div className="flex gap-2">
                           {(['all', 'farmer', 'supplier'] as const).map(role => (
                              <button 
                                key={role}
                                onClick={() => setTargetRole(role)}
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${targetRole === role ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                              >
                                 {role}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Priority</label>
                        <div className="flex gap-2">
                           {(['low', 'medium', 'high'] as const).map(p => (
                              <button 
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${priority === p ? (p === 'high' ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-600/30' : 'bg-slate-900 text-white border-slate-900') : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                              >
                                 {p}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Subject</label>
                        <input 
                           placeholder="e.g. Monsoon advisory"
                           className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-lg font-bold text-slate-900 font-serif placeholder:text-slate-300 focus:ring-1 focus:ring-red-600 transition-all shadow-inner"
                           value={subject}
                           onChange={(e) => setSubject(e.target.value)}
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Message</label>
                        <textarea 
                           placeholder="Write the announcement (at least 10 characters)"
                           className="w-full h-64 bg-white border border-slate-200 rounded-3xl p-8 text-[15px] font-medium text-slate-700 leading-relaxed placeholder:text-slate-300 focus:ring-1 focus:ring-red-600 transition-all shadow-inner"
                           value={body}
                           onChange={(e) => setBody(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="mt-12 pt-10 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                     <div className="flex items-center gap-4 py-4 px-6 bg-red-600/5 border border-red-600/10 rounded-2xl">
                        <Radio className="w-5 h-5 text-red-600 animate-ping" />
                        <p className="text-[9px] font-bold text-red-600/60 uppercase tracking-widest leading-tight">Ready to send</p>
                     </div>
                     <button 
                       onClick={handleBroadcast}
                       disabled={isSending}
                       className="px-16 py-6 bg-slate-900 text-white hover:bg-red-600 hover:text-white rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 group/send disabled:opacity-50"
                     >
                        {isSending ? 'Sending…' : 'Send announcement'}
                        {!isSending && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-600 rounded-full blur-[100px] -translate-y-24 translate-x-24 opacity-5 group-hover:scale-125 transition-transform" />
               </div>
            </div>

            {/* Signal Logs / History */}
            <div className="space-y-8">
               <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl flex flex-col group overflow-hidden relative">
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200 relative z-10">
                     <div className="w-10 h-10 bg-white text-slate-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <History className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-slate-900 font-serif italic">{ADMIN_STRINGS.BROADCAST.HISTORY_TITLE}</h3>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic mt-0.5">{ADMIN_STRINGS.BROADCAST.HISTORY_SUB}</p>
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 relative z-10">
                     {broadcastHistory?.items?.length > 0 ? (
                       broadcastHistory.items.map((log: any, i: number) => (
                         <div key={log.id} className="flex items-center justify-between group/item cursor-pointer">
                            <div className="flex items-center gap-4">
                               <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover/item:text-slate-900 transition-all">
                                  <CheckCircle2 className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-[12px] font-bold text-slate-900 font-serif italic mb-0.5 truncate max-w-[150px]">{log.metadata?.subject || 'Announcement'}</p>
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{log.metadata?.targetRole || 'all'} · {new Date(log.createdAt).toLocaleDateString('en-IN')}</p>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-red-500 transition-all" />
                         </div>
                       ))
                     ) : (
                       <div className="py-10 text-center opacity-20 italic">
                          <p className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em] mb-1 leading-none">Archive Null</p>
                          <p className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em] leading-none">Loading…</p>
                       </div>
                     )}
                  </div>

                  <div className="pt-8 mt-10 border-t border-slate-200 border-dashed relative z-10">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] text-center italic">Full history is in the audit trail</p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-5 transition-opacity" />
               </div>

               {/* Protocol Alert */}
               <div className="bg-red-600/5 border border-red-600/10 rounded-[2.5rem] p-8 transition-all hover:bg-red-600/10">
                  <div className="flex items-start gap-4">
                     <AlertTriangle className="w-6 h-6 text-red-600 mt-1 shrink-0" />
                     <div>
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic mb-2">Before you send</p>
                        <p className="text-[11px] font-medium text-slate-500 italic leading-relaxed">Announcements can't be recalled. They appear in every recipient's notifications, and by email if BROADCAST_EMAIL is enabled.</p>
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
