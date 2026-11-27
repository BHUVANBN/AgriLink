'use client';

import { useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { CreditCard, IndianRupee, RotateCcw, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { inr } from '@/lib/marketplace/format';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json()).then((d) => d.data);

const STATUS_STYLE: Record<string, string> = {
  PAID: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  REFUNDED: 'bg-slate-100 text-slate-600',
  FAILED: 'bg-red-50 text-red-700',
};

export default function AdminTransactionsPage() {
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const params = new URLSearchParams({ ...(status && { status }), ...(method && { method }) });
  const { data, isLoading, mutate } = useSWR(`${API}/marketplace/admin/transactions?${params}`, fetcher);
  const [refunding, setRefunding] = useState<string | null>(null);

  const s = data?.summary ?? {};
  const cards = [
    { label: 'Collected', value: inr(s.PAID?.totalPaise), sub: `${s.PAID?.count ?? 0} paid orders`, icon: CheckCircle2, cls: 'text-emerald-600 bg-emerald-50' },
    { label: 'Awaiting payment', value: inr(s.PENDING?.totalPaise), sub: `${s.PENDING?.count ?? 0} orders (incl. COD)`, icon: Clock, cls: 'text-amber-600 bg-amber-50' },
    { label: 'Refunded', value: inr(s.REFUNDED?.totalPaise), sub: `${s.REFUNDED?.count ?? 0} orders`, icon: RotateCcw, cls: 'text-slate-600 bg-slate-100' },
    { label: 'Failed', value: `${s.FAILED?.count ?? 0}`, sub: 'payment attempts', icon: XCircle, cls: 'text-red-600 bg-red-50' },
  ];

  async function refund(order: any) {
    if (!window.confirm(`Refund ${inr(order.totalPaise)} for ${order.orderNumber}? This calls Razorpay and cannot be undone.`)) return;
    setRefunding(order.id);
    try {
      const res = await fetch(`${API}/marketplace/payment/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId: order.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Refund failed');
      toast.success(`Refund started (${json.data.status})`);
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRefunding(null);
    }
  }

  const select = 'px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700';

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.cls}`}><c.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{c.label}</p>
              <p className="text-xl font-bold text-slate-900">{c.value}</p>
              <p className="text-xs text-slate-500">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={select} aria-label="Payment status">
          <option value="">All statuses</option>
          {['PAID', 'PENDING', 'REFUNDED', 'FAILED'].map((v) => <option key={v}>{v}</option>)}
        </select>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className={select} aria-label="Payment method">
          <option value="">All methods</option>
          <option value="RAZORPAY">Online (Razorpay)</option>
          <option value="COD">Cash on delivery</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
            <tr>
              <th className="p-4">Order</th><th className="p-4">Date</th><th className="p-4">Method</th>
              <th className="p-4">Razorpay payment</th><th className="p-4 text-right">Amount</th><th className="p-4">Status</th><th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading…</td></tr>
            ) : (data?.orders ?? []).length === 0 ? (
              <tr><td colSpan={7} className="p-12 text-center text-slate-400"><CreditCard className="w-8 h-8 mx-auto mb-2" />No transactions match these filters.</td></tr>
            ) : (
              data.orders.map((o: any) => (
                <tr key={o.id}>
                  <td className="p-4 font-mono text-xs text-slate-900">{o.orderNumber}</td>
                  <td className="p-4 text-slate-500">{new Date(o.paidAt ?? o.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-4 text-slate-600">{o.paymentMethod === 'COD' ? 'Cash on delivery' : 'Online'}</td>
                  <td className="p-4 font-mono text-xs text-slate-500">{o.razorpayPaymentId ?? '—'}</td>
                  <td className="p-4 text-right font-bold text-slate-900"><IndianRupee className="w-3 h-3 inline -mt-0.5" />{(o.totalPaise / 100).toLocaleString('en-IN')}</td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_STYLE[o.paymentStatus] ?? ''}`}>{o.paymentStatus}</span></td>
                  <td className="p-4 text-right">
                    {o.paymentStatus === 'PAID' && o.razorpayPaymentId && (
                      <button
                        onClick={() => refund(o)}
                        disabled={refunding === o.id}
                        className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
