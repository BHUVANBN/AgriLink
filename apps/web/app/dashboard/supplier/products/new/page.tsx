'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const CATEGORIES = ['seeds', 'fertilizers', 'pesticides', 'tools', 'equipment', 'feed', 'other'];
const UNITS = ['kg', 'g', 'litre', 'ml', 'unit', 'pack', 'bag', 'box', 'bottle', 'set'];

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', category: 'seeds', description: '', price: '', mrp: '',
    unit: 'kg', stockQuantity: '', reorderThreshold: '5', weight: '',
    tags: '', specifications: '',
  });

  function change(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.mrp || !form.stockQuantity) {
      toast.error('Fill all required fields'); return;
    }
    if (Number(form.price) > Number(form.mrp)) {
      toast.error('Price cannot be greater than MRP'); return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Math.round(Number(form.price) * 100),  // convert to paise
        mrp: Math.round(Number(form.mrp) * 100),
        unit: form.unit,
        stockQuantity: Number(form.stockQuantity),
        reorderThreshold: Number(form.reorderThreshold),
        weight: form.weight ? Number(form.weight) : undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        specifications: form.specifications ? (() => {
          try { return JSON.parse(form.specifications); } catch { return {}; }
        })() : {},
      };

      const res = await fetch(`${API}/supplier/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to create product');

      setCreatedProductId(json.data.id);
      toast.success('Product created! Now add images.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File) {
    if (!createdProductId) { toast.error('Save product first'); return; }
    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API}/supplier/products/${createdProductId}/images`, {
        method: 'POST', body: form, credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      setUploadedImages(json.data.images ?? []);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Add Product" />
      <main className="lg:ml-72 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-8">
              <Link href="/dashboard/supplier/products" className="text-text-muted hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h2 className="text-text-dark font-serif font-bold">Add New Product</h2>
                <p className="text-text-muted text-sm mt-0.5">List a product on the AgriLink marketplace</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 space-y-4">
                <h3 className="text-text-dark font-serif font-bold mb-2">Product Information</h3>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Product Name *</label>
                  <input className="input-field" value={form.name} onChange={e => change('name', e.target.value)} placeholder="e.g. Premium Paddy Seeds (MTU 1010)" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Category *</label>
                    <select className="input-field" value={form.category} onChange={e => change('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c} className="capitalize bg-slate-900">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Unit *</label>
                    <select className="input-field" value={form.unit} onChange={e => change('unit', e.target.value)}>
                      {UNITS.map(u => <option key={u} value={u} className="bg-slate-900">{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Description *</label>
                  <textarea className="input-field min-h-28 resize-y" value={form.description} onChange={e => change('description', e.target.value)} placeholder="Describe your product, quality, usage..." required />
                </div>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Tags (comma-separated)</label>
                  <input className="input-field" value={form.tags} onChange={e => change('tags', e.target.value)} placeholder="organic, paddy, karnataka" />
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 space-y-4">
                <h3 className="text-text-dark font-serif font-bold mb-2">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Selling Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 text-sm">₹</span>
                      <input className="input-field pl-7" type="number" min="0" step="0.01" value={form.price} onChange={e => change('price', e.target.value)} placeholder="0.00" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">MRP (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 text-sm">₹</span>
                      <input className="input-field pl-7" type="number" min="0" step="0.01" value={form.mrp} onChange={e => change('mrp', e.target.value)} placeholder="0.00" required />
                    </div>
                  </div>
                </div>
                {form.price && form.mrp && Number(form.price) < Number(form.mrp) && (
                  <p className="text-green-400 text-xs">✓ {Math.round(((Number(form.mrp) - Number(form.price)) / Number(form.mrp)) * 100)}% discount from MRP</p>
                )}
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 space-y-4">
                <h3 className="text-text-dark font-serif font-bold mb-2">Inventory</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Stock Qty *</label>
                    <input className="input-field" type="number" min="0" value={form.stockQuantity} onChange={e => change('stockQuantity', e.target.value)} placeholder="100" required />
                  </div>
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Reorder At</label>
                    <input className="input-field" type="number" min="0" value={form.reorderThreshold} onChange={e => change('reorderThreshold', e.target.value)} placeholder="5" />
                  </div>
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Weight (kg)</label>
                    <input className="input-field" type="number" min="0" step="0.1" value={form.weight} onChange={e => change('weight', e.target.value)} placeholder="1.0" />
                  </div>
                </div>
              </div>

              {!createdProductId ? (
                <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-4 text-base">
                  {saving ? 'Creating Product...' : '✓ Create Product'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-4 border border-green-500/30 bg-green-500/10 flex items-center gap-3">
                    <Package className="w-5 h-5 text-green-400" />
                    <p className="text-green-300 text-sm font-medium">Product created! Add images below.</p>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6">
                    <h3 className="text-text-dark font-serif font-bold mb-4">Product Images</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {uploadedImages.map((url, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                          <img src={url} alt={`Product ${i+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <label className={`w-24 h-24 rounded-xl border-2 border-dashed border-white/15 hover:border-white/30 flex flex-col items-center justify-center cursor-pointer transition-all ${uploadingImage ? 'opacity-50' : ''}`}>
                        <Upload className="w-5 h-5 text-slate-500 mb-1" />
                        <span className="text-slate-500 text-xs">{uploadingImage ? 'Uploading...' : 'Add image'}</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploadingImage}
                          onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/supplier/products')}
                    className="btn-primary w-full justify-center py-4"
                  >
                    Done — View All Products
                  </button>
                </div>
              )}
            </form>
          </motion.div>
      </main>
    </div>
  );
}
