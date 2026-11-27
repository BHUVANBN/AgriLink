'use client';

import { useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { Users, Plus, Timer, Target, X } from 'lucide-react';
import SupplierSidebar from '@/components/SupplierSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { inr } from '@/lib/marketplace/format';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json()).then((d) => d.data);

function CreateDeal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { data: productData } = useSWR(`${API}/supplier/products?status=active&limit=100`, fetcher);
  const products: any[] = productData?.items ?? productData ?? [];
  const [form, setForm] = useState({ productId: '', title: '', description: '', targetQuantity: 50, dealPrice: '', days: 7 });
  const [saving, setSaving] = useState(false);
  const product = products.find((p) => p.id === form.productId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/marketplace/community/deals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: form.productId,
          title: form.title,
          description: form.description,
          targetQuantity: form.targetQuantity,
          dealPricePaise: Math.round(Number(form.dealPrice) * 100),
          endsAt: new Date(Date.now() + form.days * 86400_000).toISOString(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(typeof json.error === 'string' ? json.error : 'Please check the form');
      toast.success('Group deal is live');
      onCreated();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const input = 'w-full px-4 py-3 rounded-xl border border-[#eae6de] focus:border-brand-green outline-none text-sm mt-1';
  const discount = product && form.dealPrice ? Math.round((1 - (Number(form.dealPrice) * 100) / product.price) * 100) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-text-dark">New group deal</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-[#f8f7f4]"><X className="w-5 h-5" /></button>
        </div>
        <label className="block text-sm font-bold text-text-dark">
          Product
          <select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className={input}>
            <option value="">Select an active product…</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {inr(p.price)} / {p.unit}</option>)}
          </select>
        </label>
        {products.length === 0 && <p className="text-xs text-amber-700">You need at least one active product to create a deal.</p>}
        <label className="block text-sm font-bold text-text-dark">
          Title
          <input required minLength={5} maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Kharif DAP group order" className={input} />
        </label>
        <label className="block text-sm font-bold text-text-dark">
          Description
          <textarea required minLength={10} maxLength={1000} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${input} resize-none`} />
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="block text-sm font-bold text-text-dark">
            Target units
            <input required type="number" min={2} value={form.targetQuantity} onChange={(e) => setForm({ ...form, targetQuantity: Number(e.target.value) })} className={input} />
          </label>
          <label className="block text-sm font-bold text-text-dark">
            Deal price (₹)
            <input required type="number" min={1} step="0.01" value={form.dealPrice} onChange={(e) => setForm({ ...form, dealPrice: e.target.value })} className={input} />
          </label>
          <label className="block text-sm font-bold text-text-dark">
            Runs for
            <select value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} className={input}>
              {[3, 7, 14, 30].map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          </label>
        </div>
        {discount !== null && (
          <p className={`text-sm ${discount > 0 ? 'text-brand-green' : 'text-red-600'}`}>
            {discount > 0 ? `${discount}% below your current price of ${inr(product.price)}` : 'Deal price must be lower than the current price'}
          </p>
        )}
        <button disabled={saving} className="w-full py-3 rounded-xl bg-brand-green text-white font-bold text-sm disabled:opacity-60">
          {saving ? 'Creating…' : 'Publish deal'}
        </button>
      </form>
    </div>
  );
}

export default function SupplierDealsPage() {
  const { isLoading: authLoading } = useRequireAuth('supplier');
  const { data, isLoading, mutate } = useSWR(`${API}/marketplace/community/deals/supplier`, fetcher);
  const deals: any[] = data ?? [];
  const [creating, setCreating] = useState(false);

  async function closeDeal(id: string) {
    if (!window.confirm('Close this deal now? If the target is met, orders are created for all participants.')) return;
    const res = await fetch(`${API}/marketplace/community/deals/${id}/close`, { method: 'POST', credentials: 'include' });
    const json = await res.json();
    res.ok ? toast.success('Deal closed') : toast.error(json.error ?? 'Could not close deal');
    mutate();
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Group deals" />
      <main className="lg:ml-72 p-6 lg:p-10 max-w-6xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-text-dark">Group deals</h2>
            <p className="text-text-muted text-sm mt-1">Offer a lower price when farmers order together. Orders are created automatically if the target is reached.</p>
          </div>
          <button onClick={() => setCreating(true)} className="px-5 py-3 rounded-xl bg-brand-green text-white text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New deal
          </button>
        </div>

        {(authLoading || isLoading) ? (
          <div className="h-40 bg-white rounded-3xl border border-[#eae6de] animate-pulse" />
        ) : deals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-[#eae6de] p-16 text-center">
            <Users className="w-10 h-10 mx-auto text-text-muted mb-4" />
            <p className="font-bold text-text-dark">No group deals yet</p>
            <p className="text-sm text-text-muted mt-1">Create one to move more stock at a better price for farmers.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {deals.map((d) => {
              const pct = Math.min(100, Math.round((d.currentQuantity / d.targetQuantity) * 100));
              const open = d.isActive && new Date(d.endsAt) > new Date();
              return (
                <div key={d.id} className="bg-white rounded-3xl border border-[#eae6de] p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-text-dark">{d.title}</h3>
                      <p className="text-sm text-text-muted line-clamp-2">{d.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${
                      open ? 'bg-brand-green/10 text-brand-green' : pct >= 100 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {open ? 'Open' : pct >= 100 ? 'Unlocked' : 'Closed'}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-text-muted mb-1">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {d.currentQuantity} / {d.targetQuantity} units · {d._count?.participants ?? 0} farmers</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#f1eee8]"><div className="h-2 rounded-full bg-brand-green" style={{ width: `${pct}%` }} /></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span><strong className="text-brand-green">{inr(d.dealPricePaise)}</strong> <span className="line-through text-text-muted">{inr(d.originalPricePaise)}</span></span>
                    <span className="text-text-muted flex items-center gap-1"><Timer className="w-3 h-3" /> {open ? `ends ${new Date(d.endsAt).toLocaleDateString('en-IN')}` : `ended ${new Date(d.endsAt).toLocaleDateString('en-IN')}`}</span>
                  </div>
                  {open && (
                    <button onClick={() => closeDeal(d.id)} className="text-xs font-bold text-red-600 hover:underline">Close now</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      {creating && <CreateDeal onClose={() => setCreating(false)} onCreated={() => { setCreating(false); mutate(); }} />}
    </div>
  );
}
