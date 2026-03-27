'use client';

import { motion } from 'framer-motion';
import { 
  CreditCard, 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Box, 
  Lock,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

export default function TransactionsPlaceholder() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <AdminSidebar pageTitle="Financial Matrix" />
      
      <main className="lg:ml-72 p-6 lg:p-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center py-40 text-center">
             <div className="w-24 h-24 bg-red-600/10 text-red-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl relative group">
                <CreditCard className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-20 animate-pulse" />
             </div>
             
             <h2 className="text-6xl font-black text-white font-serif tracking-tighter italic uppercase mb-6 leading-none">Global Ledger</h2>
             <p className="text-red-500 font-bold text-[11px] uppercase tracking-[0.3em] mb-12 italic">System-wide transactional node: Phase 2.0 Deployment</p>
             
             <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 max-w-2xl w-full backdrop-blur-xl relative overflow-hidden group">
                <div className="flex items-start gap-6 mb-10 text-left">
                   <ShieldAlert className="w-8 h-8 text-white/20 mt-1" />
                   <div>
                      <h3 className="text-xl font-bold text-white font-serif italic mb-2 uppercase tracking-tight">Active Cryptographic Lockdown</h3>
                      <p className="text-[13px] text-white/40 leading-relaxed italic">The Financial service cluster is currently undergoing secure orchestration. All marketplace transactions are immutable via the Kafka backbone, but higher-level administrative reconciliation is offline for protocol hardening.</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-[#0f0f0f] rounded-2xl border border-white/5 text-left">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Expected Latency</p>
                      <p className="text-lg font-bold text-white font-serif italic">Pending Shard</p>
                   </div>
                   <div className="p-6 bg-[#0f0f0f] rounded-2xl border border-white/5 text-left">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Audit Status</p>
                      <p className="text-lg font-bold text-white font-serif italic">Verified Bus</p>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                   <button disabled className="w-full py-5 bg-white/5 text-white/20 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] italic border border-white/5 flex items-center justify-center gap-3">
                      Initiate Reconciliation Protocol <ArrowUpRight className="w-4 h-4 opacity-10" />
                   </button>
                </div>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[90px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-10 transition-opacity" />
             </div>
          </div>
        </div>

        {/* Ambient background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[160px] pointer-events-none" />
      </main>
    </div>
  );
}
