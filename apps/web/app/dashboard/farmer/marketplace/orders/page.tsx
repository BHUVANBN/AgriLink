'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import {
  Package, Truck, Calendar, CreditCard, ChevronDown, CheckCircle2, Clock, XCircle,
  AlertCircle, Star, X, MapPin, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadRazorpay } from '@/lib/marketplace/razorpay';
import { inr, itemImage, itemName } from '@/lib/marketplace/format';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json()).then((d) => d.data ?? []);

const STEPS = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const;

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'PLACED': return <Clock className="w-4 h-4 text-brand-orange" />;
    case 'CONFIRMED':
    case 'PROCESSING': return <CheckCircle2 className="w-4 h-4 text-brand-green" />;
    case 'SHIPPED': return <Truck className="w-4 h-4 text-blue-500" />;
    case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-brand-green" />;
    case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
    case 'RETURNED': return <RotateCcw className="w-4 h-4 text-gray-500" />;
    default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
  }
}

function Progress({ status }: { status: string }) {
  if (status === 'CANCELLED' || status === 'RETURNED') return null;
  const current = STEPS.indexOf(status as (typeof STEPS)[number]);
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1 min-w-0">
            <div className={`w-3 h-3 rounded-full ${i <= current ? 'bg-brand-green' : 'bg-[#eae6de]'}`} />
            <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${i <= current ? 'text-brand-green' : 'text-text-muted'}`}>
              {s.toLowerCase()}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < current ? 'bg-brand-green' : 'bg-[#eae6de]'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function ReviewModal({ order, item, onClose, onDone }: { order: any; item: any; onClose: () => void; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (title.trim().length < 3 || body.trim().length < 10) {
      toast.error('Please add a short title and at least 10 characters of feedback');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/marketplace/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId: order.id, productId: item.productId, rating, title, body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(typeof json.error === 'string' ? json.error : 'Could not submit review');
      toast.success('Thanks for your review!');
      onDone();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Review</p>
            <h3 className="text-lg font-serif font-bold text-text-dark">{itemName(item)}</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-[#f8f7f4]"><X className="w-5 h-5 text-text-muted" /></button>
        </div>

        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} onClick={() => setRating(n)} aria-label={`${n} star`}>
              <Star className={`w-8 h-8 ${n <= rating ? 'text-amber-500 fill-amber-500' : 'text-[#eae6de]'}`} />
            </button>
          ))}
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Summary (e.g. Good quality seeds)"
          className="w-full px-4 py-3 rounded-xl border border-[#eae6de] focus:border-brand-green outline-none text-sm"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="How did the product perform on your farm?"
          className="w-full px-4 py-3 rounded-xl border border-[#eae6de] focus:border-brand-green outline-none text-sm resize-none"
        />

        <button
          onClick={submit}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-brand-green text-white font-bold text-sm disabled:opacity-60"
        >
          {saving ? 'Submitting…' : 'Submit review'}
        </button>
      </motion.div>
    </div>
  );
}

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const { data: orders = [], isLoading, mutate } = useSWR<any[]>(`${API_URL}/marketplace/orders`, fetcher);
  const { data: myReviews = [], mutate: mutateReviews } = useSWR<any[]>(`${API_URL}/marketplace/reviews/mine`, fetcher);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<{ order: any; item: any } | null>(null);

  const reviewed = new Set(myReviews.map((r: any) => `${r.orderId}:${r.productId}`));

  async function cancel(order: any) {
    if (!window.confirm(`Cancel order ${order.orderNumber}?`)) return;
    setBusy(order.id);
    try {
      const res = await fetch(`${API_URL}/marketplace/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderStatus: 'CANCELLED' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Could not cancel');
      toast.success('Order cancelled');
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  }

  async function payNow(order: any) {
    setBusy(order.id);
    try {
      if (!(await loadRazorpay())) throw new Error('Could not load payment window');
      const init = await fetch(`${API_URL}/marketplace/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderIds: [order.id] }),
      }).then((r) => r.json());
      if (!init.success) throw new Error(init.error ?? 'Payment initialisation failed');

      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key: init.data.keyId,
          amount: init.data.amount,
          currency: 'INR',
          name: 'AgriLink Marketplace',
          description: `Order ${order.orderNumber}`,
          order_id: init.data.razorpayOrderId,
          handler: async (response: any) => {
            const verify = await fetch(`${API_URL}/marketplace/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            }).then((r) => r.json());
            verify.success ? resolve() : reject(new Error('Payment verification failed'));
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
          theme: { color: '#1f3b2c' },
        });
        rzp.open();
      });
      toast.success('Payment successful');
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => <div key={i} className="h-32 rounded-[2rem] bg-white border border-[#eae6de] animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-green/10 border border-brand-green/20 p-6 rounded-3xl flex items-center gap-6"
        >
          <div className="w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center text-white shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-brand-green">Order placed!</h3>
            <p className="text-sm text-brand-green/80">The supplier has been notified. You can track progress below.</p>
          </div>
        </motion.div>
      )}

      <h1 className="text-3xl font-serif font-bold text-text-dark">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-[#eae6de] border-dashed p-20 text-center">
          <div className="w-24 h-24 bg-[#f8f7f4] rounded-full flex items-center justify-center mx-auto mb-8 text-text-muted">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-text-dark mb-4">No orders yet</h2>
          <p className="text-text-muted mb-8 max-w-xs mx-auto">Items you purchase from the marketplace will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items: any[] = Array.isArray(order.items) ? order.items : [];
            const expanded = open === order.id;
            const unpaidOnline = order.paymentMethod === 'RAZORPAY' && order.paymentStatus === 'PENDING' && order.orderStatus === 'PLACED';
            const cancellable = ['PLACED', 'CONFIRMED'].includes(order.orderStatus) && order.paymentStatus !== 'PAID';
            return (
              <div key={order.id} className="bg-white rounded-[2rem] border border-[#eae6de] overflow-hidden hover:border-brand-green/30 transition-all">
                <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-[#f8f7f4] border border-[#eae6de] rounded-lg text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {order.orderNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        order.paymentStatus === 'PAID' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange'
                      }`}>
                        <CreditCard className="w-3 h-3" /> {order.paymentMethod === 'COD' ? 'Cash on delivery' : order.paymentStatus}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-text-dark truncate">
                      {itemName(items[0])} {items.length > 1 ? `+ ${items.length - 1} more` : ''}
                    </h3>

                    <div className="flex flex-wrap gap-6 items-center">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-text-dark">
                        <StatusIcon status={order.orderStatus} />
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right shrink-0 w-full md:w-auto space-y-3">
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total</p>
                      <p className="text-2xl font-bold text-text-dark">{inr(order.totalPaise)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {unpaidOnline && (
                        <button
                          onClick={() => payNow(order)}
                          disabled={busy === order.id}
                          className="px-5 py-2.5 bg-brand-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-60"
                        >
                          Pay now
                        </button>
                      )}
                      <button
                        onClick={() => setOpen(expanded ? null : order.id)}
                        aria-expanded={expanded}
                        className="px-5 py-2.5 bg-[#f8f7f4] border border-[#eae6de] rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dark hover:border-brand-green transition-all flex items-center gap-2"
                      >
                        Details <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#f1eee8] bg-[#fdfcfa]"
                    >
                      <div className="p-6 sm:p-8 space-y-6">
                        <Progress status={order.orderStatus} />

                        <ul className="divide-y divide-[#f1eee8]">
                          {items.map((item, idx) => {
                            const key = `${order.id}:${item.productId}`;
                            return (
                              <li key={`${item.productId}-${idx}`} className="py-4 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-[#f8f7f4] overflow-hidden shrink-0 flex items-center justify-center">
                                  {itemImage(item)
                                    ? <img src={itemImage(item)!} alt="" className="w-full h-full object-cover" />
                                    : <Package className="w-5 h-5 text-text-muted" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-text-dark text-sm truncate">{itemName(item)}</p>
                                  <p className="text-xs text-text-muted">
                                    {item.quantity} × {inr(item.pricePaise ?? item.snapshot?.price ?? 0)}
                                  </p>
                                </div>
                                {order.orderStatus === 'DELIVERED' && (
                                  reviewed.has(key)
                                    ? <span className="text-[10px] font-black uppercase tracking-widest text-brand-green">Reviewed ✓</span>
                                    : (
                                      <button
                                        onClick={() => setReviewing({ order, item })}
                                        className="px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                                      >
                                        <Star className="w-3 h-3" /> Review
                                      </button>
                                    )
                                )}
                              </li>
                            );
                          })}
                        </ul>

                        <div className="grid sm:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-1 text-text-muted">
                            <div className="flex justify-between"><span>Subtotal</span><span>{inr(order.subtotalPaise)}</span></div>
                            <div className="flex justify-between"><span>GST</span><span>{inr(order.taxPaise)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>{inr(order.shippingPaise)}</span></div>
                            <div className="flex justify-between font-bold text-text-dark pt-1 border-t border-[#f1eee8]"><span>Total</span><span>{inr(order.totalPaise)}</span></div>
                          </div>
                          {order.shippingAddress && (
                            <div className="flex gap-3 text-text-muted">
                              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                              <p className="text-sm">
                                {Object.values(order.shippingAddress as Record<string, string>).filter(Boolean).join(', ')}
                              </p>
                            </div>
                          )}
                        </div>

                        {cancellable && (
                          <button
                            onClick={() => cancel(order)}
                            disabled={busy === order.id}
                            className="text-xs font-bold text-red-600 hover:underline disabled:opacity-60"
                          >
                            Cancel order
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {reviewing && (
        <ReviewModal
          order={reviewing.order}
          item={reviewing.item}
          onClose={() => setReviewing(null)}
          onDone={() => { setReviewing(null); mutateReviews(); }}
        />
      )}
    </div>
  );
}

export default function OrdersPage() {
  // useSearchParams() needs a Suspense boundary for static prerendering
  return (
    <Suspense fallback={null}>
      <OrdersPageContent />
    </Suspense>
  );
}
