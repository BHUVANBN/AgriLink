'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  ChevronRight,
  Filter,
  TrendingUp,
  BarChart3,
  Box,
  Truck,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const CATEGORIES = ['seeds', 'fertilizers', 'pesticides', 'tools', 'equipment', 'feed', 'other'];
const STATUS_CONFIG: Record<string, { label: string; cls: string; color: string }> = {
  active:   { label: 'Active',   cls: 'bg-green-600/10 text-green-400 border-green-500/20', color: 'green' },
  draft:    { label: 'Draft',    cls: 'bg-white/5 text-slate-400 border-white/5', color: 'slate' },
  inactive: { label: 'Inactive', cls: 'bg-red-600/10 text-red-400 border-red-500/20', color: 'red'   },
};

function ProductsContent() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({ page: String(page), limit: '16' });
  if (category) params.set('category', category);
  if (status) params.set('status', status);

  const { data, isLoading, mutate } = useSWR(
    `${API}/supplier/products?${params}`,
    (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data)
  );

  const products: any[] = data?.items ?? [];
  const pagination = data?.pagination;

  const filtered = search ? products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  ) : products;

  async function toggleStatus(product: any) {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`${API}/supplier/products/${product.id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
         body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      mutate();
      toast.success(`Strategy ${newStatus} for ${product.name}`);
    } catch { toast.error('Failed to update operational status'); }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Inventory" />
      <main className="lg:ml-72 p-6 lg:p-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div>
                 <h2 className="text-text-dark font-serif font-bold">Inventory Core</h2>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Managing {pagination?.total ?? 0} active assets in marketplace</p>
              </div>
              <div className="flex items-center gap-4">
                 <Link href="/dashboard/supplier/products/new" className="px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-white/5">
                    <Plus className="w-4 h-4" /> Initialize Asset
                 </Link>
              </div>
           </div>

           {/* Stats Aggregator */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Platform Visibility', value: products.filter(p => p.status === 'active').length, icon: Eye, color: 'blue' },
                { label: 'Depletion Alerts',   value: products.filter(p => p.stockQuantity <= p.reorderThreshold).length, icon: AlertTriangle, color: 'amber' },
                { label: 'Market Velocity',     value: '4.8x', icon: TrendingUp, color: 'green' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#eae6de] shadow-sm">
                   <div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">{stat.label}</p>
                      <p className="text-text-dark font-serif font-bold">{stat.value}</p>
                   </div>
                   <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-600/10 flex items-center justify-center`}><stat.icon className={`w-5 h-5 text-${stat.color}-500`} /></div>
                </div>
              ))}
           </div>

           {/* Filters Hub */}
           <div className="flex flex-wrap items-center gap-4 mb-10 bg-white/[0.01] p-1 rounded-3xl border border-white/5">
              <div className="flex-1 relative min-w-[200px]">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                 <input className="w-full bg-transparent p-3.5 pl-12 text-[11px] font-bold text-white outline-none placeholder:text-slate-700" placeholder="Vectoring Search by Name or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="h-8 w-px bg-white/5 hidden md:block" />
              <div className="flex items-center gap-2 p-1">
                 <select className="bg-transparent text-slate-500 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
                    <option value="" className="bg-white">Categories: All</option>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-white text-white uppercase">{c}</option>)}
                 </select>
              </div>
              <div className="h-8 w-px bg-white/5 hidden md:block" />
              <div className="flex items-center gap-2 p-1 pr-4">
                 <select className="bg-transparent text-slate-500 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                    <option value="" className="bg-white">Status: All</option>
                    <option value="active" className="bg-white text-white uppercase">Active</option>
                    <option value="draft" className="bg-white text-white uppercase">Draft</option>
                    <option value="inactive" className="bg-white text-white uppercase">Inactive</option>
                 </select>
              </div>
           </div>

           {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 glass-card skeleton rounded-[2rem]" />)}
              </div>
           ) : filtered.length === 0 ? (
              <div className="glass-card py-24 text-center border-dashed border-white/10 bg-transparent flex flex-col items-center">
                 <Box className="w-12 h-12 text-slate-800 mb-6" />
                 <h3 className="text-white font-black text-lg italic uppercase">No Assets Found.</h3>
                 <p className="text-slate-500 text-xs mt-2 font-medium italic">Operational catalog is currently empty matching these filters.</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filtered.map((product, i) => {
                    const statusCfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.draft;
                    const lowStock = product.stockQuantity <= product.reorderThreshold;

                    return (
                       <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                          <div className="glass-card p-1 bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden group hover:bg-white/[0.04] hover:border-white/10 transition-all">
                             <div className="relative aspect-video overflow-hidden">
                                {product.images?.[0] ? (
                                   <img src={product.images[0]} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                ) : (
                                   <div className="w-full h-full bg-white/5 flex items-center justify-center"><Box className="w-8 h-8 text-slate-800" /></div>
                                )}
                                <div className={`absolute top-4 left-4 border px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${statusCfg.cls}`}>
                                   {statusCfg.label}
                                </div>
                             </div>
                             
                             <div className="p-6">
                                <h3 className="text-white font-black text-sm uppercase tracking-tighter truncate mb-1">{product.name}</h3>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-4 italic italic">{product.sku} // {product.category}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mb-6">
                                   <div>
                                      <p className="text-[9px] text-slate-600 font-black uppercase italic tracking-widest mb-1">Market Price</p>
                                      <p className="text-white font-black italic">₹{(product.price / 100).toLocaleString()}</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[9px] text-slate-600 font-black uppercase italic tracking-widest mb-1">Asset Volume</p>
                                      <p className={`font-black italic ${lowStock ? 'text-red-500' : 'text-slate-300'}`}>{product.stockQuantity} <span className="text-[10px] uppercase font-bold text-slate-600">{product.unit}</span></p>
                                   </div>
                                </div>

                                <div className="flex items-center gap-2">
                                   <button 
                                     onClick={() => toggleStatus(product)}
                                     className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                       product.status === 'active' 
                                        ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' 
                                        : 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                                     }`}
                                   >
                                      {product.status === 'active' ? 'Retire Asset' : 'Deploy Asset'}
                                   </button>
                                   <button className="p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                                      <Edit className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    );
                 })}
              </div>
           )}

           {/* Pro-Pagination */}
           {pagination && pagination.pages > 1 && (
              <div className="mt-20 border-t border-white/5 pt-12 flex items-center justify-center gap-3">
                 <button disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)} className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all disabled:opacity-20"><ArrowRight className="w-5 h-5 rotate-180" /></button>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6">Vector {pagination.page} of {pagination.pages}</span>
                 <button disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)} className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all disabled:opacity-20"><ArrowRight className="w-5 h-5" /></button>
              </div>
           )}
        </main>
    </div>
  );
}

export default function SupplierProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
       <ProductsContent />
    </Suspense>
  );
}
