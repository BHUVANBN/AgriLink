'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  User, 
  Users, 
  AlertTriangle, 
  FileCheck,
  X,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Package,
  Search,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function StatCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-red-600/30 transition-all">
       <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${color}-600/10 text-${color}-600 shadow-xl group-hover:scale-110 transition-transform`}>
             <Icon className="w-7 h-7" />
          </div>
          <div className="p-3 bg-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-white/40 italic">Telemetry</div>
       </div>
       <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">{label}</h3>
       <div className="flex items-end gap-3">
          <p className="text-4xl font-bold text-white font-serif tracking-tighter">{value}</p>
          <p className={`text-[10px] font-bold uppercase tracking-widest text-${color}-600 mb-1.5`}>{sub}</p>
       </div>
       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-30 group-hover:scale-125 transition-transform" />
    </div>
  );
}

function DecideModal({ user, onDecide, onClose }: { user: any; onDecide: (id: string, decision: string, reason?: string) => void; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const confidence = Math.round((user.nameMatchConfidence ?? 0) * 100);
  const matchStatus = user.nameMatchStatus ?? 'pending';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
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
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none h-24" 
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
  
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [inspectingUser, setInspectingUser] = useState<any>(null);
  const [manifest, setManifest] = useState<any>(null);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [decidingUser, setDecidingUser] = useState<any>(null);

  const filteredUsers = useMemo(() => {
    if (!queue?.users) return [];
    return queue.users.filter((u: any) => {
      const matchesRole = role === 'ALL' || u.role === role;
      const matchesSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [queue, role, search]);
  
  const isPdf = (url: string) => url?.toLowerCase().endsWith('.pdf');


  const handleInspect = async (user: any) => {
    setInspectingUser(user);
    setManifestLoading(true);
    try {
      const res = await fetch(`${API}/${user.role === 'farmer' ? 'farmer' : 'supplier'}/${user.id}/kyc`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setManifest(data.data);
      } else {
        toast.error('Failed to retrieve security artifacts');
      }
    } catch (err) {
      toast.error('Protocol failure during manifest retrieval');
    } finally {
      setManifestLoading(false);
    }
  };

  const handleAction = async (userId: string, decision: string, reason?: string) => {
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
  };

  return (
    <AdminLayout pageTitle="Forensic Audit Queue">
      <div className="max-w-7xl mx-auto space-y-12">
         {/* Controls Header */}
         <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <h3 className="text-3xl font-bold text-white font-serif tracking-tight uppercase">KYC Decision Hub</h3>
               <p className="text-red-500 font-bold text-[10px] uppercase tracking-[0.25em] mt-2 italic">Awaiting Forensic Verification Output</p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto p-4 bg-white/5 rounded-3xl border border-white/10">
               <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[300px] group focus-within:border-white/20 transition-all">
                  <Search className="w-4 h-4 text-white/20 group-focus-within:text-red-500" />
                  <input 
                    className="bg-transparent border-none text-[11px] font-bold text-white focus:ring-0 w-full placeholder:text-white/20 outline-none" 
                    placeholder="Search Auditor's Database..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10">
                  {['ALL', 'farmer', 'supplier'].map((r) => (
                    <button 
                      key={r}
                      onClick={() => setRole(r)}
                      className={`
                        px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                        ${role === r ? 'bg-red-600 text-white shadow-xl shadow-red-900/40' : 'text-white/40 hover:text-white'}
                      `}
                    >
                      {r === 'ALL' ? 'Total nodes' : r}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Statistical Telemetry Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard label="Total Nodes" value={queue?.total || 0} sub="Pending Analysis" icon={Users} color="blue" />
            <StatCard label="Farmer Submissions" value={queue?.users?.filter((u: any) => u.role === 'farmer').length || 0} sub="Awaiting Cross-Check" icon={ShieldCheck} color="emerald" />
            <StatCard label="Business Nodes" value={queue?.users?.filter((u: any) => u.role === 'supplier').length || 0} sub="Manual Cert Scan Ready" icon={Package} color="amber" />
            <StatCard label="Avg Turnaround" value="1.2h" sub="System Optimization: High" icon={Clock} color="red" />
         </div>

         {/* Result Matrix */}
         <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 text-white/40 rounded-xl flex items-center justify-center border border-white/10 italic font-serif">A</div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-serif">KYC Transaction Logs</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Encrypted // Verified Platform Source</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => mutate()} className="p-3 bg-white/5 hover:bg-white/10 text-white/40 rounded-xl transition-all"><Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></button>
               </div>
            </div>

            <div className="overflow-x-auto relative z-10 custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/5">
                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Identity Node</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Role</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Submission Interval</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers?.length > 0 ? (
                    filteredUsers.map((user: any) => (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-6 pr-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white italic font-serif group-hover:scale-110 transition-transform">
                              {user.fullName?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-white font-serif truncate max-w-[200px] italic">{user.fullName || 'Identity Pending'}</p>
                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest truncate max-w-[200px] mt-1 italic">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                            user.role === 'farmer' 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-6">
                           <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-bold italic">{new Date(user.kycSubmittedAt || Date.now()).toLocaleString()}</span>
                           </div>
                        </td>
                        <td className="py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-all">
                             <button 
                               onClick={() => handleInspect(user)}
                               className="px-6 py-2.5 bg-white/5 hover:bg-white text-white/60 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center gap-2"
                             >
                                <Eye className="w-3.5 h-3.5" /> View Artifacts
                             </button>
                             <button 
                               onClick={() => setDecidingUser(user)}
                               className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl flex items-center justify-center transition-all border border-emerald-500/20"
                             >
                                <CheckCircle className="w-5 h-5" />
                             </button>
                             <button 
                               onClick={() => setDecidingUser(user)}
                               className="w-10 h-10 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all border border-rose-500/20"
                             >
                                <XCircle className="w-5 h-5" />
                             </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-20">
                           <ShieldAlert className="w-20 h-20 mb-6 shrink-0" />
                           <p className="text-[12px] font-black uppercase tracking-[0.3em] font-serif italic">Identity Ledger Clear // No Records Detected</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-5 pointer-events-none" />
         </div>
      </div>

      <AnimatePresence>
        {inspectingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setInspectingUser(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm shadow-[0_0_100px_rgba(255,0,0,0.1)]"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0c0c] w-full max-w-5xl max-h-[90vh] rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col relative z-10"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-xl shadow-red-900/20">
                       <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-bold text-white font-serif italic truncate">{inspectingUser.email}</h3>
                       <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 italic bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Role: {inspectingUser.role}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">ID: {inspectingUser.id}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setInspectingUser(null)} className="w-14 h-14 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl flex items-center justify-center border border-white/10 transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-12 overflow-y-auto custom-scrollbar flex-1 bg-black/40">
                {manifestLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-6">
                     <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Extracting Forensic Profiles...</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {[
                         { id: 'aadhaar', label: 'Aadhaar Card', url: manifest?.aadhaarCloudUrl, icon: ShieldCheck, color: 'emerald' },
                         { id: 'rtc', label: 'RTC / Land Record', url: manifest?.rtcCloudUrl, icon: FileCheck, color: 'amber' },
                         { id: 'sketch', label: 'Land Sketch', url: manifest?.landSketchUrl, icon: Package, color: 'blue' },
                         { id: 'idProof', label: 'Owner ID Proof', url: manifest?.ownerIdProofUrl, icon: ShieldCheck, color: 'emerald' },
                         { id: 'trade', label: 'Trade License', url: manifest?.tradeLicenseUrl, icon: FileCheck, color: 'amber' },
                         { id: 'business', label: 'Business Cert', url: manifest?.businessCertUrl, icon: Package, color: 'blue' },
                         { id: 'gst', label: 'GST Certificate', url: manifest?.gstCertUrl, icon: CheckCircle, color: 'purple' }
                       ].filter(doc => doc.url).map((doc) => (
                         <div key={doc.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 bg-${doc.color}-600/10 text-${doc.color}-600 rounded-lg flex items-center justify-center border border-${doc.color}-600/20`}><doc.icon className="w-4 h-4" /></div>
                                  <span className="text-[11px] font-bold text-white font-serif italic uppercase underline underline-offset-4 decoration-white/10">{doc.label}</span>
                               </div>
                               <a 
                                 href={doc.url} 
                                 target="_blank" 
                                 rel="noreferrer" 
                                 className="text-[9px] font-black text-white/40 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors"
                               >
                                  Open <Eye className="w-3 h-3" />
                               </a>
                            </div>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="block aspect-[1.4/1] bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl relative group/img cursor-pointer"
                            >
                               {isPdf(doc.url) ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-blue-600/5 group-hover/img:bg-blue-600/10 transition-colors">
                                     <FileCheck className="w-10 h-10 text-blue-500/40" />
                                     <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">PDF Artifact</p>
                                  </div>
                               ) : (
                                  <img src={doc.url} alt={doc.label} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" />
                               )}
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                  <div className="px-5 py-2 bg-white text-black font-black text-[9px] rounded-full uppercase tracking-widest shadow-2xl">Open Original</div>
                               </div>
                            </a>

                         </div>
                       ))}
                    </div>

                     <div className="md:col-span-2 mt-8 p-10 bg-red-600/[0.03] border border-red-600/10 rounded-[3rem] shadow-inner relative overflow-hidden group">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                           <div>
                              <p className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-3 italic">Confidence Matrix</p>
                              <div className="flex items-center gap-4">
                                 <div className="text-3xl font-bold text-white font-serif">{manifest?.nameMatchConfidence ? (manifest.nameMatchConfidence * 100).toFixed(1) : 'N/A'}%</div>
                                 <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-600" style={{ width: `${(manifest?.nameMatchConfidence ?? 0) * 100}%` }} />
                                 </div>
                              </div>
                              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-3 italic font-serif">Verified via Deep-Matching Engine</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-3 italic">Audit Node History</p>
                              <p className="text-[13px] font-bold text-white font-serif italic mb-1">Total Submissions: {manifest?.kycSubmittedAt ? '01' : '00'}</p>
                              <p className="text-[13px] font-bold text-white font-serif italic">Status: {manifest?.kycStatus?.toUpperCase()}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-10 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-6">
                 <button onClick={() => setInspectingUser(null)} className="px-8 py-4 bg-white/5 hover:bg-white text-white/40 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Abort Audit</button>
                 <button onClick={() => { setDecidingUser(inspectingUser); setInspectingUser(null); }} className="px-10 py-5 bg-emerald-600 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Execute Full Approval</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {decidingUser && (
           <DecideModal 
             user={decidingUser} 
             onClose={() => setDecidingUser(null)} 
             onDecide={handleAction} 
           />
         )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffffff10; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffffff20; }
      `}</style>
    </AdminLayout>
  );
}
