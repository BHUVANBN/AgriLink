'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  ShieldAlert, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Flag, 
  Star,
  User,
  ExternalLink,
  Search,
  AlertTriangle,
  ChevronRight,
  ShieldX,
  History,
  Globe
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function ModerationPage() {
  const [filter, setFilter] = useState<'flagged' | 'all'>('flagged');
  const { data: reviews, mutate, isLoading } = useSWR(`${API}/marketplace/admin/reviews`, fetcher);
  const { data: auditHistory } = useSWR(`${API}/auth/admin/audit?limit=4`, fetcher);
  const [deciding, setDeciding] = useState<any | null>(null);

  async function toggleFlag(id: string, isFlagged: boolean) {
    try {
      const res = await fetch(`${API}/marketplace/reviews/${id}/flag`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFlagged }),
        credentials: 'include'
      });
      if (res.ok) {
        toast.success(isFlagged ? 'Review flagged/suppressed' : 'Review cleared from moderation');
        mutate();
      }
    } catch {
      toast.error('Moderation protocol failed');
    }
  }

  async function purgeReview(id: string) {
    if (!confirm('CRITICAL: Purge this review permanent from platform index?')) return;
    try {
      const res = await fetch(`${API}/marketplace/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        toast.success('Malicious content purged successfully');
        mutate();
      }
    } catch {
      toast.error('Annihilation sequence failed');
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <AdminSidebar pageTitle="Moderation Desk" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-white font-serif tracking-tighter">{ADMIN_STRINGS.MODERATION.TITLE}</h2>
              <p className="text-amber-500 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1">
                {ADMIN_STRINGS.MODERATION.SUBTITLE(reviews?.filter((r: any) => r.isFlagged).length || 0)}
              </p>
            </div>
            
            <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-3xl border border-white/10">
               <button 
                onClick={() => setFilter('flagged')}
                className={`px-8 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all ${filter === 'flagged' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-white/40 hover:text-white'}`}
               >
                  Flagged Control
               </button>
               <button 
                onClick={() => setFilter('all')}
                className={`px-8 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
               >
                  Global Index
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Review List */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex items-center justify-between mb-8 px-4">
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Priority Triage</h3>
                  <div className="h-px bg-white/5 flex-1 mx-8" />
               </div>

              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse" />)
                ) : reviews?.length > 0 ? (
                  reviews.filter((r: any) => filter === 'all' || r.isFlagged).map((review: any) => (
                    <motion.div 
                      layout
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-red-600/30 transition-all group relative overflow-hidden"
                    >
                       <div className="flex flex-col lg:flex-row gap-10">
                          {/* Rating & Identity */}
                          <div className="lg:w-48 shrink-0 flex flex-col items-center justify-center p-8 bg-[#0f0f0f] rounded-3xl border border-white/5 group-hover:bg-white/5 transition-colors">
                              <div className="text-5xl font-bold text-white font-serif flex items-baseline gap-1">
                                 {review.rating} <span className="text-lg text-white/20">/ 5</span>
                              </div>
                              <div className="flex gap-1 mt-4">
                                 {Array.from({ length: 5 }).map((_, i) => (
                                   <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-white/10'}`} />
                                 ))}
                              </div>
                              <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
                                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-tight">Farmer Ident</p>
                                 <p className="text-[11px] font-bold text-white mt-2 font-serif truncate w-full">{review.farmerId.slice(-8).toUpperCase()}</p>
                              </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-6">
                             <div>
                                <div className="flex items-center gap-4 mb-4">
                                   <h3 className="text-2xl font-bold text-white font-serif tracking-tight group-hover:text-red-500 transition-colors">{review.title}</h3>
                                   {review.isVerified && (
                                     <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[8px] font-bold uppercase tracking-widest">Verified Purchase</div>
                                   )}
                                </div>
                                <p className="text-[14px] leading-relaxed text-white/40 group-hover:text-white/70 transition-colors">"{review.body}"</p>
                             </div>

                             <div className="p-6 bg-[#0f0f0f] rounded-2xl border border-white/5 border-dashed flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                                      <Globe className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none mb-1">Marketplace Index</p>
                                      <p className="text-[11px] font-bold text-white/60">Product-ID: {review.productId.toUpperCase()}</p>
                                   </div>
                                </div>
                                <button 
                                  onClick={() => window.open(`${ADMIN_CONFIG.API_URL.replace(':8080', ':3000')}/marketplace/products/${review.productId}`, '_blank')}
                                  className="flex items-center gap-2 text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-all group/link"
                                >
                                   View Catalog <ExternalLink className="w-3.5 h-3.5 group-hover/link:rotate-45 transition-transform" />
                                </button>
                             </div>
                          </div>

                          {/* Moderation Actions */}
                          <div className="lg:w-64 pt-10 lg:pt-0 lg:pl-10 lg:border-l border-white/5 space-y-4">
                             {review.isFlagged ? (
                               <button 
                                 onClick={() => toggleFlag(review.id, false)}
                                 className="w-full py-5 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-[1.8rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3"
                               >
                                  <CheckCircle className="w-4 h-4" /> Resolve Flag
                               </button>
                             ) : (
                               <button 
                                 onClick={() => toggleFlag(review.id, true)}
                                 className="w-full py-5 bg-white/5 border border-white/5 text-white/40 hover:text-red-500 rounded-[1.8rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                               >
                                  <Flag className="w-4 h-4" /> Suppress Review
                               </button>
                             )}

                             <button 
                               onClick={() => purgeReview(review.id)}
                               className="w-full py-5 bg-red-600 text-white rounded-[1.8rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-2xl shadow-red-600/20 flex items-center justify-center gap-3 group/trash"
                             >
                                <ShieldX className="w-5 h-5 group-hover:scale-110" /> Purge Post
                             </button>
                          </div>
                       </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-10 transition-opacity" />
                    </motion.div>
                  ))
                ) : (
                  <div className="py-40 flex flex-col items-center justify-center text-center bg-white/5 rounded-[4rem] border border-white/5 border-dashed">
                     <ShieldAlert className="w-20 h-20 text-white/5 mb-8" />
                     <p className="text-xl font-bold text-white/20 font-serif uppercase tracking-widest">Sentiment Stream Clear</p>
                     <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] mt-3 animate-pulse">Platform integrity verified // No active violations</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar: Audit Logs */}
            <div className="space-y-8">
               <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-10 hover:border-white/10 transition-all shadow-2xl overflow-hidden relative group">
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5 relative z-10">
                     <div className="w-10 h-10 bg-white/5 text-white/60 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <History className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white font-serif italic">{ADMIN_STRINGS.MODERATION.LOGS_TITLE}</h3>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 italic">{ADMIN_STRINGS.MODERATION.LOGS_SUB}</p>
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 relative z-10">
                     {auditHistory?.items?.length > 0 ? (
                       auditHistory.items.map((log: any, i: number) => (
                         <div key={log.id} className="flex items-center justify-between group/item cursor-pointer">
                            <div className="flex items-center gap-4">
                               <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover/item:text-white transition-all">
                                  <ShieldX className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-[12px] font-bold text-white font-serif italic mb-0.5 truncate max-w-[120px] uppercase">{log.action}</p>
                                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 leading-none">{new Date(log.createdAt).toLocaleDateString()}</p>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/10 group-hover/item:text-red-500 transition-all" />
                         </div>
                       ))
                     ) : (
                        <div className="py-20 text-center opacity-20">
                           <p className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">Enforcement Ledger Null</p>
                        </div>
                     )}
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-10 transition-opacity" />
               </div>

               <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                  <div className="flex items-start gap-4 text-white/40 italic text-[11px] leading-relaxed">
                     <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                     <p>Supervisor Note: Purging a review results in absolute data erasure from the marketplace shard. This operation is irreversible and audited.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
