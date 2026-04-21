'use client';

import React, { useState, useEffect } from 'react';
import { Users, Timer, Target, ArrowRight, ShieldCheck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function CommunityBuyingPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch(`${API_URL}/marketplace/community/deals`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setDeals(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const joinDeal = async (dealId: string) => {
    setJoining(dealId);
    try {
      const res = await fetch(`${API_URL}/marketplace/community/deals/${dealId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDeals();
      }
    } finally {
      setJoining(null);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-br from-brand-orange/20 via-brand-green/10 to-transparent p-12 rounded-[3rem] border border-white/50 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-4 py-1.5 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">
            Power in Unity
          </span>
          <h1 className="text-5xl font-serif font-bold text-text-dark leading-tight mb-6">
            Join the Community Buying Hub
          </h1>
          <p className="text-text-muted text-lg leading-relaxed mb-8">
            Pool orders with neighboring farmers to unlock deep discounts on premium agri-inputs. When the target is met, everyone wins.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Farmer" />
                  </div>
                ))}
             </div>
             <p className="text-xs font-bold text-text-dark">840+ Farmers saved ₹12.4L last month</p>
          </div>
        </div>
        <Users className="absolute top-1/2 right-12 -translate-y-1/2 w-64 h-64 text-brand-green/5 -rotate-12" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.length === 0 ? (
           <div className="lg:col-span-3 text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#eae6de]">
              <Target className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-text-muted font-bold italic">No active group deals in your sector. Check back soon!</p>
           </div>
        ) : (
          deals.map((deal) => {
            const progress = (deal.currentQuantity / deal.targetQuantity) * 100;
            const isFull = progress >= 100;

            return (
              <motion.div
                key={deal.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2.5rem] border border-[#eae6de] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-green/10 transition-all flex flex-col"
              >
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-[#f8f7f4] rounded-2xl flex items-center justify-center text-brand-green">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-[10px] font-black uppercase tracking-widest">
                      <Timer className="w-3 h-3" /> 2d 14h left
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-text-dark mb-2">{deal.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{deal.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                      <span>Progress</span>
                      <span className={isFull ? 'text-brand-green' : 'text-brand-orange'}>
                        {deal.currentQuantity} / {deal.targetQuantity} units
                      </span>
                    </div>
                    <div className="h-3 bg-[#f8f7f4] rounded-full overflow-hidden border border-[#eae6de]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, progress)}%` }}
                        className={`h-full ${isFull ? 'bg-brand-green' : 'bg-brand-orange'}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                     <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Deal Price</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-brand-green">₹{deal.dealPricePaise / 100}</span>
                          <span className="text-xs text-text-muted line-through font-medium">₹{deal.originalPricePaise / 100}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Saving</p>
                        <p className="text-sm font-bold text-brand-orange">₹{(deal.originalPricePaise - deal.dealPricePaise) / 100} / unit</p>
                     </div>
                  </div>
                </div>

                <button
                  onClick={() => joinDeal(deal.id)}
                  disabled={joining === deal.id}
                  className={`w-full py-6 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all ${
                    isFull 
                      ? 'bg-brand-green text-white hover:bg-brand-green-hover' 
                      : 'bg-brand-orange text-white hover:opacity-90'
                  }`}
                >
                  {joining === deal.id ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isFull ? 'Confirm Order' : 'Join Group Buy'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-[#eae6de]">
         <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-text-dark text-sm mb-1">Guaranteed Quality</h4>
               <p className="text-xs text-text-muted leading-relaxed">Direct from factory-verified suppliers in Karnataka hub.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
               <Users className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-text-dark text-sm mb-1">Community Verified</h4>
               <p className="text-xs text-text-muted leading-relaxed">Every deal is vetted by community leaders for fair pricing.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-text-dark text-sm mb-1">Automatic Refund</h4>
               <p className="text-xs text-text-muted leading-relaxed">If target isn't met, your commitment is released instantly.</p>
            </div>
         </div>
      </section>
    </div>
  );
}
