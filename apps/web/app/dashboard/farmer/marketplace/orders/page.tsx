'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Package, Truck, Calendar, CreditCard, ChevronRight, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/marketplace/orders`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLACED': return <Clock className="w-4 h-4 text-brand-orange" />;
      case 'CONFIRMED': return <CheckCircle2 className="w-4 h-4 text-brand-green" />;
      case 'SHIPPED': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-brand-green" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) return null;

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
            <h3 className="text-lg font-serif font-bold text-brand-green">Payment Successful!</h3>
            <p className="text-sm text-brand-green/80">Your order has been placed successfully and the supplier has been notified.</p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-text-dark">Order History</h1>
      </div>

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
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-[2rem] border border-[#eae6de] overflow-hidden hover:border-brand-green/30 transition-all group"
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1 space-y-4 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#f8f7f4] border border-[#eae6de] rounded-lg text-[10px] font-black uppercase tracking-widest text-text-muted">
                      {order.orderNumber}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      order.paymentStatus === 'PAID' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange'
                    }`}>
                      <CreditCard className="w-3 h-3" /> {order.paymentStatus}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-text-dark truncate">
                    {order.items[0].snapshot.name} {order.items.length > 1 ? `+ ${order.items.length - 1} more items` : ''}
                  </h3>

                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-green">
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 w-full md:w-auto">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Amount</p>
                   <p className="text-2xl font-bold text-text-dark mb-4">₹{order.totalPaise / 100}</p>
                   <button className="px-6 py-3 bg-[#f8f7f4] border border-[#eae6de] rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dark hover:bg-brand-green hover:text-white hover:border-brand-green transition-all flex items-center gap-2 mx-auto md:ml-auto">
                     View Details <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
