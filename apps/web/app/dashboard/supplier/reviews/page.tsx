'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  Star, 
  MessageSquare, 
  Filter, 
  Search, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  User,
  Quote
} from 'lucide-react';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function SupplierReviewsPage() {
  const { data: profile } = useSWR(`${API}/supplier/profile`, fetcher);
  
  // Note: This endpoint should be implemented in marketplace or proxy. 
  // We'll mock it if not found but point to the correct arch.
  const { data: reviews, isLoading } = useSWR(profile ? `${API}/marketplace/reviews?supplierId=${profile.id}` : null, fetcher);

  const reviewList: any[] = reviews ?? [];
  const averageRating = reviewList.length > 0 
    ? (reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Feedback Engine" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tighter">Farmer Sentiment</h2>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mt-1 italic">Analyzing marketplace reputation // V2.0 Stable</p>
            </div>
            
            <div className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-[#eae6de] shadow-soft">
               <div className="text-center px-4 border-r border-[#f8f7f4]">
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mb-2">Overall Quality</p>
                  <p className="text-2xl font-black text-text-dark font-serif">{averageRating} <span className="text-xs text-brand-orange">★</span></p>
               </div>
               <div className="text-center px-4">
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mb-2">Total Feedback</p>
                  <p className="text-2xl font-black text-text-dark font-serif">{reviewList.length}</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Filters */}
            <div className="space-y-6">
               <h3 className="text-[10px] text-text-muted font-black uppercase tracking-widest px-4">Filter Reviews</h3>
               <div className="bg-white p-2 rounded-[2rem] border border-[#eae6de] space-y-2 shadow-soft">
                  {['All Reviews', '5 Stars', '4 Stars', '3 Stars', 'Critical Only (1-2)'].map(f => (
                    <button key={f} className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${f === 'All Reviews' ? 'bg-text-dark text-white' : 'text-text-muted hover:bg-[#f8f7f4] hover:text-text-dark'}`}>
                       {f}
                    </button>
                  ))}
               </div>

               <div className="bg-brand-green/5 border border-brand-green/10 rounded-[2rem] p-8 text-center">
                  <TrendingUp className="w-10 h-10 text-brand-green mx-auto mb-4" />
                  <h4 className="text-text-dark font-serif font-bold text-lg mb-2 italic">Reputation Growth</h4>
                  <p className="text-text-muted text-xs leading-relaxed italic">
                    {reviewList.length > 0 
                      ? `Consolidating feedback from ${reviewList.length} verified sources.`
                      : 'Awaiting initial market response vectors.'}
                  </p>
               </div>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-8">
               {isLoading ? (
                 <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-white border border-[#eae6de] rounded-[2.5rem] animate-pulse" />)}
                 </div>
               ) : reviewList.length === 0 ? (
                 <div className="bg-white border border-[#eae6de] rounded-[2.5rem] p-24 text-center shadow-soft">
                     <Quote className="w-12 h-12 text-slate-200 mx-auto mb-6 opacity-30" />
                     <h3 className="text-text-dark font-black text-lg uppercase italic">Silence in Marketplace</h3>
                     <p className="text-text-muted text-xs mt-2 italic font-medium">No sentiment data detected for your operational history.</p>
                 </div>
               ) : (
                 reviewList.map((rev, i) => (
                   <motion.div 
                     key={rev.id} 
                     initial={{ opacity: 0, y: 20 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     transition={{ delay: i * 0.1 }}
                     className="bg-white border border-[#eae6de] rounded-[2.5rem] p-8 lg:p-10 shadow-soft hover:shadow-xl transition-all relative group"
                   >
                     <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-[#f8f7f4] flex items-center justify-center text-text-muted shadow-sm group-hover:bg-brand-green group-hover:text-white transition-all">
                              <User className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-text-dark font-serif font-bold text-lg leading-none mb-1.5">{rev.farmerName}</p>
                              <div className="flex items-center gap-1.5">
                                 {rev.isVerified && (
                                   <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                                      <CheckCircle className="w-2.5 h-2.5" /> Verified Purchase
                                   </div>
                                 )}
                                 <span className="text-[9px] text-slate-400 font-bold italic">{new Date(rev.createdAt).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-1">
                           {Array.from({ length: 5 }).map((_, j) => (
                             <Star key={j} className={`w-3.5 h-3.5 ${j < rev.rating ? 'text-brand-orange fill-brand-orange' : 'text-slate-200'}`} />
                           ))}
                        </div>
                     </div>

                     <div className="relative mb-8">
                        <Quote className="absolute -top-4 -left-4 w-12 h-12 text-[#f8f7f4] -z-10" />
                        <h4 className="text-sm font-black text-text-dark uppercase tracking-tight mb-3">{rev.title}</h4>
                        <p className="text-text-muted text-sm leading-relaxed font-medium italic italic">"{rev.body}"</p>
                     </div>

                     <div className="pt-6 border-t border-[#f8f7f4] flex items-center justify-between">
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#929285] hover:text-brand-green transition-all">
                           <MessageSquare className="w-4 h-4" /> Finalize Response
                        </button>
                        <button className="p-3 bg-[#f8f7f4] rounded-xl text-text-muted hover:text-brand-orange transition-all">
                           <AlertCircle className="w-4 h-4" />
                        </button>
                     </div>
                   </motion.div>
                 ))
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
