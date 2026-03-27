'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Upload, 
  X, 
  Save, 
  Trash2, 
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle,
  Truck
} from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const CATEGORIES = ['seeds', 'fertilizers', 'pesticides', 'tools', 'equipment', 'feed', 'other'];
const UNITS = ['kg', 'g', 'litre', 'ml', 'unit', 'pack', 'bag', 'box', 'bottle', 'set'];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: product, mutate } = useSWR(`${API}/supplier/products/public/${id}`, fetcher);
  
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (product && !form) {
      setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        price: (product.price / 100).toString(),
        mrp: (product.mrp / 100).toString(),
        unit: product.unit,
        stockQuantity: product.stockQuantity.toString(),
        reorderThreshold: product.reorderThreshold.toString(),
        weight: product.weight?.toString() ?? '',
        tags: product.tags?.join(', ') ?? '',
        status: product.status,
      });
    }
  }, [product, form]);

  function change(field: string, value: string | boolean) {
    setForm((f: any) => ({ ...f, [field]: value }));
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Math.round(Number(form.price) * 100),
        mrp: Math.round(Number(form.mrp) * 100),
        stockQuantity: Number(form.stockQuantity),
        reorderThreshold: Number(form.reorderThreshold),
        weight: form.weight ? Number(form.weight) : undefined,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      };

      const res = await fetch(`${API}/supplier/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Asset protocol updated!');
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File) {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API}/supplier/products/${id}/images`, {
        method: 'POST', body: fd, credentials: 'include',
      });
      if (!res.ok) throw new Error('Upload failed');
      mutate();
      toast.success('Visual asset attached!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function deleteImage(imageUrl: string) {
    try {
      const res = await fetch(`${API}/supplier/products/${id}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ imageUrl }),
      });
      if (!res.ok) throw new Error('Delete failed');
      mutate();
      toast.success('Image purged from cluster');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`${API}/supplier/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Deactivation failed');
      toast.success('Product specialized as Inactive');
      router.push('/dashboard/supplier/products');
    } catch (err: any) {
      toast.error(err.message);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  if (!product || !form) return <div className="min-h-screen bg-brand-bg flex"><div className="flex-1 lg:ml-72 animate-pulse p-12 bg-white m-6 rounded-[2.5rem]" /></div>;

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Edit Asset" />
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
               <Link href="/dashboard/supplier/products" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#eae6de] shadow-sm hover:translate-x-[-4px] transition-transform">
                  <ArrowLeft className="w-5 h-5 text-text-muted" />
               </Link>
               <div>
                  <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tighter">Edit Protocol: <span className="opacity-40">{product.sku}</span></h2>
                  <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest mt-1 italic">Last sync: {new Date(product.updatedAt).toLocaleString()}</p>
               </div>
            </div>
            <button onClick={() => setShowDeleteModal(true)} className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 hover:bg-red-100 transition-all shadow-sm group">
               <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* Left Column: Form Info */}
             <div className="lg:col-span-2 space-y-8">
                <form onSubmit={handleUpdate} className="space-y-8">
                   <div className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft p-10 space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                         <ImageIcon className="w-5 h-5 text-brand-green" />
                         <h3 className="text-xl font-bold text-text-dark font-serif tracking-tight">Core Metadata</h3>
                      </div>
                      
                      <div>
                        <label className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 block italic">Display Identity</label>
                        <input className="input-field py-4" value={form.name} onChange={e => change('name', e.target.value)} required />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 block italic">Sector Class</label>
                          <select className="input-field" value={form.category} onChange={e => change('category', e.target.value)}>
                            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 block italic">Unit Designation</label>
                          <select className="input-field" value={form.unit} onChange={e => change('unit', e.target.value)}>
                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 block italic">Vector Description</label>
                        <textarea className="input-field min-h-32 resize-none" value={form.description} onChange={e => change('description', e.target.value)} required />
                      </div>
                   </div>

                   <div className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft p-10 space-y-6">
                      <h3 className="text-xl font-bold text-text-dark font-serif tracking-tight mb-4 flex items-center gap-3">
                         <ArrowLeft className="w-5 h-5 text-brand-orange rotate-180" /> Operational Thresholds
                      </h3>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <div>
                               <label className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 block italic">Asset Price (₹)</label>
                               <input type="number" step="0.01" className="input-field" value={form.price} onChange={e => change('price', e.target.value)} required />
                            </div>
                            <div>
                               <label className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 block italic">Current Real Stock</label>
                               <input type="number" className="input-field" value={form.stockQuantity} onChange={e => change('stockQuantity', e.target.value)} required />
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div>
                               <label className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 block italic">Market MRP (₹)</label>
                               <input type="number" step="0.01" className="input-field" value={form.mrp} onChange={e => change('mrp', e.target.value)} required />
                            </div>
                            <div>
                               <label className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 block italic">Reorder Trigger</label>
                               <input type="number" className="input-field" value={form.reorderThreshold} onChange={e => change('reorderThreshold', e.target.value)} required />
                            </div>
                         </div>
                      </div>
                      <div className="pt-6">
                         <button type="submit" disabled={saving} className="w-full py-5 bg-brand-green text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-brand-green-hover transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-green/15">
                            <Save className="w-5 h-5" /> {saving ? 'Updating Protocol...' : 'Finalize Strategy Changes'}
                         </button>
                      </div>
                   </div>
                </form>
             </div>

             {/* Right Column: Visual Clusters & Status */}
             <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft p-8 space-y-6">
                   <h3 className="text-[11px] font-black text-text-dark uppercase tracking-[0.2em] italic border-b border-[#f8f7f4] pb-4">Lifecycle Vector</h3>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`w-3 h-3 rounded-full ${form.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                         <span className="text-[11px] font-black uppercase tracking-widest text-text-dark">{form.status}</span>
                      </div>
                      <button 
                        onClick={() => change('status', form.status === 'active' ? 'inactive' : 'active')}
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${form.status === 'active' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                      >
                         Switch to {form.status === 'active' ? 'stalling' : 'active'}
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft p-8 space-y-6">
                   <h3 className="text-[11px] font-black text-text-dark uppercase tracking-[0.2em] italic border-b border-[#f8f7f4] pb-4">Visual Assets</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {product.images.map((url: string, i: number) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-[#f8f7f4]">
                           <img src={url} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => deleteImage(url)}
                             className="absolute top-2 right-2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                           >
                              <X className="w-4 h-4" />
                           </button>
                        </div>
                      ))}
                      <label className={`aspect-square rounded-2xl border-2 border-dashed border-[#eae6de] hover:border-brand-green/30 hover:bg-[#f8f7f4] flex flex-col items-center justify-center cursor-pointer transition-all ${uploadingImage ? 'opacity-50' : ''}`}>
                        <Upload className="w-6 h-6 text-slate-300 mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#929285]">{uploadingImage ? '...' : 'Add Clip'}</span>
                        <input type="file" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} disabled={uploadingImage} />
                      </label>
                   </div>
                </div>

                <div className="bg-brand-orange/5 p-8 rounded-[2rem] border border-brand-orange/10 italic text-[11px] text-brand-orange font-bold leading-relaxed shadow-sm">
                   Protocol changes are immediate and will affect global marketplace indexing within 5 minutes.
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-[#0a0f1e]/40 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 border border-[#eae6de] shadow-2xl">
                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8">
                   <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold text-text-dark font-serif tracking-tight mb-4">Confirm Deactivation</h3>
                <p className="text-text-muted text-[13px] leading-relaxed mb-10">This will immediately stall the operational vector for <span className="text-text-dark font-bold">#{product.sku}</span>. Farmers will no longer see this asset. This action is reversible via protocol settings.</p>
                <div className="flex gap-4">
                   <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-[#f8f7f4] text-text-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#eae6de] transition-all">Abort Ops</button>
                   <button onClick={handleDelete} disabled={deleting} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                      {deleting ? 'Deactivating...' : 'Confirm Strategy'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
