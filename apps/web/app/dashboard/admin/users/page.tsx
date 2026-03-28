'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink,
  Clock,
  User,
  Building2,
  Phone,
  Mail,
  AlertCircle,
  AlertTriangle, 
  FileSearch,
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  Package,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function StatCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-red-600/30 transition-all">
       <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${color}-600/10 text-${color}-600 shadow-xl group-hover:scale-110 transition-transform`}>
             <Icon className="w-7 h-7" />
          </div>
          <div className="p-3 bg-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-white/40 italic">Global Stat</div>
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

export default function IdentityHubPage() {
  useRequireAuth('admin');
  const [search, setSearch] = useState('');
  const { data: usersData, mutate, isLoading } = useSWR(`${API}/auth/admin/users`, fetcher);
  const [inspecting, setInspecting] = useState<any | null>(null);

  const filtered = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.filter((u: any) => 
       u.email.toLowerCase().includes(search.toLowerCase()) || 
       u.fullName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [usersData, search]);

  return (
    <AdminLayout pageTitle="Identity Hub">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl font-bold text-white font-serif tracking-tighter italic">Identity Infrastructure 🌐</h2>
            <p className="text-red-600 font-bold text-[11px] uppercase tracking-[0.25em] mt-3 pb-1 italic">Managing Platform-Wide Human Nodes</p>
          </motion.div>
          
          <div className="flex items-center bg-white/5 border border-white/10 rounded-3xl px-8 py-4 w-full md:w-[450px] shadow-2xl focus-within:border-red-600/30 transition-all group">
             <Search className="w-5 h-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
             <input 
               placeholder="Search Identity Database..."
               className="bg-transparent border-none text-xs font-bold text-white focus:ring-0 ml-4 w-full placeholder:text-white/10 outline-none italic"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>

        {/* Tactical Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <StatCard label="Total Identities" value={usersData?.total || 0} sub="Platform Nodes" icon={User} color="blue" />
           <StatCard label="Farmer Sector" value={usersData?.farmers || 0} sub="Agricultural" icon={ShieldCheck} color="emerald" />
           <StatCard label="Supplier Sector" value={usersData?.suppliers || 0} sub="Logistics" icon={Package} color="amber" />
           <StatCard label="Secure Nodes" value="100%" sub="Integrity OK" icon={CheckCircle} color="red" />
        </div>

        {/* User Matrix */}
        <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 text-white/40 rounded-xl flex items-center justify-center border border-white/10 italic font-serif">I</div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-serif">Global Registry Node List</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Decentralized Storage // Auth Primary</p>
                  </div>
               </div>
               <button onClick={() => mutate()} className="p-3 bg-white/5 hover:bg-white/10 text-white/40 rounded-xl transition-all">
                  <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
               </button>
            </div>

            <div className="overflow-x-auto relative z-10 custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/5">
                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Identity Profile</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Role Cluster</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Compliance Status</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Operational Log</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered?.length > 0 ? (
                    filtered.map((user: any) => (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-6 pr-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white italic font-serif group-hover:scale-110 transition-transform">
                              {user.fullName?.[0] || user.email[0].toUpperCase()}
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
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${user.kycStatus === 'approved' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'} animate-pulse`} />
                             <span className={`text-[10px] font-black uppercase tracking-[0.15em] italic ${user.kycStatus === 'approved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                               {user.kycStatus?.toUpperCase() || 'UNAIDED'}
                             </span>
                           </div>
                        </td>
                        <td className="py-6 text-right">
                           <button 
                             onClick={() => setInspecting(user)}
                             className="px-6 py-2.5 bg-white/5 hover:bg-white text-white/60 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 inline-flex items-center gap-2 group-hover:bg-red-600 group-hover:text-white"
                           >
                              <FileSearch className="w-4 h-4" /> Global Dossier
                           </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-20">
                           <ShieldAlert className="w-20 h-20 mb-6 shrink-0" />
                           <p className="text-[12px] font-black uppercase tracking-[0.3em] font-serif italic">Identity Ledger Scanning Failed // No Records Detected</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-5 pointer-events-none" />
         </div>
      </div>

      <AnimatePresence>
        {inspecting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setInspecting(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0c0c] w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col relative z-10"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-xl shadow-red-900/20">
                       <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-bold text-white font-serif italic truncate">{inspecting.fullName || 'Identity Profile'}</h3>
                       <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 italic bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">ROLE: {inspecting.role?.toUpperCase()}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">NODE: {inspecting.id.toUpperCase()}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setInspecting(null)} className="w-14 h-14 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl flex items-center justify-center border border-white/10 transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-12 overflow-y-auto custom-scrollbar flex-1 bg-black/40">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* General Vector */}
                    <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/[0.07] transition-all group">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-8 italic">Identity Verification Vector</p>
                       <div className="space-y-6">
                          <div className="flex justify-between items-center group/field">
                             <span className="text-[11px] font-bold text-white/40 italic">Registry Email</span>
                             <span className="text-[13px] font-black text-white italic">{inspecting.email}</span>
                          </div>
                          <div className="flex justify-between items-center group/field">
                             <span className="text-[11px] font-bold text-white/40 italic">Phone Relay</span>
                             <span className="text-[13px] font-black text-white italic">{inspecting.phone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center group/field">
                             <span className="text-[11px] font-bold text-white/40 italic">Joined Sequence</span>
                             <span className="text-[13px] font-black text-white italic font-serif underline underline-offset-2 decoration-red-600/30">{new Date(inspecting.createdAt).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>

                    {/* Sector Specifics */}
                    <div className="p-8 bg-red-600/5 border border-red-600/10 rounded-[2.5rem] relative overflow-hidden group">
                       <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" /> Compliance Sector
                       </p>
                       <div className="space-y-6 relative z-10">
                          <div>
                             <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 leading-none">KYC Integrity Stage</p>
                             <p className="text-[18px] font-black text-white font-serif italic uppercase tracking-tighter">
                                {inspecting.kycStatus || 'PENDING_UPLOAD'}
                             </p>
                          </div>
                          <div className="pt-6 border-t border-white/5">
                             <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 leading-none">Security Clearance</p>
                             <div className="flex items-center gap-3">
                                <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                   <div className={`h-full ${inspecting.kycStatus === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'} w-[85%]`} />
                                </div>
                                <span className="text-[10px] font-black text-white italic">85% Clean</span>
                             </div>
                          </div>
                       </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[90px] -translate-y-16 translate-x-16 opacity-10 group-hover:scale-125 transition-transform" />
                    </div>

                    <div className="md:col-span-2 p-10 bg-white/5 border border-white/10 rounded-[3rem] shadow-inner flex items-center justify-between group">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-red-600/20 text-red-600 rounded-2xl flex items-center justify-center shadow-lg"><AlertCircle className="w-7 h-7" /></div>
                          <div>
                             <h4 className="text-xl font-bold text-white font-serif italic mb-1 uppercase tracking-tight">Security Incident Registry</h4>
                             <p className="text-[11px] text-white/40 font-bold italic">No critical anomalies detected for this specific identity node in the current epoch.</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => window.open(`/dashboard/admin/kyc?search=${inspecting.email}`, '_self')}
                         className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2"
                       >
                          Manage KYC <ArrowUpRight className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>
              <div className="p-10 border-t border-white/5 bg-white/[0.02] flex items-center justify-end">
                 <button onClick={() => setInspecting(null)} className="px-10 py-5 bg-white text-black hover:bg-red-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl italic">Close Global Dossier</button>
              </div>
            </motion.div>
          </div>
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
