'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { ShoppingCart, Package, Clock, Truck, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const STATUS_CFG: Record<string, { label: string; cls: string; icon: any }> = {
  PLACED:    { label: 'New',       cls: 'badge-blue',   icon: Clock },
  CONFIRMED: { label: 'Confirmed', cls: 'badge-blue',   icon: CheckCircle },
  SHIPPED:   { label: 'Shipped',   cls: 'badge-slate',  icon: Truck },
  DELIVERED: { label: 'Delivered', cls: 'badge-green',  icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', cls: 'badge-red',    icon: XCircle },
};

const NEXT_STATUS: Record<string, string> = {
  PLACED: 'CONFIRMED', CONFIRMED: 'SHIPPED', SHIPPED: 'DELIVERED',
};

export default function SupplierOrdersPage() {
  const { data: orders, isLoading, mutate } = useSWR(`${API}/marketplace/orders`, fetcher);

  const orderList: any[] = orders ?? [];

  async function updateStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`${API}/marketplace/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      mutate();
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
    } catch { toast.error('Failed to update order'); }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Orders" />
      <main className="lg:ml-72 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h2 className="text-text-dark font-serif font-bold">Orders</h2>
              <p className="text-text-muted text-sm mt-1">Manage incoming customer orders</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Orders', value: orderList.length, color: 'blue', icon: ShoppingCart },
                { label: 'New / Placed', value: orderList.filter(o => o.orderStatus === 'PLACED').length, color: 'amber', icon: Clock },
                { label: 'Confirmed', value: orderList.filter(o => o.orderStatus === 'CONFIRMED').length, color: 'blue', icon: CheckCircle },
                { label: 'Delivered', value: orderList.filter(o => o.orderStatus === 'DELIVERED').length, color: 'green', icon: TrendingUp },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-[#eae6de] shadow-sm">
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-${s.color}-600/10 rounded-full -translate-y-4 translate-x-4 blur-xl`} />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{s.label}</p>
                      <p className="text-3xl font-bold text-text-dark font-serif">{s.value}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl bg-${s.color}-600/20 flex items-center justify-center`}>
                      <s.icon className={`w-4 h-4 text-${s.color}-400`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 skeleton rounded-2xl" />)}
              </div>
            ) : orderList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-16 text-center">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-text-muted font-medium">No orders yet</p>
                <p className="text-slate-600 text-sm mt-1">Orders from customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orderList.map((order: any, i: number) => {
                  const cfg = STATUS_CFG[order.orderStatus] ?? STATUS_CFG.PLACED;
                  const StatusIcon = cfg.icon;
                  const items: any[] = order.items ?? [];
                  const nextStatus = NEXT_STATUS[order.orderStatus];
                  const addr = order.shippingAddress ?? {};

                  return (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <p className="text-text-dark font-bold">Order #{order.orderNumber}</p>
                            <p className="text-text-muted text-xs mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${cfg.cls} text-xs flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" /> {cfg.label}
                            </span>
                            <span className="text-text-dark font-serif font-bold">₹{(order.totalPaise / 100).toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Items</p>
                            <div className="space-y-1">
                              {items.map((item: any, j: number) => (
                                <p key={j} className="text-slate-300 text-xs">{item.name} × {item.quantity}</p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Deliver To</p>
                            <p className="text-text-muted text-xs font-medium">{addr.name}</p>
                            <p className="text-text-muted text-xs">{[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
                            <p className="text-text-muted text-xs">{addr.phone}</p>
                          </div>
                        </div>

                        {nextStatus && order.orderStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => updateStatus(order.id, nextStatus)}
                            className="btn-primary text-sm py-2"
                          >
                            Mark as {nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
      </main>
    </div>
  );
}
