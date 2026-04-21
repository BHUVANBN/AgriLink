'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Package, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart, updateCartItem, removeFromCart, CartItem } from '@/lib/marketplace/cart';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
      await updateCartItem(id, newQty);
    } catch (err) {
      fetchCart(); // rollback
    }
  };

  const handleRemove = async (id: string) => {
    try {
      setItems(prev => prev.filter(item => item.id !== id));
      await removeFromCart(id);
    } catch (err) {
      fetchCart(); // rollback
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.snapshot.price * item.quantity), 0);
  const shipping = items.length > 0 ? 5000 : 0; // ₹50.00 flat for demo
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-text-dark">Shopping Cart</h1>
        <p className="text-sm font-black uppercase tracking-widest text-text-muted">{items.length} Items</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-[#eae6de] border-dashed p-20 text-center">
          <div className="w-24 h-24 bg-[#f8f7f4] rounded-full flex items-center justify-center mx-auto mb-8 text-text-muted">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-text-dark mb-4">Your cart is empty</h2>
          <p className="text-text-muted mb-8 max-w-xs mx-auto">Looks like you haven't added any products to your cart yet.</p>
          <Link
            href="/dashboard/farmer/marketplace"
            className="inline-flex items-center gap-3 px-8 py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-green/20 hover:bg-brand-orange transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-[#eae6de] p-4 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-black/5 transition-all group"
                >
                  <div className="w-32 h-32 relative bg-[#f8f7f4] rounded-2xl overflow-hidden shrink-0">
                    {item.snapshot.images?.[0] ? (
                      <Image src={item.snapshot.images[0]} alt={item.snapshot.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-text-dark">{item.snapshot.name}</h4>
                        <p className="text-[10px] font-black text-brand-green uppercase tracking-widest">{item.snapshot.category}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-[#f8f7f4] rounded-xl p-1 border border-[#eae6de]">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-text-dark transition-all disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-text-dark transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Subtotal</p>
                        <p className="text-lg font-bold text-text-dark">₹{(item.snapshot.price * item.quantity) / 100}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              href="/dashboard/farmer/marketplace"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-brand-green transition-colors py-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Catalog
            </Link>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-[2.5rem] border border-[#eae6de] p-8 sticky top-24 shadow-2xl shadow-black/5">
              <h3 className="text-xl font-serif font-bold text-text-dark mb-8">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-bold uppercase tracking-wider text-[10px]">Subtotal</span>
                  <span className="text-text-dark font-bold">₹{subtotal / 100}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-bold uppercase tracking-wider text-[10px]">Shipping</span>
                  <span className="text-text-dark font-bold">₹{shipping / 100}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-bold uppercase tracking-wider text-[10px]">Taxes (GST 18%)</span>
                  <span className="text-text-dark font-bold">Included</span>
                </div>
                <div className="pt-4 border-t border-[#f8f7f4] flex justify-between items-center">
                  <span className="text-text-dark font-serif font-bold text-lg">Total Amount</span>
                  <span className="text-brand-green font-bold text-2xl">₹{total / 100}</span>
                </div>
              </div>

              <Link
                href="/dashboard/farmer/marketplace/checkout"
                className="w-full py-5 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-brand-green/20 hover:bg-brand-orange transition-all flex items-center justify-center gap-3 group"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-8 flex items-center gap-3 p-4 bg-[#f8f7f4] rounded-2xl border border-[#eae6de]">
                <ShieldCheck className="w-10 h-10 text-brand-green" />
                <div>
                  <p className="text-[10px] font-black text-text-dark uppercase tracking-widest mb-0.5">Secure Checkout</p>
                  <p className="text-[10px] text-text-muted leading-relaxed">Protected by Razorpay 256-bit SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
