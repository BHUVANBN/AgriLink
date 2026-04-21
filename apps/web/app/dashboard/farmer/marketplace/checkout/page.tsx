'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, Phone, User, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCart, CartItem } from '@/lib/marketplace/cart';
import { loadRazorpay } from '@/lib/marketplace/razorpay';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setItems(data);
      if (data.length === 0) router.push('/dashboard/farmer/marketplace/cart');
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.snapshot.price * item.quantity), 0);
  const shipping = items.length > 0 ? 5000 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Create Order in our backend
      const orderRes = await fetch(`${API_URL}/marketplace/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items,
          shippingAddress: address,
          paymentMethod: 'RAZORPAY',
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error('Order creation failed');

      // We handle the first order for the payment demo
      const order = orderData.data.orders[0];

      // 2. Load Razorpay
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error('Razorpay SDK failed to load');

      // 3. Create Razorpay Order
      const paymentRes = await fetch(`${API_URL}/marketplace/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: order.id,
          totalPaise: order.totalPaise,
          farmerId: order.farmerId,
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentData.success) throw new Error('Payment initialization failed');

      const { razorpayOrderId, keyId } = paymentData.data;

      // 4. Open Razorpay Modal
      const options = {
        key: keyId,
        amount: order.totalPaise,
        currency: 'INR',
        name: 'AgriLink Marketplace',
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          // 5. Verify Payment
          const verifyRes = await fetch(`${API_URL}/marketplace/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/dashboard/farmer/marketplace/orders?success=true&id=${order.id}`);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: {
          color: '#1f3b2c',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        href="/dashboard/farmer/marketplace/cart"
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-brand-green transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <form onSubmit={handleCheckout} className="space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-[#eae6de] p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold text-text-dark flex items-center gap-3">
              <MapPin className="w-6 h-6 text-brand-green" /> Shipping Details
            </h3>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={e => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-[#f8f7f4] border border-[#eae6de] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={e => setAddress({ ...address, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-[#f8f7f4] border border-[#eae6de] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                />
              </div>

              <input
                required
                type="text"
                placeholder="Street Address / Village"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
                className="w-full px-4 py-4 bg-[#f8f7f4] border border-[#eae6de] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={e => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-4 py-4 bg-[#f8f7f4] border border-[#eae6de] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                />
                <input
                  required
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={e => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full px-4 py-4 bg-[#f8f7f4] border border-[#eae6de] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-[#eae6de] p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold text-text-dark flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-brand-green" /> Payment Method
            </h3>
            <div className="p-4 border-2 border-brand-green bg-brand-green/5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white font-bold">
                  RP
                </div>
                <div>
                  <p className="text-sm font-bold text-text-dark">Razorpay Secure</p>
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Cards, UPI, Netbanking</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
            </div>
          </section>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-5 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-brand-green/20 hover:bg-brand-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {processing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Pay ₹{total / 100} Securely <ShieldCheck className="w-5 h-5" /></>
            )}
          </button>
        </form>

        {/* Order Review */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-[#eae6de] p-8 shadow-xl shadow-black/5">
            <h3 className="text-lg font-serif font-bold text-text-dark mb-6">Review Order</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-[#f8f7f4] transition-all">
                  <div className="w-16 h-16 bg-[#f8f7f4] rounded-xl overflow-hidden shrink-0 relative">
                    {item.snapshot.images?.[0] ? (
                      <Image src={item.snapshot.images[0]} alt={item.snapshot.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-300"><Package className="w-6 h-6" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-text-dark truncate">{item.snapshot.name}</h4>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-brand-green">₹{(item.snapshot.price * item.quantity) / 100}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#f8f7f4] space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-muted">
                <span>Subtotal</span>
                <span className="text-text-dark">₹{subtotal / 100}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-muted">
                <span>Shipping</span>
                <span className="text-text-dark">₹{shipping / 100}</span>
              </div>
              <div className="pt-4 border-t border-[#f8f7f4] flex justify-between items-center">
                <span className="font-serif font-bold text-text-dark text-lg">Total Amount</span>
                <span className="text-brand-green font-bold text-2xl">₹{total / 100}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
