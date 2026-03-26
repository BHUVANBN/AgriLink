'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import {
   ArrowLeft,
   ShoppingCart,
   Package,
   Star,
   Shield,
   Truck,
   Leaf,
   ChevronLeft,
   ChevronRight,
   Building,
   Tag,
   AlertCircle,
   Award,
   Clock,
   Verified,
   Share2,
   Heart,
   Plus,
   Minus,
   ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());

export default function ProductDetailPage() {
   const params = useParams();
   const router = useRouter();
   const id = params?.id as string;

   const { data, isLoading, error } = useSWR(`${API}/marketplace/products/${id}`, fetcher);
   const { data: cartData, mutate: mutateCart } = useSWR(`${API}/marketplace/cart`, fetcher);

   const [imageIdx, setImageIdx] = useState(0);
   const [adding, setAdding] = useState(false);
   const [qty, setQty] = useState(1);
   const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reivews'>('desc');

   const product = data?.data;
   const cartCount = cartData?.data?.length ?? 0;

   async function addToCart() {
      if (!product) return;
      setAdding(true);
      try {
         const res = await fetch(`${API}/marketplace/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
               productId: product.id,
               supplierId: product.supplierId,
               quantity: qty,
               snapshot: {
                  name: product.name,
                  price: product.price,
                  mrp: product.mrp,
                  unit: product.unit,
                  image: product.images?.[0],
               },
            }),
         });
         if (!res.ok) {
            if (res.status === 401) { toast.error('Please login'); router.push('/auth/login'); return; }
            const j = await res.json();
            throw new Error(j.error ?? 'Failed');
         }
         mutateCart();
         toast.success(`${qty} items added to Basket`);
      } catch (err: any) {
         toast.error(err.message);
      } finally {
         setAdding(false);
      }
   }

   if (isLoading) {
      return (
         <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white/5 border-t-green-500 rounded-full animate-spin" />
         </div>
      );
   }

   if (error || !product) {
      return (
         <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6">
            <div className="glass-card p-12 text-center border-red-500/20 max-w-sm">
               <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
               <h3 className="text-white font-black text-xl italic mb-2">Item Missing.</h3>
               <p className="text-slate-500 text-sm mb-8 leading-relaxed italic">This product listing has been deactivated or moved by the supplier.</p>
               <Link href="/marketplace" className="btn-primary w-full justify-center py-4 text-xs font-black uppercase tracking-widest">Return to Market</Link>
            </div>
         </div>
      );
   }

   const priceRs = (product.price / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 });
   const mrpRs = (product.mrp / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 });
   const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
   const images: string[] = product.images ?? [];
   const specs = product.specifications ?? {};
   const supplier = product.supplier;

   return (
      <div className="min-h-screen bg-[#0a0f1e] text-slate-200">
         {/* Dynamic Header */}
         <header className="sticky top-0 z-[100] bg-[#0d1526]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-6">
               <button onClick={() => router.back()} className="text-slate-400 hover:text-white p-2.5 rounded-2xl border border-white/5 bg-white/5 transition-all">
                  <ArrowLeft className="w-5 h-5" />
               </button>

               <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-xs uppercase tracking-[0.2em] truncate">{product.name}</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                     Ref: {product.sku || 'SKU-0000'} // Cluster delivery available
                  </p>
               </div>

               <Link href="/marketplace/cart" className="relative p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                  <ShoppingCart className="w-5 h-5 text-slate-300" />
                  {cartCount > 0 && (
                     <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center font-black shadow-lg">
                        {cartCount}
                     </span>
                  )}
               </Link>
            </div>
         </header>

         <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

               {/* Visual Presentation Cluster */}
               <div className="space-y-6">
                  <div className="relative group p-4 border border-white/5 bg-white/[0.02] rounded-[3rem] shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                     {images.length > 0 ? (
                        <motion.img
                           key={images[imageIdx]}
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           src={images[imageIdx]}
                           alt={product.name}
                           className="w-full h-full object-contain pointer-events-none"
                        />
                     ) : (
                        <Package className="w-32 h-32 text-slate-800" />
                     )}

                     {discount > 0 && (
                        <div className="absolute top-8 left-8 p-3 bg-red-600 text-white font-black italic rounded-2xl shadow-xl shadow-red-900/30 text-sm">
                           -{discount}% OFF TODAY
                        </div>
                     )}

                     <div className="absolute top-8 right-8 flex flex-col gap-3">
                        <button className="p-3 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/20 transition-all"><Heart className="w-5 h-5" /></button>
                        <button className="p-3 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/20 transition-all"><Share2 className="w-5 h-5" /></button>
                     </div>
                  </div>

                  {images.length > 1 && (
                     <div className="flex gap-4 justify-center">
                        {images.map((img, i) => (
                           <button
                              key={i}
                              onClick={() => setImageIdx(i)}
                              className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${imageIdx === i ? 'border-green-500 scale-105' : 'border-white/5 hover:border-white/10'}`}>
                              <img src={img} className="w-full h-full object-cover" />
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               {/* Strategic Decision Cluster */}
               <div className="space-y-10">
                  <div>
                     <div className="flex items-center gap-2 mb-4">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        < Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <Star className="w-4 h-4 text-slate-700" />
                        <span className="text-[10px] text-slate-500 font-bold ml-2 uppercase tracking-widest border-l border-white/10 pl-3">482 Verified Reviews</span>
                     </div>

                     <h1 className="text-4xl md:text-5xl font-black text-white italic leading-tight uppercase tracking-tighter">
                        {product.name}
                     </h1>

                     <div className="flex items-center gap-4 mt-8">
                        <p className="text-5xl font-black text-white italic">₹{priceRs}</p>
                        {discount > 0 && (
                           <div className="text-slate-500">
                              <p className="text-lg line-through font-bold opacity-30">₹{mrpRs}</p>
                              <p className="text-[10px] uppercase font-black tracking-widest text-green-500 mt-1">BEST PRICE GUARANTEED</p>
                           </div>
                        )}
                     </div>

                     <div className="p-1 px-4 bg-white/5 border border-white/5 w-fit rounded-full mt-6 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400">Arriving in <span className="text-white">48-72 hours</span> for {product.category}</span>
                     </div>
                  </div>

                  {/* Dynamic Interaction Panel */}
                  <div className="glass-card p-1 bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
                     <div className="p-8 space-y-8">
                        <div className="flex items-end justify-between">
                           <div className="space-y-4">
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest italic">Order Selection</p>
                              <div className="flex items-center bg-[#0a0f1e] rounded-2xl border border-white/5 p-1 w-fit">
                                 <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                                 <span className="w-14 text-center font-black text-lg text-white">{qty}</span>
                                 <button onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 italic">Total Outlay</p>
                              <p className="text-3xl font-black text-green-500 italic">₹{((product.price * qty) / 100).toLocaleString('en-IN')}</p>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           {product.stockQuantity === 0 ? (
                              <div className="w-full py-5 rounded-3xl bg-white/5 border border-white/5 text-center text-slate-500 font-black uppercase text-xs tracking-widest italic">Inventory Exhausted</div>
                           ) : (
                              <>
                                 <button
                                    onClick={addToCart}
                                    disabled={adding}
                                    className="flex-1 py-5 rounded-3xl bg-green-600 text-white font-black uppercase text-xs tracking-widest italic shadow-2xl shadow-green-900/50 hover:brightness-110 active:scale-95 transition-all"
                                 >
                                    {adding ? '...' : 'Commit to Basket'}
                                 </button>
                                 <button className="flex-1 py-5 rounded-3xl border border-white/10 text-white font-black uppercase text-xs tracking-widest italic hover:bg-white/5 active:scale-95 transition-all">Instant Buy</button>
                              </>
                           )}
                        </div>
                     </div>

                     <div className="bg-white/[0.03] p-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-blue-400" /><span className="text-[10px] uppercase font-black text-slate-400">Free Drop</span></div>
                           <div className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /><span className="text-[10px] uppercase font-black text-slate-400">Lab Tested</span></div>
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold">GST INCL.</p>
                     </div>
                  </div>

                  {/* Supplier Identity */}
                  {supplier && (
                     <div className="glass-card p-6 border-white/5 flex items-center justify-between group hover:border-green-500/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                              <Building className="w-6 h-6 text-white" />
                           </div>
                           <div>
                              <div className="flex items-center gap-1 mb-1">
                                 <span className="text-white font-bold text-sm">{supplier.companyName}</span>
                                 <Verified className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                              </div>
                              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">{supplier.businessType} / Verified Vendor</p>
                           </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-800 group-hover:text-white transition-colors" />
                     </div>
                  )}
               </div>
            </div>

            {/* Tabbed In-Depth Info */}
            <div className="mt-24">
               <div className="flex gap-8 border-b border-white/5 mb-10">
                  {['desc', 'specs', 'reivews'].map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-600 hover:text-slate-400'
                           }`}
                     >
                        {tab === 'desc' ? 'Operation Context' : tab === 'specs' ? 'Technical Data' : 'Field Feedback'}
                        {activeTab === tab && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-full" />}
                     </button>
                  ))}
               </div>

               <AnimatePresence mode="wait">
                  {activeTab === 'desc' && (
                     <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
                        <p className="text-lg text-slate-400 leading-relaxed font-medium italic border-l-4 border-green-500 pl-8">
                           {product.description}
                        </p>
                     </motion.div>
                  )}

                  {activeTab === 'specs' && (
                     <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(specs).map(([k, v]) => (
                           <div key={k} className="glass-card p-6 border-white/5 bg-white/[0.02]">
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 border-b border-white/5 pb-2">{k.replace(/_/g, ' ')}</p>
                              <p className="text-white font-black italic">{String(v)}</p>
                           </div>
                        ))}
                        {Object.keys(specs).length === 0 && <p className="text-slate-500 italic text-sm">No technical parameters provided by supplier.</p>}
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </main>
      </div>
   );
}
