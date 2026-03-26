'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Leaf, 
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
const STATUS_CONFIG: Record<string, { label: string; sub: string; color: string; icon: any }> = {
  PLACED:    { label: 'Deployment Initialized', sub: 'Order strategy received & queued',     color: 'blue',   icon: Clock },
  CONFIRMED: { label: 'Strategy Confirmed',     sub: 'Validated by supplier network',        color: 'blue',   icon: CheckCircle },
  SHIPPED:   { label: 'In Operation',           sub: 'Physical assets in transit to farm',   color: 'purple', icon: Truck },
  DELIVERED: { label: 'Asset Delivered',        sub: 'Successfully received at drop point',  color: 'green',  icon: CheckCircle },
  CANCELLED: { label: 'Strategy Aborted',       sub: 'System halted deployment',             color: 'red',    icon: XCircle },
};

function OrderDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const { data: order, isLoading } = useSWR(id ? `${API}/marketplace/orders/${id}` : null, fetcher);

  if (isLoading) return <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6"><div className="w-12 h-12 border-4 border-green-500/10 border-t-green-500 rounded-full animate-spin" /></div>;
  if (!order) return <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6 text-center"><div className="glass-card p-12"><XCircle className="w-12 h-12 text-red-500 mx-auto mb-6" /><h3 className="text-white font-black italic">Record Missing.</h3><Link href="/marketplace/orders" className="btn-primary mt-8 inline-block">Return Home</Link></div></div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const cfg = STATUS_CONFIG[order.orderStatus] ?? STATUS_CONFIG.PLACED;
  const StatusIcon = cfg.icon;
  const addr = order.shippingAddress ?? {};
  const items: any[] = order.items ?? [];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200">
      <header className="sticky top-0 z-[100] bg-[#0d1526]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
             <div>
                <h1 className="text-white font-black text-sm uppercase tracking-[0.2em] italic">Deployment Analysis</h1>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Track: #{order.orderNumber}</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> ESCROW SECURED
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Activity Cluster */}
          <div className="lg:col-span-8 space-y-8">
             {/* Dynamic Hero Banner */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card p-10 border border-${cfg.color}-500/20 bg-gradient-to-br from-${cfg.color}-600/10 to-transparent relative overflow-hidden rounded-[2.5rem]`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                   <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border border-${cfg.color}-500/20 shadow-2xl ${
                     cfg.color === 'green' ? 'bg-green-600' : cfg.color === 'purple' ? 'bg-purple-600' : 'bg-blue-600'
                   }`}>
                      <StatusIcon className="w-10 h-10 text-white" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1">{cfg.label}</h2>
                      <p className="text-slate-400 text-sm font-medium italic">{cfg.sub}</p>
                      <div className="flex items-center gap-4 mt-6">
                         <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> Created: {new Date(order.createdAt).toLocaleString()}</div>
                         <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest border-l border-white/10 pl-4"><Package className="w-3.5 h-3.5" /> Items: {items.length} Units</div>
                      </div>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
             </motion.div>

             {/* Deployment Process Timeline */}
             {order.orderStatus !== 'CANCELLED' && (
                <div className="glass-card p-10 border-white/5 bg-white/[0.02] rounded-[2.5rem]">
                   <h3 className="text-white font-black italic text-sm mb-12 uppercase tracking-[0.2em] border-l-2 border-green-500 pl-4">Live Deployment Track</h3>
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative pb-8">
                      {STATUS_STEPS.map((step, i) => {
                         const stepCfg = STATUS_CONFIG[step];
                         const StepIcon = stepCfg.icon;
                         const isDone = currentStep >= i;
                         const isCurrent = currentStep === i;
                         
                         return (
                            <div key={step} className="flex flex-col items-center relative gap-6">
                               {/* Horizontal/Vertical Connector */}
                               {i < STATUS_STEPS.length - 1 && (
                                 <div className={`hidden md:block absolute top-7 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px ${currentStep > i ? 'bg-green-500' : 'bg-white/10'}`} />
                               )}
                               
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all relative z-10 ${
                                 isDone ? 'bg-green-600/10 border-green-500/50 text-green-500 shadow-xl shadow-green-900/30' : 'bg-white/5 border-white/10 text-slate-600'
                               } ${isCurrent ? 'scale-110' : ''}`}>
                                  <StepIcon className="w-6 h-6" />
                                  {isDone && <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500 fill-black" />}
                               </div>
                               
                               <div className="text-center">
                                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-white' : 'text-slate-600'}`}>{stepCfg.label.split(' ')[0]}</p>
                                  {isCurrent && <p className="text-[9px] text-green-500 font-black italic mt-1 uppercase animate-pulse">In Motion</p>}
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>
             )}

             {/* Inventory Deployment Details */}
             <div className="glass-card bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8">
                   <h3 className="text-white font-black italic text-sm mb-8 uppercase tracking-widest">Procured Assets</h3>
                   <div className="space-y-6">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group p-4 border border-white/5 bg-white/5 rounded-2xl">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/5">
                                 {item.snapshot?.image ? <img src={item.snapshot.image} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-slate-700" />}
                              </div>
                              <div>
                                 <p className="text-white font-black text-sm uppercase italic tracking-tighter">{item.name}</p>
                                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic mt-1">{item.quantity} × ₹{(item.pricePaise / 100).toLocaleString()}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-white font-black italic text-lg">₹{(item.totalPaise / 100).toLocaleString()}</p>
                              <Link href={`/marketplace/products/${item.productId}`} className="text-[9px] text-green-500 font-black uppercase italic tracking-widest hover:text-white transition-colors">Re-Order Link</Link>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="bg-[#0a0f1e] p-10 flex flex-col md:flex-row justify-between gap-10">
                   <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Field Subtotal</span><span className="text-white">₹{(order.subtotalPaise / 100).toLocaleString()}</span></div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Cluster Logisitcs</span><span className="text-white">₹{(order.shippingPaise / 100).toLocaleString()}</span></div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Protocol Tax (5%)</span><span className="text-white">₹{(order.taxPaise / 100).toLocaleString()}</span></div>
                      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                         <span className="text-white font-black text-lg uppercase italic tracking-tighter">Financial Impact</span>
                         <span className="text-green-500 font-black text-3xl italic">₹{(order.totalPaise / 100).toLocaleString()}</span>
                      </div>
                   </div>
                   <div className="w-px bg-white/5 hidden md:block" />
                   <div className="flex flex-col justify-center gap-4 min-w-[200px]">
                      <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-300 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> Export Invoice</button>
                      <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-300 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"><HelpCircle className="w-4 h-4" /> Cluster Support</button>
                   </div>
                </div>
             </div>
          </div>

          {/* Logistics Summary Hub */}
          <div className="lg:col-span-4 space-y-8">
             <div className="glass-card p-1 bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8">
                   <div className="flex items-center gap-3 mb-8">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <p className="text-white font-black italic text-sm uppercase tracking-widest">Deployment Vector</p>
                   </div>
                   <div className="bg-[#0a0f1e] p-6 rounded-3xl border border-white/5 space-y-6">
                      <div className="flex items-start gap-4">
                         <User className="w-4 h-4 text-slate-600 mt-1" />
                         <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 italic">Legal Identity</p>
                            <p className="text-white font-bold text-sm italic">{addr.name}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <Phone className="w-4 h-4 text-slate-600 mt-1" />
                         <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 italic">Ops Contact</p>
                            <p className="text-white font-bold text-sm italic">+91 {addr.phone}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <Leaf className="w-4 h-4 text-slate-600 mt-1" />
                         <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 italic">Location Vector</p>
                            <p className="text-white font-bold text-xs italic leading-relaxed">{[addr.street, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="bg-white/[0.05] p-6 border-t border-white/5 mx-6 mb-6 rounded-3xl text-center">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Physical Proofing System</p>
                   <p className="text-white font-black text-xs mt-1 italic">OTP SECURED DELIVERY</p>
                </div>
             </div>

             <div className="glass-card p-8 border-white/5 bg-white/[0.02] rounded-[2rem] gap-4 flex flex-col items-center text-center">
                <CreditCard className="w-8 h-8 text-blue-500 opacity-40 mb-2" />
                <div>
                   <p className="text-white font-black italic text-sm uppercase tracking-widest">{order.paymentMethod === 'COD' ? 'Cash Settlement' : 'Digital Clearing'}</p>
                   <p className={`text-[10px] font-black uppercase italic mt-2 ${order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500 animate-pulse'}`}>
                      {order.paymentStatus === 'PAID' ? '✓ VERIFIED & RELEASED' : 'PENDING SETTLEMENT'}
                   </p>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1e]" />}>
       <OrderDetailContent />
    </Suspense>
  );
}
