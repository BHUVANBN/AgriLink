'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  User, 
  AlertTriangle, 
  FileCheck,
  X,
  ArrowRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function DecideModal({ user, onDecide, onClose }: { user: any; onDecide: (id: string, decision: string, reason?: string) => void; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const confidence = Math.round((user.nameMatchConfidence ?? 0) * 100);
  const matchStatus = user.nameMatchStatus ?? 'pending';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-[#0d1526] rounded-3xl border border-white/10 shadow-2xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-black text-white">KYC Final Decision</h3>
           </div>
           <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gradient-red flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {(user.fullName ?? user.email)?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold">{user.fullName || 'Unnamed User'}</p>
              <p className="text-slate-500 text-xs italic">{user.email} • {user.role?.toUpperCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className={`p-5 rounded-2xl border ${matchStatus === 'matched' ? 'border-green-500/20 bg-green-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">OCR Match Score</p>
                <p className={`text-2xl font-black ${matchStatus === 'matched' ? 'text-green-400' : 'text-amber-400'}`}>{confidence}%</p>
                <p className="text-[10px] text-slate-500 mt-1 italic">V3 AI Similarity Engine</p>
             </div>
             <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Document Count</p>
                <p className="text-2xl font-black text-white">2 <span className="text-xs font-normal text-slate-500">Files</span></p>
                <p className="text-[10px] text-slate-500 mt-1 italic">Aadhaar + RTC / License</p>
             </div>
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Moderation Note (Internal)</label>
             <textarea 
               value={reason}
               onChange={e => setReason(e.target.value)}
               className="input-field h-24 text-sm" 
               placeholder="Why are you approving/rejecting this user? (Visible to staff only)" 
             />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
             <button 
               onClick={() => onDecide(user.id, 'rejected', reason)} 
               className="flex-1 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-sm hover:bg-red-500/20 transition-all active:scale-95"
             >
                REJECT USER
             </button>
             <button 
               onClick={() => onDecide(user.id, 'approved', reason)} 
               className="flex-1 py-4 rounded-2xl bg-green-500 border border-green-600 text-white font-black text-sm shadow-xl shadow-green-900/40 hover:brightness-110 transition-all active:scale-95"
             >
                APPROVE ACCESS
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function KYCReviewQueue() {
  useRequireAuth('admin');
  const { data: queue, mutate, isLoading } = useSWR(`${API}/auth/admin/kyc-queue`, fetcher);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [decidingUser, setDecidingUser] = useState<any>(null);

  async function handleDecision(userId: string, decision: string, reason?: string) {
    try {
      const res = await fetch(`${API}/auth/admin/kyc/${userId}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ decision, reason })
      });
      if (!res.ok) throw new Error('API decision failed');
      toast.success(`User ${decision} successfully`);
      mutate();
      setDecidingUser(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const pending = queue?.users || [];

  return (
    <AdminLayout pageTitle="KYC Access Verification">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        
        <div className="flex items-center justify-between mb-10">
           <div>
              <h2 className="text-2xl font-black text-white">Review Queue 📁</h2>
              <p className="text-slate-500 text-sm mt-1 italic">Background check & Identity verification for new participants</p>
           </div>
           <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/8">
              <span className="badge-red text-[10px] font-black">{pending.length} STALE</span>
              <span className="text-[10px] text-slate-500 uppercase font-black px-2 border-l border-white/10">Average Latency: 14m</span>
           </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 skeleton rounded-3xl" />)}
          </div>
        ) : pending.length === 0 ? (
          <div className="glass-card p-24 text-center border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
             <CheckCircle className="w-16 h-16 text-slate-700 mx-auto mb-6" />
             <h3 className="text-white font-black text-xl">Queue is Empty</h3>
             <p className="text-slate-500 text-sm mt-2 font-medium italic">No pending identity checks at the moment. All set!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.map((user: any) => (
              <motion.div 
                key={user.id} 
                className="stat-card p-0 overflow-hidden flex flex-col group hover:border-red-500/30 transition-all"
                layoutId={user.id}
              >
                <div className="p-6 border-b border-white/5">
                   <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white font-bold text-lg group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                         {(user.fullName ?? user.email)?.[0]?.toUpperCase()}
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-white/5 border border-white/10 ${user.role === 'farmer' ? 'text-green-400' : 'text-blue-400'}`}>
                         {user.role}
                      </span>
                   </div>
                   <div className="mt-4">
                      <p className="text-white font-black text-lg truncate">{user.fullName || 'Profile Incomplete'}</p>
                      <p className="text-slate-500 text-[10px] truncate max-w-[200px] mb-4 uppercase tracking-tighter">{user.email}</p>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                         <ShieldAlert className={`w-3.5 h-3.5 ${user.nameMatchStatus === 'matched' ? 'text-green-500' : 'text-amber-500'}`} />
                         <span className="text-[10px] text-slate-400 font-black">AI SIMILARITY: {Math.round((user.nameMatchConfidence || 0)*100)}%</span>
                      </div>
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                   </div>
                </div>

                <div className="p-4 bg-white/[0.02] flex gap-2">
                   <button 
                     onClick={() => setSelectedUser(user)}
                     className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                   >
                      <Eye className="w-3 h-3" /> View Artifacts
                   </button>
                   <button 
                     onClick={() => setDecidingUser(user)}
                     className="px-4 py-3 rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center"
                   >
                      <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Artifact Viewer Modal */}
      <AnimatePresence>
         {selectedUser && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
              <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-white italic">Artifact Inspector // {selectedUser.fullName || selectedUser.email}</h3>
                    <button onClick={() => setSelectedUser(null)} className="p-3 bg-white/5 rounded-full hover:bg-red-500 text-white transition-all">
                       <X className="w-6 h-6" />
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                    <div className="space-y-4">
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-white/10 pb-2">Primary ID (Aadhaar/PAN)</p>
                       <div className="aspect-[3/4] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                          {selectedUser.aadhaarUrl ? (
                             <img src={selectedUser.aadhaarUrl} alt="Aadhaar" className="w-full h-full object-contain" />
                          ) : <p className="text-slate-600 text-sm">No Primary ID Uploaded</p>}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-white/10 pb-2">Secondary Proof (RTC/License)</p>
                       <div className="aspect-[3/4] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                          {selectedUser.rtcUrl ? (
                             <img src={selectedUser.rtcUrl} alt="RTC" className="w-full h-full object-contain" />
                          ) : <p className="text-slate-600 text-sm">No secondary proof uploaded</p>}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {decidingUser && (
           <DecideModal 
             user={decidingUser} 
             onClose={() => setDecidingUser(null)} 
             onDecide={handleDecision} 
           />
         )}
      </AnimatePresence>

    </AdminLayout>
  );
}
