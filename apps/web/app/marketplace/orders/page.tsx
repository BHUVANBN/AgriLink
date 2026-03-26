'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  ShoppingBag, 
  Package, 
  CreditCard, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Leaf, 
  Search,
  ChevronRight,
  Filter,
  ArrowRight,
  Zap
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; glow: string }> = {
  PLACED:    { label: 'Ordered',    color: 'blue',   icon: Clock,       glow: 'shadow-blue-900/40' },
  CONFIRMED: { label: 'Confirmed',  color: 'blue',   icon: CheckCircle,   glow: 'shadow-blue-900/40' },
  SHIPPED:   { label: 'In Transit', color: 'purple', icon: Truck,         glow: 'shadow-purple-900/40' },
  DELIVERED: { label: 'Delivered',  color: 'green',  icon: CheckCircle,   glow: 'shadow-green-900/40' },
  CANCELLED: { label: 'Cancelled',  color: 'red',    icon: XCircle,       glow: 'shadow-red-900/40' },
};

function OrdersContent() {
  const { data: orders, isLoading } = useSWR(`${API}/marketplace/orders`, fetcher);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const orderList: any[] = (orders ?? []).filter((o: any) => {
     if (filter === 'active') return ['PLACED', 'CONFIRMED', 'SHIPPED'].includes(o.orderStatus);
     if (filter === 'completed') return o.orderStatus === 'DELIVERED';
     return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200">
      <header className="sticky top-0 z-[100] bg-[#0d1526]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <Link href="/marketplace" className="text-slate-400 hover:text-white transition-colors"><ArrowRight className="w-5 h-5 rotate-180" /></Link>
             <div>
                <h1 className="text-white font-black text-sm uppercase tracking-[0.2em] italic">Procurement Track</h1>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Order History & Real-time Status</p>
             </div>
          </div>
          <Link href="/marketplace" className="p-2.5 bg-green-600/10 border border-green-500/20 text-green-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600/20 transition-all">New Order</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
           <div className="flex items-center gap-2">
              {['all', 'active', 'completed'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-white text-black font-black' : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'
                  }`}
                >
                   {f}
                </button>
              ))}
           </div>
           
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              <input className="bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-white/20 transition-all w-64" placeholder="Find order by tracking ID..." />
           </div>
        </div>

        {isLoading ? (
           <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-44 glass-card skeleton rounded-[2rem]" />)}
           </div>
        ) : orderList.length === 0 ? (
           <div className="glass-card py-32 text-center border-dashed border-white/10 bg-transparent flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8">
                 <ShoppingBag className="w-8 h-8 text-slate-800" />
              </div>
              <h3 className="text-white font-black text-xl italic uppercase tracking-tighter">No deployments found.</h3>
              <p className="text-slate-500 text-xs mt-2 font-medium italic">You haven't initiated any product procurement yet.</p>
              <Link href="/marketplace" className="mt-10 px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Begin Shopping</Link>
           </div>
        ) : (
           <div className="space-y-6">
              {orderList.map((order, i) => {
                 const cfg = STATUS_CONFIG[order.orderStatus] ?? STATUS_CONFIG.PLACED;
                 const StatusIcon = cfg.icon;
                 const items: any[] = order.items ?? [];
                 
                 return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                       <Link href={`/marketplace/orders/${order.id}`} className="block group">
                          <div className="glass-card p-1 bg-white/[0.02] border-white/5 rounded-[2rem] group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all relative overflow-hidden">
                             <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                <div className="space-y-4">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-white/5 shadow-2xl ${cfg.glow} ${
                                        cfg.color === 'green' ? 'bg-green-600' : cfg.color === 'purple' ? 'bg-purple-600' : 'bg-blue-600'
                                      }`}>
                                         <StatusIcon className="w-6 h-6 text-white" />
                                      </div>
                                      <div>
                                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">Tracking Track</p>
                                         <h3 className="text-white font-black text-lg italic uppercase tracking-tighter">#{order.orderNumber}</h3>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-6">
                                      <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-slate-600" /><span className="text-[10px] font-black uppercase text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span></div>
                                      <div className="flex items-center gap-2"><CreditCard className="w-3 h-3 text-slate-600" /><span className="text-[10px] font-black uppercase text-slate-500">₹{(order.totalPaise/100).toLocaleString()}</span></div>
                                   </div>
                                </div>

                                <div className="flex-1 max-w-sm">
                                   <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-4 italic">Operational Assets ({items.length})</p>
                                   <div className="flex items-center gap-2">
                                      <div className="flex -space-x-4">
                                         {items.slice(0, 3).map((item, idx) => (
                                           <div key={idx} className="w-12 h-12 rounded-2xl bg-white/5 border-4 border-[#0a0f1e] overflow-hidden">
                                              {item.snapshot?.image ? <img src={item.snapshot.image} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-slate-700 m-4" />}
                                           </div>
                                         ))}
                                         {items.length > 3 && (
                                           <div className="w-12 h-12 rounded-2xl bg-white/10 border-4 border-[#0a0f1e] flex items-center justify-center text-[10px] font-black text-slate-400">
                                              +{items.length - 3}
                                           </div>
                                         )}
                                      </div>
                                      <div className="ml-4 min-w-0">
                                         <p className="text-white font-bold text-xs truncate max-w-[200px] uppercase tracking-tighter">{items[0]?.name}</p>
                                         <p className="text-slate-500 text-[10px] font-black italic mt-1 uppercase">Procured from verified vendors</p>
                                      </div>
                                   </div>
                                </div>

                                <div className="flex items-center gap-4">
                                   <div className="text-right hidden md:block">
                                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                                        cfg.color === 'green' ? 'text-green-500' : 'text-blue-500'
                                      }`}>{cfg.label}</p>
                                      <div className="flex items-center justify-end gap-1">
                                         {[1,2,3,4].map(dot => (
                                           <div key={dot} className={`w-1 h-3 rounded-full ${order.orderStatus === 'DELIVERED' || dot <= (['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].indexOf(order.orderStatus) + 1) ? 'bg-green-500' : 'bg-white/10'}`} />
                                         ))}
                                      </div>
                                   </div>
                                   <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-700 group-hover:bg-white group-hover:text-black transition-all">
                                      <ChevronRight className="w-5 h-5" />
                                   </div>
                                </div>
                             </div>
                             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                       </Link>
                    </motion.div>
                 );
              })}
           </div>
        )}
      </main>

      {/* Analytics Footer */}
      <footer className="mt-24 border-t border-white/5 p-12 bg-[#0d1526]/30">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center"><Zap className="w-6 h-6 text-yellow-500/30" /></div>
               <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Live Operations</p>
                  <p className="text-white font-black text-sm italic">24/7 Supply Chain Monitoring Active</p>
               </div>
            </div>
            <button className="px-6 py-3 border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Cluster Support: +91 800-AGRILINK</button>
         </div>
      </footer>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1e]" />}>
       <OrdersContent />
    </Suspense>
  );
}
