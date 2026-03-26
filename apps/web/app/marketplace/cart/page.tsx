'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { Package, Plus, Minus, Trash2, ShoppingCart, ArrowLeft, ArrowRight, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());

export default function CartPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const { data, mutate, isLoading } = useSWR(`${API}/marketplace/cart`, fetcher);
  const [removing, setRemoving] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const items: any[] = data?.data ?? [];

  async function removeItem(id: string) {
    setRemoving(id);
    try {
      const res = await fetch(`${API}/marketplace/cart/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to remove');
      mutate();
      toast.success('Item removed');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRemoving(null);
    }
  }

  async function updateQuantity(id: string, newQty: number) {
    if (newQty < 1) { removeItem(id); return; }
    setUpdating(id);
    try {
      const res = await fetch(`${API}/marketplace/cart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error('Failed to update');
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + (item.snapshot?.price ?? 0) * item.quantity, 0);
  const shipping = items.length > 0 ? 5000 : 0;
  const tax = Math.floor(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (authLoading) return <div className="min-h-screen bg-[#0a0f1e]" />;

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="sticky top-0 z-30 bg-[#1a1a1a]/95 backdrop-blur border-b border-[#eae6de]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/marketplace" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-green flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-white">AgriLink</span>
          </Link>
          <h1 className="text-white font-bold flex-1 text-center">Shopping Cart</h1>
          <Link href="/marketplace" className="text-text-muted hover:text-white flex items-center gap-2 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl border border-[#eae6de] animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#eae6de] p-16 text-center">
            <ShoppingCart className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-dark font-bold text-xl mb-2">Your cart is empty</p>
            <p className="text-text-muted text-sm mb-6">Add products from marketplace</p>
            <Link href="/marketplace" className="btn-primary">Browse Products</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-text-dark font-bold text-lg mb-4">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</h2>
              {items.map((item: any, i: number) => {
                const priceRs = (item.snapshot?.price ?? 0) / 100;
                const totalRs = priceRs * item.quantity;
                const isUpdating = updating === item.id;
                const isRemoving = removing === item.id;

                return (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className={`bg-white rounded-2xl border border-[#eae6de] p-5 flex items-center gap-4 transition-opacity ${(isUpdating || isRemoving) ? 'opacity-50' : ''}`}>
                      {item.snapshot?.image ? (
                        <img src={item.snapshot.image} alt={item.snapshot?.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-[#f8f7f4] flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-text-muted" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-text-dark font-semibold text-sm">{item.snapshot?.name ?? 'Product'}</p>
                        <p className="text-text-muted text-xs mt-0.5">₹{priceRs.toLocaleString('en-IN')} / {item.snapshot?.unit ?? 'unit'}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-0 bg-[#f8f7f4] rounded-lg border border-[#eae6de] px-3 py-2">
                            <button
                              className="text-text-muted hover:text-text-dark disabled:opacity-30 transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating || isRemoving}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-text-dark text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              className="text-text-muted hover:text-text-dark disabled:opacity-30 transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating || isRemoving}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-text-dark font-bold">₹{totalRs.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isRemoving || isUpdating}
                        className="text-red-500 hover:text-red-400 transition-colors flex-shrink-0 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#eae6de] p-6 sticky top-24">
                <h3 className="text-text-dark font-semibold mb-5">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal ({items.length} items)</span>
                    <span className="text-text-dark">₹{(subtotal / 100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Shipping</span>
                    <span className="text-text-dark">₹{(shipping / 100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">GST (5%)</span>
                    <span className="text-text-dark">₹{(tax / 100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-[#eae6de] pt-3 flex justify-between font-bold">
                    <span className="text-text-dark">Total</span>
                    <span className="text-brand-green text-lg">₹{(total / 100).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button onClick={() => router.push('/marketplace/checkout')} className="btn-primary w-full justify-center py-3.5 mt-6">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <Link href="/marketplace" className="btn-secondary w-full justify-center py-3 mt-3 text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
