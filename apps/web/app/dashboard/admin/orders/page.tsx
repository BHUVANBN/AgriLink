'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { ShoppingBag, Clock, Truck, CheckCircle, XCircle, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Users, BarChart3, LogOut, Leaf } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function AdminLayout({ children, pageTitle }: { children: React.ReactNode; pageTitle: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const NAV = [
    { icon: BarChart3,   label: 'Overview',  href: '/dashboard/admin' },
    { icon: Shield,      label: 'KYC Queue', href: '/dashboard/admin/kyc' },
    { icon: Users,       label: 'User Mgmt', href: '/dashboard/admin/users' },
    { icon: ShoppingBag, label: 'Orders',    href: '/dashboard/admin/orders' },
  ];

  async function logout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    router.push('/auth/login');
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#0d1526]/95 backdrop-blur border-r border-white/8 hidden lg:flex">
        <div className="p-6 border-b border-white/8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">AgriLink</span>
            <span className="badge-red text-[10px] ml-1">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link ${pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href)) ? 'active' : ''}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/8">
          <button onClick={logout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <header className="lg:ml-64 h-16 flex items-center gap-4 px-6 border-b border-white/8 bg-[#0d1526]/80 backdrop-blur sticky top-0 z-30 w-full">
        <h1 className="text-white font-bold flex-1">{pageTitle}</h1>
      </header>
      <main className="flex-1 lg:ml-64 pt-16">{children}</main>
    </div>
  );
}

const STATUS_CFG: Record<string, { label: string; cls: string; icon: any }> = {
  PLACED:    { label: 'Placed',     cls: 'badge-blue',   icon: Clock },
  CONFIRMED: { label: 'Confirmed',  cls: 'badge-blue',   icon: CheckCircle },
  SHIPPED:   { label: 'Shipped',    cls: 'badge-slate',  icon: Truck },
  DELIVERED: { label: 'Delivered',  cls: 'badge-green',  icon: CheckCircle },
  CANCELLED: { label: 'Cancelled',  cls: 'badge-red',    icon: XCircle },
  RETURNED:  { label: 'Returned',   cls: 'badge-red',    icon: XCircle },
};

export default function AdminOrdersPage() {
  const { isLoading: authLoading } = useRequireAuth('admin');
  const { data: orders, isLoading } = useSWR(`${API}/marketplace/orders`, fetcher);
  const orderList: any[] = orders ?? [];

  if (authLoading) return <div className="min-h-screen bg-[#0a0f1e]" />;

  const stats = [
    { label: 'Total Orders',     value: orderList.length,                                          color: 'blue',  icon: ShoppingBag   },
    { label: 'Placed (New)',      value: orderList.filter(o => o.orderStatus === 'PLACED').length,  color: 'amber', icon: Clock         },
    { label: 'Shipped',           value: orderList.filter(o => o.orderStatus === 'SHIPPED').length, color: 'blue',  icon: Truck         },
    { label: 'Delivered',         value: orderList.filter(o => o.orderStatus === 'DELIVERED').length, color: 'green', icon: TrendingUp  },
  ];

  return (
    <AdminLayout pageTitle="All Orders">
      <div className="p-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white">Platform Orders</h2>
            <p className="text-slate-400 text-sm mt-1">View all marketplace orders across the platform</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="stat-card">
                <div className={`absolute top-0 right-0 w-16 h-16 bg-${s.color}-600/10 rounded-full -translate-y-4 translate-x-4 blur-xl`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{s.label}</p>
                    <p className="text-3xl font-black text-white">{s.value}</p>
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
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
            </div>
          ) : orderList.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No orders yet on the platform</p>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/3">
                      <th className="text-left text-slate-400 py-4 px-5 font-medium">Order #</th>
                      <th className="text-left text-slate-400 py-4 px-5 font-medium">Date</th>
                      <th className="text-left text-slate-400 py-4 px-5 font-medium">Farmer ID</th>
                      <th className="text-left text-slate-400 py-4 px-5 font-medium">Items</th>
                      <th className="text-right text-slate-400 py-4 px-5 font-medium">Amount</th>
                      <th className="text-left text-slate-400 py-4 px-5 font-medium">Payment</th>
                      <th className="text-left text-slate-400 py-4 px-5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.map((order: any, i: number) => {
                      const cfg = STATUS_CFG[order.orderStatus] ?? STATUS_CFG.PLACED;
                      const StatusIcon = cfg.icon;
                      const items: any[] = order.items ?? [];
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                          className="border-b border-white/5 hover:bg-white/3 transition-colors"
                        >
                          <td className="py-4 px-5 text-green-400 font-mono font-medium">#{order.orderNumber}</td>
                          <td className="py-4 px-5 text-slate-400 text-xs">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-5 text-slate-400 text-xs font-mono">{order.farmerId?.slice(0, 12)}...</td>
                          <td className="py-4 px-5 text-slate-300 text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</td>
                          <td className="py-4 px-5 text-right text-white font-bold">
                            ₹{(order.totalPaise / 100).toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-5">
                            <span className={`text-xs font-medium ${order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-amber-400'}`}>
                              {order.paymentMethod} · {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className={`${cfg.cls} text-xs flex items-center gap-1 w-fit`}>
                              <StatusIcon className="w-3 h-3" /> {cfg.label}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
