'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  History, 
  Search, 
  Terminal, 
  User, 
  Clock, 
  Database, 
  Info,
  ShieldCheck,
  Ban,
  UserCheck,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const ACTION_ICONS: Record<string, any> = {
  KYC_APPROVE: { icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
  KYC_REJECT: { icon: Ban, color: 'text-red-500', bg: 'bg-red-50' },
  USER_SUSPEND: { icon: Ban, color: 'text-red-600', bg: 'bg-red-100' },
  USER_REACTIVATE: { icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
  CONFIG_UPDATE: { icon: Settings, color: 'text-amber-500', bg: 'bg-amber-50' },
};

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSWR(`${API}/auth/admin/audit?page=${page}&limit=20`, fetcher);

  return (
    <div className="space-y-8">
      {/* Logs Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                 <History className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Immutable Audit Log</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tracking {data?.total || 0} Platform Operations</p>
              </div>
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search by Actor ID..." 
                className="pl-10 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
              />
           </div>
        </div>

        <div className="divide-y divide-slate-50">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-8 h-24 animate-pulse bg-slate-50/20" />
            ))
          ) : data?.items?.length === 0 ? (
            <div className="p-32 text-center">
               <Terminal className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No audit trails recorded yet</p>
            </div>
          ) : (
            data.items.map((log: any) => {
              const Action = ACTION_ICONS[log.action] || { icon: Info, color: 'text-slate-400', bg: 'bg-slate-50' };
              return (
                <motion.div 
                  key={log.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="p-8 flex flex-col lg:flex-row lg:items-center gap-8 group hover:bg-slate-50/50 transition-all"
                >
                  <div className="lg:w-64 shrink-0 flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl ${Action.bg} flex items-center justify-center ${Action.color}`}>
                        <Action.icon className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-0.5">{log.action.replace(/_/g, ' ')}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Ref: {log.id.slice(0, 8)}</p>
                     </div>
                  </div>

                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                           <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Actor ID</p>
                           <p className="text-xs font-bold text-slate-900 truncate">{log.actorId}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                           <Database className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Target / Payload</p>
                           <p className="text-xs font-bold text-slate-900 truncate">{log.targetId || 'N/A'}</p>
                        </div>
                     </div>
                  </div>

                  <div className="lg:w-48 shrink-0 flex items-center justify-between">
                     <div className="flex items-center gap-3 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">{new Date(log.createdAt).toLocaleString()}</span>
                     </div>
                     <button className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-slate-900 transition-all">
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="p-8 border-t border-slate-50 flex justify-center gap-2">
             {Array.from({ length: data.pages }).map((_, i) => (
               <button 
                 key={i}
                 onClick={() => setPage(i + 1)}
                 className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                   page === i + 1 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
                 }`}
               >
                 {i + 1}
               </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
