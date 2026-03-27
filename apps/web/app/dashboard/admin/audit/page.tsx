'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  User, 
  Clock, 
  Terminal, 
  ShieldCheck, 
  ChevronRight,
  Database,
  History,
  Lock,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const { data: audit, isLoading } = useSWR(`${API}/auth/admin/audit?page=${page}&limit=20`, fetcher);

  const getActionColor = (action: string) => {
    if (action.includes('REJECT') || action.includes('SUSPEND') || action.includes('DELETE')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (action.includes('APPROVE') || action.includes('REACTIVATE')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (action.includes('CONFIG') || action.includes('BROADCAST')) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-white/40 bg-white/10 border-white/20';
  };

  const [selectedLog, setSelectedLog] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <AdminSidebar pageTitle="Audit Ledger" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-white font-serif tracking-tighter">{ADMIN_STRINGS.AUDIT.TITLE}</h2>
              <p className="text-white/30 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1">{ADMIN_STRINGS.AUDIT.SUBTITLE}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 shadow-2xl">
               <div className="px-6 border-r border-white/5 text-center">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">{ADMIN_STRINGS.AUDIT.LOGS_LABEL}</p>
                  <p className="text-2xl font-bold text-white font-serif">{audit?.total || 0}</p>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-4 bg-white/5 hover:bg-white text-white/20 hover:text-black rounded-2xl transition-all shadow-xl group">
                     <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => setPage(p => p + 1)} className="p-4 bg-white/5 hover:bg-white text-white/20 hover:text-black rounded-2xl transition-all shadow-xl group">
                     <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-1 shadow-2xl overflow-hidden relative group">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-white/5">
                         <th className="px-10 py-8 text-[10px] font-bold text-white/40 uppercase tracking-widest">Temporal Index</th>
                         <th className="px-6 py-8 text-[10px] font-bold text-white/40 uppercase tracking-widest">Protocol Action</th>
                         <th className="px-6 py-8 text-[10px] font-bold text-white/40 uppercase tracking-widest">Actor Signature</th>
                         <th className="px-6 py-8 text-[10px] font-bold text-white/40 uppercase tracking-widest">Source IP</th>
                         <th className="px-6 py-8 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Manifest</th>
                      </tr>
                   </thead>
                   <tbody>
                      <AnimatePresence mode="popLayout">
                         {isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                               <tr key={i} className="animate-pulse">
                                  {Array.from({ length: 5 }).map((_, j) => (
                                     <td key={j} className="px-10 py-8"><div className="h-4 w-full bg-white/5 rounded" /></td>
                                  ))}
                               </tr>
                            ))
                         ) : audit?.items?.length > 0 ? (
                            audit.items.map((log: any, i: number) => (
                               <motion.tr 
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 transition={{ delay: i * 0.05 }}
                                 key={log.id} 
                                 className="hover:bg-white/5 transition-colors border-b border-white/5 group/row"
                               >
                                  <td className="px-10 py-8">
                                     <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white/5 text-white/20 rounded-xl flex items-center justify-center group-hover/row:text-white transition-all">
                                           <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                           <p className="text-[12px] font-bold text-white font-serif leading-none">{new Date(log.createdAt).toLocaleDateString()}</p>
                                           <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1.5">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-8">
                                     <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-dashed text-center w-[160px] ${getActionColor(log.action)}`}>
                                        {log.action}
                                     </div>
                                  </td>
                                  <td className="px-6 py-8">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-600/10 text-red-600 flex items-center justify-center text-[10px] font-bold font-serif">A</div>
                                        <p className="text-[11px] font-bold text-white/40 font-mono">{log.actorId.slice(-8).toUpperCase()}</p>
                                     </div>
                                  </td>
                                  <td className="px-6 py-8">
                                     <p className="text-[11px] font-semibold text-white/20 font-mono">{log.ipAddress || 'Internal Bus'}</p>
                                  </td>
                                  <td className="px-10 py-8 text-right">
                                     <button 
                                      onClick={() => setSelectedLog(log)}
                                      className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all shadow-xl group/btn"
                                     >
                                        <Terminal className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                     </button>
                                  </td>
                               </motion.tr>
                            ))
                         ) : (
                            <tr>
                               <td colSpan={5} className="py-40 text-center">
                                  <FileText className="w-20 h-20 text-white/5 mx-auto mb-8" />
                                  <p className="text-xl font-bold text-white/20 font-serif uppercase tracking-widest">Audit Archive Null</p>
                               </td>
                            </tr>
                         )}
                      </AnimatePresence>
                   </tbody>
                </table>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[90px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-5 transition-opacity" />
          </div>

          <div className="mt-12 flex justify-center items-center gap-6">
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Indexed Ledger Storage // Page {page} of {audit?.pages || 1}</p>
          </div>
        </div>
      </main>

      {/* Manifest Modal */}
      <AnimatePresence>
        {selectedLog && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
              >
                 <div className="p-10 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/5 text-white/40 rounded-2xl flex items-center justify-center">
                          <Terminal className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold text-white font-serif italic uppercase">{selectedLog.action} Manifest</h3>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Audit-ID: {selectedLog.id}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedLog(null)}
                      className="p-4 bg-white text-black hover:bg-red-600 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                    >Close</button>
                 </div>
                 <div className="p-10 bg-[#070707] font-mono text-[11px] leading-relaxed text-emerald-500 overflow-auto max-h-[60vh] custom-scrollbar">
                    <pre>{JSON.stringify(selectedLog.metadata || {}, null, 3)}</pre>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
