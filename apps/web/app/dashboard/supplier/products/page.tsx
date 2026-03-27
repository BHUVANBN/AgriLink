'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  AlertTriangle,
  ChevronRight,
  Filter,
  TrendingUp,
  BarChart3,
  Box,
  HelpCircle,
  FileUp,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const CATEGORIES = ['seeds', 'fertilizers', 'pesticides', 'tools', 'equipment', 'feed', 'other'];
const STATUS_CONFIG: Record<string, { label: string; cls: string; color: string }> = {
  active:   { label: 'Active',   cls: 'bg-emerald-50 text-emerald-600 border-emerald-100', color: 'emerald' },
  draft:    { label: 'Draft',    cls: 'bg-[#f8f7f4] text-text-muted border-[#eae6de]', color: 'slate' },
  inactive: { label: 'Inactive', cls: 'bg-red-50 text-red-600 border-red-100', color: 'red'   },
};

function ProductsContent() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

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

  function handleDeleteClick(product: any) {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  }

  async function confirmDeactivate() {
    if (!selectedProduct) return;
    setDeactivating(true);
    try {
      const res = await fetch(`${API}/supplier/products/${selectedProduct.id}`, {
         method: 'DELETE',
         credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed');
      mutate();
      toast.success(`Asset ${selectedProduct.name} purged from index`);
      setShowDeleteModal(false);
    } catch { 
      toast.error('Failed to stall operation'); 
    } finally {
      setDeactivating(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Inventory" />
      <main className="lg:ml-72 p-6 lg:p-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-5xl font-bold text-text-dark font-serif tracking-tighter">Warehouse Portfolio</h2>
              <p className="text-brand-orange font-black text-[11px] mt-2 uppercase tracking-[0.25em] italic">High-Fidelity Asset Catalog & Digital Inventory Control</p>
            </div>
            
            <div className="flex items-center gap-4">
               <Link href="/dashboard/supplier/products/import" className="px-8 py-4 bg-white border border-[#eae6de] text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-dark rounded-[1.5rem] shadow-sm transition-all flex items-center gap-3 group">
                  <FileUp className="w-4 h-4 text-brand-orange group-hover:scale-110" /> Batch Acquisition
               </Link>
               <Link href="/dashboard/supplier/products/new" className="px-8 py-4 bg-brand-green text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-green-hover rounded-[1.5rem] shadow-xl shadow-brand-green/20 transition-all flex items-center gap-3 group">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Deploy Asset
               </Link>
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               {[
                 { label: 'Platform Visibility', value: products.filter(p => p.status === 'active').length, icon: Eye, cls: 'bg-blue-50 text-blue-600' },
                 { label: 'Depletion Alerts',   value: products.filter(p => p.stockQuantity <= p.reorderThreshold).length, icon: AlertTriangle, cls: 'bg-amber-50 text-amber-600' },
               ].map((stat, i) => (
                 <div key={i} className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 flex items-center justify-between group overflow-hidden relative">
                    <div className="relative z-10">
                       <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1 italic">{stat.label}</p>
                       <p className="text-3xl font-bold text-text-dark font-serif tracking-tighter">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.cls}`}><stat.icon className="w-6 h-6" /></div>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#f8f7f4] rounded-full blur-2xl -translate-y-4 translate-x-4 opacity-50" />
                 </div>
               ))}
            </div>

            {/* Filters Hub */}
            <div className="flex flex-wrap items-center gap-4 mb-10 bg-white p-2 rounded-3xl border border-[#eae6de] shadow-sm">
               <div className="flex-1 relative min-w-[200px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className="w-full bg-transparent p-3.5 pl-12 text-[11px] font-bold text-text-dark outline-none placeholder:text-slate-300" placeholder="Vectoring Search by Name or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
               </div>
               <div className="h-8 w-px bg-[#eae6de] hidden md:block" />
               <div className="flex items-center gap-2 p-1">
                  <select className="bg-transparent text-text-muted text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
                     <option value="">Categories: All</option>
                     {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
               <div className="h-8 w-px bg-[#eae6de] hidden md:block" />
               <div className="flex items-center gap-2 p-1 pr-4">
                  <select className="bg-transparent text-text-muted text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                     <option value="">Status: All</option>
                     <option value="active">Active</option>
                     <option value="draft">Draft</option>
                     <option value="inactive">Inactive</option>
                  </select>
               </div>
            </div>

           {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 bg-white border border-[#eae6de] animate-pulse rounded-[2rem]" />)}
              </div>
           ) : filtered.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-[#eae6de] py-24 text-center flex flex-col items-center">
                 <Box className="w-12 h-12 text-slate-300 mb-6" />
                 <h3 className="text-text-dark font-black text-lg italic uppercase">No Assets Found.</h3>
                 <p className="text-text-muted text-xs mt-2 font-medium italic">Operational catalog is currently empty matching these filters.</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filtered.map((product, i) => {
                    const statusCfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.draft;
                    const lowStock = product.stockQuantity <= product.reorderThreshold;

                    return (
                       <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                          <div className="bg-white border border-[#eae6de] p-1 rounded-[2rem] overflow-hidden group hover:shadow-soft transition-all">
                             <div className="relative aspect-video overflow-hidden bg-[#f8f7f4]">
                                {product.images?.[0] ? (
                                   <img src={product.images[0]} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center"><Box className="w-8 h-8 text-slate-200" /></div>
                                )}
                                <div className={`absolute top-4 left-4 border px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${statusCfg.cls}`}>
                                   {statusCfg.label}
                                </div>
                             </div>
                             
                             <div className="p-6">
                                <h3 className="text-text-dark font-black text-sm uppercase tracking-tighter truncate mb-1">{product.name}</h3>
                                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest mb-4 italic">{product.sku} // {product.category}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-[#f8f7f4] mb-6">
                                   <div>
                                      <p className="text-[9px] text-text-muted font-black uppercase italic tracking-widest mb-1">Market Price</p>
                                      <p className="text-text-dark font-black italic">₹{(product.price / 100).toLocaleString()}</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[9px] text-text-muted font-black uppercase italic tracking-widest mb-1">Asset Volume</p>
                                      <p className={`font-black italic ${lowStock ? 'text-red-500' : 'text-text-dark'}`}>{product.stockQuantity} <span className="text-[10px] uppercase font-bold text-text-muted">{product.unit}</span></p>
                                   </div>
                                </div>

                                 <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => toggleStatus(product)}
                                      className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                        product.status === 'active'
                                         ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
                                         : 'border-brand-green/30 text-brand-green hover:bg-brand-green/10'
                                      }`}
                                    >
                                       {product.status === 'active' ? 'Retire Asset' : 'Deploy Asset'}
                                    </button>
                                    <Link href={`/dashboard/supplier/products/${product.id}`} className="p-2.5 rounded-xl border border-[#eae6de] text-text-muted hover:text-text-dark hover:bg-[#f8f7f4] transition-all">
                                       <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                      onClick={() => handleDeleteClick(product)}
                                      className="p-2.5 rounded-xl border border-[#eae6de] text-red-500 hover:bg-red-500/10 transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
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
               <div className="mt-20 border-t border-[#f8f7f4] pt-12 flex items-center justify-center gap-6">
                  <button 
                    disabled={!pagination.hasPrev} 
                    onClick={() => setPage(p => p - 1)} 
                    className="p-4 bg-white border border-[#eae6de] rounded-2xl text-text-muted hover:text-text-dark hover:shadow-soft transition-all disabled:opacity-20 shadow-sm"
                  >
                     <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest px-6 italic">Vector {pagination.page} / {pagination.pages}</span>
                  <button 
                    disabled={!pagination.hasNext} 
                    onClick={() => setPage(p => p + 1)} 
                    className="p-4 bg-white border border-[#eae6de] rounded-2xl text-text-muted hover:text-text-dark hover:shadow-soft transition-all disabled:opacity-20 shadow-sm"
                  >
                     <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
             )}

            <AnimatePresence>
               {showDeleteModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-brand-bg/60 backdrop-blur-sm" />
                     <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 border border-[#eae6de] shadow-2xl">
                        <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8">
                           <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-text-dark font-serif tracking-tight mb-4 text-center">Deactivate Asset?</h3>
                        <p className="text-text-muted text-[11px] leading-relaxed mb-10 text-center uppercase font-bold tracking-widest italic">
                           Suspending protocol for {selectedProduct?.sku}. Farmers will no longer be able to source this material.
                        </p>
                        <div className="flex gap-4">
                           <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-[#f8f7f4] text-text-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#eae6de] transition-all">Abort</button>
                           <button onClick={confirmDeactivate} disabled={deactivating} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                              {deactivating ? 'Stalling...' : 'Confirm Purge'}
                           </button>
                        </div>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>
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
