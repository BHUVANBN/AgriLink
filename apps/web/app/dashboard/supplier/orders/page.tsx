'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  MapPin,
  Phone,
  ArrowRight,
  Box,
  ClipboardList,
  Search,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.status === 'error' ? [] : d.data);

const STATUS_CFG: Record<string, { label: string; cls: string; icon: any }> = {
  PLACED:    { label: 'Awaiting Action',  cls: 'bg-[#dbeafe] text-[#1e40af] border-[#3b82f6]/20', icon: Clock },
  CONFIRMED: { label: 'Processing',      cls: 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/20', icon: ClipboardList },
  SHIPPED:   { label: 'In Transit',      cls: 'bg-[#ede9fe] text-[#5b21b6] border-[#7c3aed]/20', icon: Truck },
  DELIVERED: { label: 'Delivered ✓',      cls: 'bg-[#d1fae5] text-[#065f46] border-[#10b981]/20', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled',       cls: 'bg-[#fee2e2] text-[#991b1b] border-[#ef4444]/20', icon: XCircle },
};

const NEXT_STATUS: Record<string, string> = {
  PLACED: 'CONFIRMED', 
  CONFIRMED: 'SHIPPED', 
  SHIPPED: 'DELIVERED',
};

function StatBox({ label, value, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-[#eae6de] shadow-sm relative overflow-hidden group">
       <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClass}`}>
             <Icon className="w-5 h-5" />
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 italic">{label}</p>
             <p className="text-2xl font-bold text-text-dark font-serif tracking-tighter">{value}</p>
          </div>
       </div>
       <div className="absolute top-0 right-0 w-24 h-24 bg-[#f8f7f4] rounded-full blur-3xl -translate-y-12 translate-x-12 opacity-50 transition-transform group-hover:scale-110" />
    </div>
  );
}

export default function SupplierOrdersPage() {
  const [search, setSearch] = useState('');
  const { data: orders, isLoading, mutate } = useSWR(`${API}/supplier/orders`, fetcher);

  const orderList: any[] = Array.isArray(orders) ? orders : [];
  const filteredOrders = search ? orderList.filter(o => 
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase())
  ) : orderList;

  async function updateStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`${API}/supplier/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      mutate();
      toast.success(`Pipeline Advanced: ${newStatus.charAt(0) + newStatus.slice(1).toLowerCase()}`);
    } catch { toast.error('Failed to update operational status'); }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Order Pipeline" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tighter">Fulfillment Queue</h2>
              <p className="text-brand-orange font-black text-[10px] mt-2 uppercase tracking-[0.2em] italic">Real-time logistics management for agricultural assets</p>
            </div>
            
            <div className="bg-white p-2 rounded-2xl border border-[#eae6de] shadow-sm flex items-center min-w-[300px]">
               <div className="w-10 h-10 flex items-center justify-center text-text-muted">
                  <Search className="w-4 h-4" />
               </div>
               <input 
                 className="flex-1 bg-transparent border-none outline-none text-[11px] font-bold text-text-dark placeholder:text-slate-300"
                 placeholder="Vectoring by ID or Destination..."
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatBox label="Active Queue" value={orderList.length} icon={ShoppingCart} colorClass="bg-blue-50 text-blue-600" />
            <StatBox label="New Orders" value={orderList.filter(o => o.orderStatus === 'PLACED').length} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
            <StatBox label="In Transit" value={orderList.filter(o => o.orderStatus === 'SHIPPED').length} icon={Truck} colorClass="bg-purple-50 text-purple-600" />
            <StatBox label="Success Ops" value={orderList.filter(o => o.orderStatus === 'DELIVERED').length} icon={CheckCircle} colorClass="bg-emerald-50 text-emerald-600" />
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-44 bg-white border border-[#eae6de] rounded-[2.5rem] animate-pulse shadow-sm" />)}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft p-24 text-center">
              <div className="w-20 h-20 bg-[#f8f7f4] rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                 <Box className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-text-dark font-serif text-2xl font-bold tracking-tight mb-2">
                {search ? 'Zero Matches' : 'Operational Quiescence'}
              </h3>
              <p className="text-text-muted text-sm font-medium italic">
                {search ? 'Adjust your search parameters' : 'No pending farmer requirements detected in your sector'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order: any, i: number) => {
                const cfg = STATUS_CFG[order.orderStatus] ?? STATUS_CFG.PLACED;
                const StatusIcon = cfg.icon;
                const items: any[] = order.items ?? [];
                const nextStatus = NEXT_STATUS[order.orderStatus];
                const addr = order.shippingAddress ?? {};

                return (
                  <motion.div 
                    key={order.id} 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft p-1 transition-all hover:border-brand-green/20"
                  >
                    <div className="p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-10">
                       {/* Left: Order Info & Items */}
                       <div className="flex-1 space-y-6">
                          <div className="flex items-center justify-between lg:justify-start lg:gap-8 border-b border-[#f8f7f4] pb-6">
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#929285] mb-1 italic">V2 Protocol ID</p>
                                <p className="text-lg font-black text-text-dark uppercase italic">#{order.orderNumber || order.id.slice(0,8)}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#929285] mb-1 italic">Timestamp</p>
                                <p className="text-xs font-bold text-text-dark italic">
                                   {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </p>
                             </div>
                             <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${cfg.cls}`}>
                                <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
                             </div>
                          </div>

                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[#929285] mb-4 italic">Allocated Assets</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {items.map((item, j) => (
                                   <div key={j} className="bg-[#f8f7f4] p-3 rounded-xl flex items-center justify-between border border-[#eae6de]/50">
                                      <span className="text-[11px] font-bold text-text-dark">{item.name}</span>
                                      <span className="text-[10px] font-black text-brand-green">×{item.quantity || 1}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Right: Logistics & Action */}
                       <div className="lg:w-[320px] bg-[#f8f7f4] rounded-3xl p-6 border border-[#eae6de]/50 space-y-6">
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-4 border-b border-[#eae6de] pb-2">Logistics Destination</p>
                             <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                   <MapPin className="w-4 h-4 text-brand-orange mt-0.5" />
                                   <div>
                                      <p className="text-[11px] font-black text-text-dark uppercase leading-tight">{addr.name || 'Anonymous Farmer'}</p>
                                      <p className="text-[10px] font-medium text-text-muted mt-1 leading-relaxed">
                                         {[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
                                      </p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3">
                                   <Phone className="w-4 h-4 text-brand-green" />
                                   <p className="text-[11px] font-bold text-text-dark">{addr.phone || 'No direct dial'}</p>
                                </div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3 pt-4 border-t border-[#eae6de]">
                                 <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Net Realization</p>
                                    <p className="text-xl font-black text-text-dark font-serif italic">₹{(order.totalPaise / 100).toLocaleString('en-IN')}</p>
                                 </div>

                                 <button 
                                   onClick={() => window.print()} 
                                   className="w-full py-4 bg-white border border-[#eae6de] text-text-muted hover:text-text-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#f8f7f4] transition-all flex items-center justify-center gap-2 group"
                                 >
                                    <FileText className="w-4 h-4 text-brand-orange group-hover:scale-110" /> Document Ingestion (Invoice)
                                 </button>

                                 {nextStatus && order.orderStatus !== 'CANCELLED' ? (
                                    <button
                                      onClick={() => updateStatus(order.id, nextStatus)}
                                      className="w-full py-4 bg-brand-green text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green-hover transition-all flex items-center justify-center gap-2 group shadow-xl shadow-brand-green/20"
                                    >
                                       Advance Pipeline to <span className="underline decoration-2 underline-offset-4">{nextStatus.toLowerCase()}</span>
                                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                 ) : (
                                    <div className="w-full py-4 bg-white border border-[#eae6de] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#929285] flex items-center justify-center opacity-60">
                                       Full Lifecycle Complete
                                    </div>
                                 )}
                              </div>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
