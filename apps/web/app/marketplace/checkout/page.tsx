'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  Leaf, 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Truck, 
  ChevronRight, 
  MapPin, 
  Package, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());

declare global { interface Window { Razorpay: any; } }

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const { data: cartData } = useSWR(`${API}/marketplace/cart`, fetcher);
  const items: any[] = cartData?.data ?? [];

  const [step, setStep] = useState<'address' | 'payment' | 'done'>('address');
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', state: 'Karnataka', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [placedOrders, setPlacedOrders] = useState<any[]>([]);

  const subtotal = items.reduce((sum, item) => sum + (item.snapshot?.price ?? 0) * item.quantity, 0);
  const shipping = 5000; // ₹50
  const tax = Math.floor(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  function changeAddr(field: string, val: string) {
    setAddress(a => ({ ...a, [field]: val }));
  }

  async function placeOrder() {
    setPlacing(true);
    try {
      const orderPayload = {
        items: items.map(item => ({
          productId: item.productId,
          supplierId: item.supplierId,
          name: item.snapshot?.name,
          quantity: item.quantity,
          pricePaise: item.snapshot?.price,
          totalPaise: (item.snapshot?.price ?? 0) * item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const orderRes = await fetch(`${API}/marketplace/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderPayload),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderJson.error ?? 'Order creation failed');

      const createdOrders: any[] = orderJson.data?.orders ?? [];

      if (paymentMethod === 'RAZORPAY') {
        if (!window.Razorpay) {
          await new Promise<void>(resolve => {
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.onload = () => resolve();
            document.body.appendChild(s);
          });
        }

        for (const order of createdOrders) {
          const initRes = await fetch(`${API}/marketplace/payment/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ orderId: order.id, totalPaise: order.totalPaise, farmerId: order.farmerId }),
          });
          const initJson = await initRes.json();
          if (!initRes.ok) throw new Error(initJson.error ?? 'Payment init failed');

          await new Promise<void>((resolve, reject) => {
            const razorpay = new window.Razorpay({
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              amount: order.totalPaise,
              currency: 'INR',
              name: 'AgriLink Marketplace',
              description: `Order #${order.orderNumber}`,
              order_id: initJson.data?.razorpayOrderId,
              handler: async (response: any) => {
                try {
                  const confirmRes = await fetch(`${API}/marketplace/payment/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                      orderId: order.id,
                      razorpayOrderId: response.razorpay_order_id,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpaySignature: response.razorpay_signature,
                    }),
                  });
                  const confirmJson = await confirmRes.json();
                  if (!confirmJson.success) throw new Error('Payment verification failed');
                  resolve();
                } catch (err: any) { reject(err); }
              },
              modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
              prefill: { name: address.name, contact: address.phone },
              theme: { color: '#16a34a' },
            });
            razorpay.open();
          });
        }
      }

      setPlacedOrders(createdOrders);
      setStep('done');
      toast.success('Strategy Finalized. Order Placed.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (authLoading) return <div className="min-h-screen bg-[#0a0f1e]" />;

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass-card p-12 max-w-xl text-center border-green-500/20 shadow-2xl shadow-green-900/40">
           <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8 border border-green-500/20 relative">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 border border-green-400 rounded-full" />
           </div>
           <h2 className="text-3xl font-black text-white italic mb-2 uppercase tracking-tighter">Order Successfully Committed.</h2>
           <p className="text-slate-500 text-sm mb-10 leading-relaxed font-bold italic">
              Your strategy has been finalized. Cluster managers are now securing your products from verified suppliers. Check your dashboard for real-time tracking.
           </p>
           
           <div className="space-y-4 mb-10">
              {placedOrders.map(o => (
                <div key={o.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">Order Track #{o.orderNumber}</span>
                   </div>
                   <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{o.status}</span>
                </div>
              ))}
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/farmer/orders" className="p-4 bg-green-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all">Track Deployment</Link>
              <Link href="/marketplace" className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 active:scale-95 transition-all">Continue Market</Link>
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200">
      <header className="sticky top-0 z-[100] bg-[#0d1526]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <Link href="/marketplace/cart" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
             <h1 className="text-white font-black text-sm uppercase tracking-[0.2em] italic">Strategic Checkout</h1>
          </div>
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-4 h-4 text-green-500" />
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Secured by Protocol Trust v3</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Horizontal Steps */}
            <div className="flex items-center gap-4 mb-8">
               {[{ id: 'address', label: 'Delivery Vector', icon: MapPin }, { id: 'payment', label: 'Financial Settlement', icon: CreditCard }].map((s, i) => (
                 <div key={s.id} className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => step === 'payment' && s.id === 'address' && setStep('address')}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        step === s.id ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-900/40' : 'bg-white/[0.03] text-slate-500 border-white/5'
                      }`}
                    >
                       <s.icon className="w-4 h-4" />
                       {s.label}
                    </button>
                    {i === 0 && <div className="h-px flex-1 bg-white/5 min-w-[20px]" />}
                 </div>
               ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 'address' && (
                <motion.div key="addr" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                   <div className="glass-card p-1 bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden">
                      <div className="p-8 space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block italic">Recipient Signature</label>
                               <input className="input-field py-4" value={address.name} onChange={e => changeAddr('name', e.target.value)} placeholder="Agri-Business Legal Name" />
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block italic">Operations Contact</label>
                               <input className="input-field py-4" type="tel" value={address.phone} onChange={e => changeAddr('phone', e.target.value)} placeholder="10-digit Secure Mobile" maxLength={10} />
                            </div>
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block italic">Physical Deployment Vector</label>
                            <input className="input-field py-4" value={address.street} onChange={e => changeAddr('street', e.target.value)} placeholder="Farm Cluster / Survey Intersection / Village" />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block italic">Operational Zone</label>
                               <input className="input-field py-4" value={address.city} onChange={e => changeAddr('city', e.target.value)} placeholder="Taluk/City" />
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block italic">Postal Hub</label>
                               <input className="input-field py-4" value={address.pincode} onChange={e => changeAddr('pincode', e.target.value)} placeholder="Pincode" maxLength={6} />
                            </div>
                            <div className="flex items-end">
                               <button 
                                 onClick={() => {
                                   if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) { toast.error('Fill critical fields'); return; }
                                   setStep('payment');
                                 }}
                                 className="w-full py-4 rounded-2xl bg-green-600 text-white font-black uppercase text-[10px] tracking-widest italic shadow-xl shadow-green-900/40 hover:scale-105 active:scale-95 transition-all"
                               >
                                  Confirm Logistics <ChevronRight className="w-3 h-3 ml-2 inline" />
                               </button>
                            </div>
                         </div>
                      </div>
                      <div className="bg-[#0a0f1e] p-6 border-t border-white/5 flex items-center justify-between">
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest border-l-2 border-slate-700 pl-4">Logistics mapped to verified farm location</p>
                      </div>
                   </div>
                   
                   <div className="p-6 bg-amber-500/5 rounded-[2rem] border border-amber-500/10 flex items-start gap-4">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                         <p className="text-amber-400 font-bold text-xs uppercase tracking-widest">Verify before proceeding</p>
                         <p className="text-amber-500/60 text-[10px] mt-1 italic uppercase font-bold tracking-tight">Suppliers will use this address for physical asset delivery. Finality is high.</p>
                      </div>
                   </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="space-y-4">
                      {[
                        { id: 'COD', label: 'Offline Settlement (COD)', desc: 'Finalize payment only after physical inspection at farm.', badge: 'Cluster Trusted', icon: Truck },
                        { id: 'RAZORPAY', label: 'Secure Digital Gateway', desc: 'UPI, Credit, Net-Banking via encrypted Razorpay tunnel.', badge: 'Flash Clearing', icon: Zap },
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`w-full p-8 rounded-[2.5rem] border text-left transition-all relative overflow-hidden group ${
                            paymentMethod === m.id ? 'border-green-500/50 bg-green-500/10 shadow-2xl shadow-green-900/20' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                          }`}
                        >
                          {paymentMethod === m.id && <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full blur-3xl" />}
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === m.id ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                                  <m.icon className="w-6 h-6" />
                               </div>
                               <div>
                                  <p className="text-white font-black italic text-lg">{m.label}</p>
                                  <p className="text-slate-500 text-xs mt-1 font-medium">{m.desc}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block mb-3 ${paymentMethod === m.id ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-600'}`}>{m.badge}</span>
                               <div className={`w-6 h-6 rounded-full border-2 transition-all mx-auto ${paymentMethod === m.id ? 'border-green-400 bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'border-slate-800'}`} />
                            </div>
                          </div>
                        </button>
                      ))}
                   </div>
                   
                   <button
                     onClick={placeOrder}
                     disabled={placing || items.length === 0}
                     className="w-full py-5 rounded-3xl bg-green-600 text-white font-black uppercase text-xs tracking-[0.3em] italic shadow-2xl shadow-green-900/50 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     {placing ? 'Clearing Payment Tunnel...' : `Commit Deployment: ₹${(total / 100).toLocaleString('en-IN')}`}
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Summary Hub */}
          <div className="space-y-8">
             <div className="glass-card p-1 bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden sticky top-28">
                <div className="p-8">
                   <h3 className="text-white font-black italic text-sm mb-6 uppercase tracking-widest">Strategy Summary</h3>
                   <div className="space-y-4 mb-8 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-4">
                           <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden border border-white/5">
                              {item.snapshot?.image && <img src={item.snapshot.image} className="w-full h-full object-cover" />}
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-white font-bold text-xs truncate uppercase tracking-tighter">{item.snapshot?.name}</p>
                              <p className="text-slate-500 text-[10px] mt-1 font-black italic">{item.quantity} UNITS // ₹{(item.snapshot?.price / 100).toLocaleString()}</p>
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="border-t border-white/5 pt-6 space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                         <span>Field Subtotal</span>
                         <span className="text-white font-black">₹{(subtotal / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                         <span>Cluster Drop Fee</span>
                         <span className="text-white font-black">₹{(shipping / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                         <span>Protocol Tax (5%)</span>
                         <span className="text-white font-black">₹{(tax / 100).toLocaleString()}</span>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                         <span className="text-white font-black text-sm uppercase tracking-[0.2em] italic">Total Exposure</span>
                         <span className="text-green-500 font-black text-2xl italic">₹{(total / 100).toLocaleString()}</span>
                      </div>
                   </div>
                </div>
                <div className="bg-white/[0.03] p-6 border-t border-white/5">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Escrow lock active until inspection</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
