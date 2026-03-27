'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  BarChart3,
  ArrowUpRight,
  Target,
  Activity,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function PremiumStatCard({ label, value, icon: Icon, color, subtext }: any) {
  const colorMap: any = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-[#eae6de] shadow-soft relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#929285] mb-1 italic">{label}</p>
          <p className="text-3xl font-bold text-text-dark font-serif tracking-tighter">{value}</p>
        </div>
      </div>
      <p className="text-[10px] text-text-muted mt-4 font-medium italic opacity-70">{subtext}</p>
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#f8f7f4] rounded-full blur-3xl -translate-y-12 translate-x-12 opacity-50 transition-transform group-hover:scale-125" />
    </div>
  );
}

export default function SupplierAnalyticsPage() {
  const { data: analytics, isLoading } = useSWR(`${API}/supplier/stats`, fetcher); // Unified with main stats

  const daily: any[] = analytics?.dailyAnalytics?.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    revenue: d.revenuePaise / 100,
    orders: d.orderCount
  })).reverse() || [];

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Business Intelligence" />
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-5xl font-bold text-text-dark font-serif tracking-tighter">Market Intelligence</h2>
              <p className="text-brand-orange font-black text-[11px] mt-2 uppercase tracking-[0.25em] italic">Real-time performance distribution & asset velocity</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-[#eae6de] shadow-sm">
               <Calendar className="w-4 h-4 text-brand-green" />
               <span className="text-[11px] font-black uppercase tracking-widest text-text-dark">Fiscal Period: 30 Days</span>
            </div>
          </div>

          {/* Premium Stat Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <PremiumStatCard 
                 label="Total Realization" 
                 value={`₹${(analytics?.totalRevenue ?? 0).toLocaleString()}`} 
                 icon={TrendingUp} 
                 color="green" 
                 subtext="Verified credit in portfolio"
             />
             <PremiumStatCard 
                 label="Operational Ops" 
                 value={analytics?.totalOrders ?? 0} 
                 icon={ShoppingCart} 
                 color="blue" 
                 subtext="Successful trade executions"
             />
             <PremiumStatCard 
                 label="Asset Density" 
                 value={analytics?.activeProducts ?? 0} 
                 icon={Package} 
                 color="purple" 
                 subtext="Live listings in marketplace"
             />
             <PremiumStatCard 
                 label="Risk Alerts" 
                 value={analytics?.lowStockCount ?? 0} 
                 icon={AlertTriangle} 
                 color="amber" 
                 subtext="Assets requiring immediate attention"
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left: Revenue Velocity Chart */}
             <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-[#eae6de] shadow-soft relative overflow-hidden">
                <div className="flex items-center justify-between mb-10 relative z-10">
                   <div>
                      <h3 className="text-2xl font-bold text-text-dark font-serif tracking-tight">Revenue Velocity</h3>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Daily credit distribution across current vector</p>
                   </div>
                   <Activity className="w-5 h-5 text-brand-green opacity-30" />
                </div>

                <div className="h-[350px] w-full relative z-10">
                   {daily.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={daily}>
                            <defs>
                               <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#345243" stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor="#345243" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0efed" />
                            <XAxis 
                               dataKey="date" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fontSize: 10, fontWeight: 700, fill: '#929285' }} 
                               dy={15}
                            />
                            <YAxis 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fontSize: 10, fontWeight: 700, fill: '#929285' }} 
                            />
                            <Tooltip 
                               contentStyle={{ borderRadius: '24px', border: '1px solid #eae6de', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }}
                               cursor={{ stroke: '#345243', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />
                            <Area 
                               type="monotone" 
                               dataKey="revenue" 
                               stroke="#345243" 
                               strokeWidth={4} 
                               fillOpacity={1} 
                               fill="url(#colorRevenue)" 
                            />
                         </AreaChart>
                      </ResponsiveContainer>
                   ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f8f7f4]/50 rounded-[2rem] border-2 border-dashed border-[#eae6de]">
                         <BarChart3 className="w-12 h-12 text-slate-200 mb-4" />
                         <p className="text-[11px] font-black uppercase tracking-widest text-text-muted italic">Cumulative data pending...</p>
                      </div>
                   )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#f8f7f4] rounded-full blur-[100px] -translate-y-32 translate-x-32 opacity-30" />
             </div>

             {/* Right: Operational Health */}
             <div className="bg-white rounded-[2.5rem] p-10 border border-[#eae6de] shadow-soft">
                <div className="mb-10">
                   <h3 className="text-2xl font-bold text-text-dark font-serif tracking-tight">Trade Volume</h3>
                   <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Order capture frequency per cycle</p>
                </div>

                <div className="h-[350px] w-full">
                   {daily.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={daily}>
                            <XAxis 
                               dataKey="date" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fontSize: 9, fontWeight: 700, fill: '#929285' }} 
                               dy={10}
                            />
                            <Tooltip 
                               cursor={{ fill: '#f8f7f4', radius: 12 }}
                               contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '10px' }}
                            />
                            <Bar dataKey="orders" radius={[6, 6, 0, 0]} barSize={12}>
                               {daily.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#345243' : '#b66d3a'} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   ) : (
                      <div className="space-y-6">
                         {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex items-center gap-4">
                               <div className="w-8 h-8 rounded-lg bg-[#f8f7f4] animate-pulse" />
                               <div className="flex-1 h-2 bg-[#f8f7f4] rounded-full animate-pulse" />
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
