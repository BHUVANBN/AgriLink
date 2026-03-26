'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { TrendingUp, Package, ShoppingCart, AlertTriangle, BarChart3 } from 'lucide-react';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function SupplierAnalyticsPage() {
  const { data: analytics, isLoading } = useSWR(`${API}/supplier/analytics/summary`, fetcher);

  const revenueRs = analytics ? (analytics.thirtyDayRevenuePaise / 100).toLocaleString('en-IN') : '—';
  const daily: any[] = analytics?.dailyAnalytics ?? [];
  const maxRevenue = daily.reduce((m, d) => Math.max(m, d.revenuePaise), 1);

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Analytics" />
      <main className="lg:ml-72 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h2 className="text-text-dark font-serif font-bold">Business Analytics</h2>
              <p className="text-text-muted text-sm mt-1">Last 30 days performance overview</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)
              ) : (
                <>
                  <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-600/10 rounded-full -translate-y-4 translate-x-4 blur-xl" />
                    <div className="relative">
                      <p className="text-text-muted text-xs uppercase tracking-wider mb-2">30-Day Revenue</p>
                      <p className="text-text-dark font-serif font-bold">₹{revenueRs}</p>
                      <TrendingUp className="w-4 h-4 text-green-400 mt-2" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/10 rounded-full -translate-y-4 translate-x-4 blur-xl" />
                    <div className="relative">
                      <p className="text-text-muted text-xs uppercase tracking-wider mb-2">30-Day Orders</p>
                      <p className="text-text-dark font-serif font-bold">{analytics?.thirtyDayOrders ?? 0}</p>
                      <ShoppingCart className="w-4 h-4 text-blue-400 mt-2" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-600/10 rounded-full -translate-y-4 translate-x-4 blur-xl" />
                    <div className="relative">
                      <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Active Products</p>
                      <p className="text-text-dark font-serif font-bold">{analytics?.activeProductCount ?? 0}</p>
                      <Package className="w-4 h-4 text-purple-400 mt-2" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm">
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-${analytics?.lowStockProductCount > 0 ? 'amber' : 'green'}-600/10 rounded-full -translate-y-4 translate-x-4 blur-xl`} />
                    <div className="relative">
                      <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Low Stock Items</p>
                      <p className={`text-text-dark font-serif font-bold`}>
                        {analytics?.lowStockProductCount ?? 0}
                      </p>
                      <AlertTriangle className={`w-4 h-4 mt-2 ${analytics?.lowStockProductCount > 0 ? 'text-amber-400' : 'text-green-400'}`} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Revenue Chart (bar chart using CSS) */}
            <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="section-title">Daily Revenue — Last 30 Days</h3>
                <BarChart3 className="w-5 h-5 text-slate-500" />
              </div>
              {isLoading ? (
                <div className="h-48 skeleton rounded-xl" />
              ) : daily.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-text-muted">No data yet — analytics appear as you receive orders</p>
                </div>
              ) : (
                <div className="flex items-end gap-1 h-48">
                  {daily.slice().reverse().slice(0, 30).map((d: any, i: number) => {
                    const heightPct = maxRevenue > 0 ? (d.revenuePaise / maxRevenue) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`₹${(d.revenuePaise / 100).toLocaleString('en-IN')} on ${new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}>
                        <div className="relative w-full">
                          <div
                            className="w-full bg-green-500/40 hover:bg-green-500/70 rounded-sm transition-all"
                            style={{ height: `${Math.max(heightPct, 2)}%`, minHeight: 4 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex justify-between mt-2 text-xs text-slate-600">
                <span>30 days ago</span><span>Today</span>
              </div>
            </div>
          </motion.div>
      </main>
    </div>
  );
}
