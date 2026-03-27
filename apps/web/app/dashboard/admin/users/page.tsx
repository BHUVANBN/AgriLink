'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Filter,
  User,
  Building2,
  Phone,
  Mail,
  MoreVertical,
  AlertTriangle,
  FileSearch,
  ArrowUpRight
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function KycHubPage() {
  const [search, setSearch] = useState('');
  const { data: queue, mutate, isLoading } = useSWR(`${API}/auth/admin/kyc-queue`, fetcher);
  const [deciding, setDeciding] = useState<string | null>(null);
  const [inspecting, setInspecting] = useState<any | null>(null);
  const [reason, setReason] = useState('');

  async function handleDecision(id: string, decision: 'approved' | 'rejected') {
    if (decision === 'rejected' && !reason) {
       toast.error('Rejection requires a clarification reason');
       return;
    }

    try {
      const res = await fetch(`${API}/auth/admin/kyc/${id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, reason }),
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Identity Verified: Node ${decision.toUpperCase()}`);
        setDeciding(null);
        setReason('');
        mutate();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Protocol Failure: Decision could not be broadcast');
    }
  }

  const filtered = queue?.users?.filter((u: any) => 
     u.email.toLowerCase().includes(search.toLowerCase()) || 
     u.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <AdminSidebar pageTitle="KYC Decision Hub" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-white font-serif tracking-tighter">{ADMIN_STRINGS.KYC.TITLE}</h2>
              <p className="text-white/30 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1 transition-all">
                {isLoading ? 'Scanning Platform Cluster...' : ADMIN_STRINGS.KYC.SUBTITLE(queue?.users?.length || 0)}
              </p>
            </div>
            
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-96 shadow-2xl focus-within:border-white/30 transition-all group">
               <Search className="w-5 h-5 text-white/20 group-focus-within:text-white transition-colors" />
               <input 
                 placeholder={ADMIN_STRINGS.KYC.SEARCH_PLACEHOLDER}
                 className="bg-transparent border-none text-xs font-bold text-white focus:ring-0 ml-4 w-full placeholder:text-white/10"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filtered?.length > 0 ? filtered.map((user: any) => (
                  <motion.div 
                    layout
                    key={user.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-white/20 transition-all group overflow-hidden relative"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                       <div className="flex items-start gap-8">
                          <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-2xl font-black italic font-serif shadow-2xl group-hover:scale-110 transition-transform">
                             {user.companyName?.[0] || 'S'}
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-2xl font-bold text-white font-serif tracking-tight italic">{user.companyName || 'Verified Supplier Node'}</h3>
                                <div className="px-3 py-0.5 bg-amber-500/10 text-amber-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-500/20 italic">Awaiting Audit</div>
                             </div>
                             <div className="flex flex-wrap items-center gap-6 mt-3">
                                <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-all">
                                   <Mail className="w-4 h-4 text-white/20" />
                                   <span className="text-[11px] font-bold italic tracking-tight">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-all border-l border-white/5 pl-6">
                                   <Phone className="w-4 h-4 text-white/20" />
                                   <span className="text-[11px] font-bold italic tracking-tight">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-all border-l border-white/5 pl-6">
                                   <Clock className="w-4 h-4 text-white/20" />
                                   <span className="text-[11px] font-bold italic tracking-tight">Evolved {new Date(user.kycSubmittedAt || user.createdAt).toLocaleDateString()}</span>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-10">
                          <button 
                            onClick={() => setInspecting(user)}
                            className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all"
                          >
                             <FileSearch className="w-4 h-4" /> Inspect Manifest
                          </button>
                          
                          <button 
                            onClick={() => setDeciding(user.id)}
                            className="px-10 py-5 bg-white text-black hover:bg-amber-500 hover:text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all shadow-2xl flex items-center gap-3 group/btn"
                          >
                             Execute Decision 
                             <ArrowUpRight className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                          </button>
                       </div>
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600 rounded-full blur-[90px] -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </motion.div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-[4rem] border border-white/5 border-dashed">
                     <ShieldCheck className="w-20 h-20 text-white/5 mb-8" />
                     <p className="text-lg font-bold text-white/20 font-serif italic uppercase tracking-widest">Network Compliance Level: Satisfactory</p>
                     <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] mt-2 italic animate-pulse">Scanning for new submissions...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Decision Modal */}
      <AnimatePresence>
         {deciding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0a0a]/90 backdrop-blur-3xl">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="w-full max-w-lg bg-[#111111] border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
               >
                  <div className="mb-10 text-center">
                     <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                     <h3 className="text-4xl font-black text-white font-serif italic uppercase">Supervisor Decision</h3>
                     <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-2 italic">Executing Platform-Wide Registry Policy</p>
                  </div>

                  <div className="space-y-6 mb-12">
                     <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic mb-3">Optional Clarification Reason</label>
                     <textarea 
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-[13px] font-medium text-white focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-white/10"
                        placeholder="Detail rationale for rejection or specific platform onboarding instructions..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => handleDecision(deciding, 'rejected')}
                       className="py-5 bg-white/5 border border-white/10 hover:bg-red-600 hover:text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all group"
                     >
                        Reject Node
                     </button>
                     <button 
                       onClick={() => handleDecision(deciding, 'approved')}
                       className="py-5 bg-amber-500 text-white hover:bg-amber-600 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-600/20 transition-all"
                     >
                        Verify Identity
                     </button>
                  </div>

                  <button 
                    onClick={() => setDeciding(null)}
                    className="mt-6 w-full text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-all underline decoration-1 underline-offset-4"
                  >
                     Abort Sequence
                  </button>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600 rounded-full blur-[80px] -translate-y-16 translate-x-16 opacity-10" />
               </motion.div>
            </div>
         )}
      </AnimatePresence>
      
      {/* Inspector Modal */}
      <AnimatePresence>
        {inspecting && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden my-auto"
              >
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 pb-10 border-b border-white/5">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center">
                          <Building2 className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-3xl font-bold text-white font-serif italic uppercase">{inspecting.companyName || 'Supplier Manifest'}</h3>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1 italic">Internal Platform Node: {inspecting.id.toUpperCase()}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setInspecting(null)}
                      className="px-10 py-5 bg-white text-black hover:bg-red-600 hover:text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all"
                    >Close Inspector</button>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-10">
                       <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/[0.07] transition-all">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6 italic">Corporate Identity</p>
                          <div className="space-y-6">
                             <div className="flex justify-between items-center group/field">
                                <span className="text-[11px] font-bold text-white/40 italic">Entity Name</span>
                                <span className="text-[13px] font-black text-white font-serif text-right">{inspecting.companyName || 'N/A'}</span>
                             </div>
                             <div className="flex justify-between items-center group/field">
                                <span className="text-[11px] font-bold text-white/40 italic">Taxation Handle (GST)</span>
                                <span className="text-[13px] font-black text-emerald-500 font-mono text-right">{inspecting.gstNumber || 'PENDING_UPLOAD'}</span>
                             </div>
                             <div className="flex justify-between items-center group/field">
                                <span className="text-[11px] font-bold text-white/40 italic">Corporate Link</span>
                                <span className="text-[11px] font-black text-white/60 italic truncate ml-8 text-right underline decoration-1">{inspecting.email}</span>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/[0.07] transition-all">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6 italic">Communication Vector</p>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40"><Phone className="w-5 h-5" /></div>
                                <div>
                                   <p className="text-[8px] font-black text-white/20 uppercase leading-none mb-1">Mobile</p>
                                   <p className="text-[12px] font-bold text-white italic">{inspecting.phone || 'N/A'}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40"><Mail className="w-5 h-5" /></div>
                                <div>
                                   <p className="text-[8px] font-black text-white/20 uppercase leading-none mb-1">Email</p>
                                   <p className="text-[12px] font-bold text-white italic truncate max-w-[120px]">{inspecting.email || 'N/A'}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-10">
                       <div className="p-8 bg-amber-600/5 border border-amber-600/10 rounded-[2.5rem] relative overflow-hidden group">
                          <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4" /> Compliance Sector
                          </p>
                          <div className="space-y-6 relative z-10">
                             <div>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 leading-none">Registered Logistics Hub</p>
                                <p className="text-[14px] font-bold text-white/80 font-serif italic leading-relaxed">
                                   {inspecting.address?.street && `${inspecting.address.street}, `}
                                   {inspecting.address?.city}, {inspecting.address?.district},<br />
                                   {inspecting.address?.state} - {inspecting.address?.pincode}
                                </p>
                             </div>
                             <div className="pt-6 border-t border-white/5">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 leading-none">Temporal Signature</p>
                                <p className="text-[12px] font-bold text-white/60 italic font-mono">NODE_GENESIS: {new Date(inspecting.createdAt).toISOString()}</p>
                             </div>
                          </div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600 rounded-full blur-[90px] -translate-y-16 translate-x-16 opacity-10 group-hover:scale-125 transition-transform" />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => { setDeciding(inspecting.id); setInspecting(null); }}
                            className="py-5 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic"
                          >
                             Fast Decision
                          </button>
                          <button 
                            onClick={() => window.open(`${API}/supplier/${inspecting.id}/kyc`, '_blank')}
                            className="py-5 bg-amber-500 text-white hover:bg-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-600/20 transition-all italic flex items-center justify-center gap-2"
                          >
                             Platform View <ExternalLink className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 p-6 bg-red-600/5 border border-red-600/10 rounded-2xl flex items-center gap-4">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] italic leading-relaxed">
                       Notice: Modification of manifest data is restricted to node owners. Supervisors may only evaluate, approve, or reject. All manifest inspections are logged to the forensic ledger.
                    </p>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
