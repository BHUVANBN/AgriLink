'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  ArrowLeft, 
  History, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  Hash, 
  Clock,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function InventoryLogsPage() {
  const { data: logs, isLoading } = useSWR(`${API}/supplier/inventory/logs`, fetcher);

  const logList: any[] = logs ?? [];

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Audit Matrix" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Nav */}
          <Link href="/dashboard/supplier/products" className="inline-flex items-center gap-2 text-text-muted hover:text-text-dark text-[10px] font-black uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Inventory
          </Link>

          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tighter">Inventory Audit Logs</h2>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mt-1 italic italic">Every asset fluctuation recorded on the ledger</p>
            </div>
            <div className="flex items-center gap-3">
               <button className="p-3 bg-white border border-[#eae6de] rounded-xl text-text-muted hover:text-text-dark shadow-sm">
                  <Filter className="w-4 h-4" />
               </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 bg-white border border-[#eae6de] rounded-2xl animate-pulse" />)}
            </div>
          ) : logList.length === 0 ? (
            <div className="bg-white border border-[#eae6de] rounded-[2rem] p-24 text-center">
               <History className="w-12 h-12 text-slate-200 mx-auto mb-6" />
               <h3 className="text-text-dark font-black text-lg uppercase italic">No Logs Found</h3>
               <p className="text-text-muted text-xs mt-2 italic">Activity history will appear as soon as stock is adjusted</p>
            </div>
          ) : (
            <div className="bg-white border border-[#eae6de] rounded-[2rem] overflow-hidden shadow-soft">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f8f7f4]">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted italic">Timestamp</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted italic">Asset / SKU</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted italic">Delta</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted italic">Final Stock</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted italic">Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8f7f4]">
                  {logList.map((log, i) => {
                    const isPositive = log.change > 0;
                    return (
                      <motion.tr 
                        key={log.id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-[#f8f7f4]/50 transition-colors"
                      >
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <Clock className="w-3.5 h-3.5 text-slate-300" />
                              <span className="text-[11px] font-bold text-text-dark">
                                {new Date(log.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-xs font-black text-text-dark uppercase tracking-tight">{log.product?.name}</p>
                           <p className="text-[9px] font-bold text-text-muted tracking-widest">{log.product?.sku}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {isPositive ? '+' : ''}{log.change}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <Package className="w-3.5 h-3.5 text-slate-300" />
                              <span className="text-xs font-black text-text-dark italic">{log.newStock}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-text-dark">{log.reason}</span>
                              {log.notes && <span className="text-[9px] font-medium text-text-muted italic truncate max-w-[200px]">{log.notes}</span>}
                           </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
