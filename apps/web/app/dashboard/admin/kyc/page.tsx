'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye,
  Filter,
  ArrowRight,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function KycQueuePage() {
  const { data: queue, mutate, isLoading } = useSWR(`${API}/auth/admin/kyc-queue`, fetcher);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deciding, setDeciding] = useState(false);
  const [reason, setReason] = useState('');

  const handleDecision = async (decision: 'approved' | 'rejected') => {
    if (!selectedUser) return;
    setDeciding(true);
    try {
      const res = await fetch(`${API}/auth/admin/kyc/${selectedUser.id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ decision, reason }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`KYC ${decision} for ${selectedUser.fullName || selectedUser.email}`);
        mutate();
        setSelectedUser(null);
        setReason('');
      } else {
        toast.error(data.error || 'Failed to process decision');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setDeciding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
         <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or company..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-slate-900/5 focus:bg-white outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
               <Filter className="w-4 h-4" /> Filter
            </button>
            <div className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10">
               Queue Size: {queue?.total || 0}
            </div>
         </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Applicant</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sector</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Submission Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Docs</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-8 py-6 h-20 bg-slate-50/20" />
                </tr>
              ))
            ) : queue?.users?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                      <ShieldCheck className="w-8 h-8" />
                   </div>
                   <p className="text-sm font-black text-slate-400 uppercase tracking-widest">KYC Queue is Empty</p>
                </td>
              </tr>
            ) : (
              queue.users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xs">
                          {user.fullName?.[0] || user.email[0].toUpperCase()}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">{user.fullName || 'Unnamed Applicant'}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-brand-orange/10 text-brand-orange'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                       <Clock className="w-3.5 h-3.5" />
                       {new Date(user.kycSubmittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors text-[10px] font-black uppercase tracking-widest">
                       <Eye className="w-4 h-4" /> View Docs
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl z-[101] overflow-hidden border border-slate-200"
            >
              <div className="p-12">
                 <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black">
                          {selectedUser.fullName?.[0] || 'U'}
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                             <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedUser.fullName || 'Unnamed'}</h2>
                             <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">{selectedUser.role}</span>
                          </div>
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{selectedUser.email} • {selectedUser.phone || 'No Phone'}</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                       <XCircle className="w-6 h-6" />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-6">
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Identity Verification</h3>
                       <div className="aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden relative group border border-slate-200">
                          <img 
                            src="https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800" 
                            alt="Document Placeholder" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                             <button className="px-6 py-3 bg-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> Full View
                             </button>
                          </div>
                          <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                             Aadhaar Front
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Asset / Business Verification</h3>
                       <div className="aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden relative group border border-slate-200">
                          <img 
                            src="https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=800" 
                            alt="Document Placeholder" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                             <button className="px-6 py-3 bg-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> Full View
                             </button>
                          </div>
                          <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                             {selectedUser.role === 'farmer' ? 'RTC / Land Record' : 'GST / Trade License'}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 mb-10">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrative Note / Rejection Reason</label>
                    <textarea 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter details for approval or reason for rejection (this will be sent to the user)..."
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:ring-2 focus:ring-slate-900/5 focus:bg-white outline-none transition-all min-h-[120px]"
                    />
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-50">
                    <button 
                      onClick={() => handleDecision('rejected')}
                      disabled={deciding}
                      className="flex-1 py-6 rounded-2xl bg-white border-2 border-red-100 text-red-500 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </button>
                    <button 
                      onClick={() => handleDecision('approved')}
                      disabled={deciding}
                      className="flex-1 py-6 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {deciding ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          Approve KYC
                        </>
                      )}
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
