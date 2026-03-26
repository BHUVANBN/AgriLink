'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ExternalLink, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  AlertTriangle,
  Save,
  Info,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import FarmerSidebar from '@/components/FarmerSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function SchemeCard({ scheme }: { scheme: any }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 group hover:border-brand-green/30 border border-[#eae6de] shadow-sm transition-all relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-text-dark font-serif font-bold text-2xl leading-tight font-heading group-hover:text-brand-green transition-colors mb-4 italic">
            {scheme.name}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed font-medium line-clamp-2 italic">
            {scheme.description || 'Access full details and application procedures via the official government portal link.'}
          </p>
        </div>
        
        {scheme.sourceUrl && (
          <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="px-8 py-4 flex items-center justify-center gap-3 rounded-[1.5rem] bg-brand-green text-white hover:bg-slate-800 transition-all shadow-xl shadow-brand-green/10 group/link shrink-0"
          >
            <span className="text-[10px] font-black uppercase tracking-widest italic">View Official Link</span>
            <ExternalLink className="w-4 h-4 group-hover/link:translate-y-[-2px] group-hover/link:translate-x-[2px] transition-transform" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function SchemesPage() {
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const { data: stats, isLoading: statsLoading } = useSWR(`${API}/farmer/stats`, fetcher);
  const { data: profile, mutate: mutateProfile, isLoading: profileLoading } = useSWR(`${API}/farmer/profile`, fetcher);
  const { data: schemes, isLoading, mutate: mutateSchemes } = useSWR(`${API}/farmer/schemes/eligible`, fetcher);
  
  const [tab, setTab] = useState<'matches' | 'profile'>('matches');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  if (authLoading || statsLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
      </div>
    );
  }

  // Initialize form data once profile loads
  const initForm = () => {
    if (profile && !formData) {
       setFormData({
         landOwnershipType: profile.landOwnershipType || 'OWNED',
         casteCategory: profile.casteCategory || 'GENERAL',
         isIncomeTaxPayer: profile.isIncomeTaxPayer || false,
         isGovtEmployee: profile.isGovtEmployee || false,
         hasKCC: profile.hasKCC || false,
         hasAadhaarLinkedBank: profile.hasAadhaarLinkedBank || false,
         hasLivestock: profile.hasLivestock || false,
         farmingType: profile.farmingType || 'CONVENTIONAL',
         annualIncomeINR: profile.annualIncomeINR || 0,
       });
    }
  };
  
  initForm();

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/farmer/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      toast.success('Eligibility profile updated! Refreshing matches...');
      await mutateProfile();
      await mutateSchemes();
      setTab('matches');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const kycOk = stats?.kycStatus === 'approved';
  // FIX: schemes is an object { schemes: [], count: 0 }, extract the array
  const allSchemes = Array.isArray(schemes?.schemes) ? schemes.schemes : [];

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <FarmerSidebar pageTitle="Govt. Schemes" />
      <main className="lg:ml-72 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-brand-green" />
                  <span className="text-brand-green text-[10px] font-black uppercase tracking-[0.3em]">Central Schemes Hub</span>
                </div>
                <h2 className="text-text-dark font-serif font-bold">Government Schemes</h2>
                <p className="text-text-muted text-base mt-2 font-medium italic">Precision eligibility matching for <span className="text-brand-green font-bold">{profile?.nameDisplay || 'Farmer'}</span></p>
              </div>
              
              <div className="flex bg-white/60 p-1.5 rounded-[2rem] border border-[#eae6de] shadow-xl shadow-brand-green/5 backdrop-blur-md">
                <button 
                  onClick={() => setTab('matches')}
                  className={`px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${tab === 'matches' ? 'bg-brand-green text-white shadow-xl shadow-brand-green/20' : 'text-text-muted hover:text-text-dark hover:bg-white'}`}
                >
                  <Layers className="w-4 h-4" /> Recommended
                </button>
                <button 
                  onClick={() => setTab('profile')}
                  className={`px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${tab === 'profile' ? 'bg-brand-orange text-white shadow-xl shadow-orange-900/10' : 'text-text-muted hover:text-text-muted hover:bg-white'}`}
                >
                  <UserCheck className="w-4 h-4" /> Eligibility Profile
                </button>
              </div>
            </div>

            {!kycOk && (
              <div className="bg-orange-50 rounded-[3rem] p-10 border border-orange-100 mb-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                 <div className="flex gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                       <AlertTriangle className="w-7 h-7 text-brand-orange" />
                    </div>
                    <div>
                       <h3 className="text-orange-900 font-black text-xl mb-2 font-heading tracking-tight">Access Restricted</h3>
                       <p className="text-orange-800/60 text-sm leading-relaxed font-medium italic">
                          Premium schemes like **PM-KISAN** and **NHM Subsidies** require a verified Land Record (RTC). Please complete your KYC verification to sync precision matching data.
                       </p>
                       <button className="mt-6 text-brand-orange text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">Complete KYC Now <ChevronRight className="w-4 h-4" /></button>
                    </div>
                 </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {tab === 'matches' ? (
                <motion.div 
                  key="matches" 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  {isLoading ? (
                    <div className="space-y-6">
                      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-44 bg-[#f8f7f4] animate-pulse rounded-[2.5rem] border border-[#eae6de]" />)}
                    </div>
                  ) : allSchemes.length === 0 ? (
                    <div className="bg-white rounded-[4rem] p-32 text-center border border-[#eae6de] shadow-sm">
                       <div className="w-24 h-24 bg-[#f8f7f4] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
                          <Search className="w-12 h-12 text-[#d6d3cb]" />
                       </div>
                       <h3 className="text-text-dark font-serif font-bold text-3xl font-heading mb-4">No Optimized Matches</h3>
                       <p className="text-text-muted text-base font-medium italic max-w-sm mx-auto leading-relaxed">
                          Refine your **Eligibility Profile** with specific details like irrigation type, livestock ownership or crop variety to find untapped village grants.
                       </p>
                       <button onClick={() => setTab('profile')} className="mt-12 bg-text-dark text-white px-12 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-green/5 hover:scale-105 active:scale-95 transition-all">Update Eligibility Profile</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex items-center gap-3 mb-4 px-2">
                         <div className="w-3 h-3 rounded-full bg-brand-green shadow-[0_0_10px_rgba(26,77,46,0.5)]" />
                         <span className="text-[11px] text-brand-green uppercase font-black tracking-widest">discovery Result: {allSchemes.length} Adaptive Schemes Enabled</span>
                      </div>
                      {allSchemes.map((scheme, i) => (
                        <SchemeCard key={i} scheme={scheme} />
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="profile" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[3.5rem] p-12 border border-[#eae6de] shadow-2xl shadow-brand-green/5/50"
                >
                  <div className="max-w-4xl mx-auto">
                     <div className="flex items-center gap-5 mb-12 border-b border-[#f8f7f4] pb-10">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-[var(--primary-soft)] flex items-center justify-center border border-brand-green/5">
                           <Info className="w-7 h-7 text-brand-green" />
                        </div>
                        <div>
                           <h3 className="text-text-dark font-serif font-bold text-2xl font-heading tracking-tight leading-none uppercase">Eligibility Configuration</h3>
                           <p className="text-text-muted text-sm mt-2 font-medium italic">AgriLink matches these intelligence points against 150+ central & multi-state agricultural schemes.</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                        <div className="space-y-10">
                           <div className="flex items-center gap-3 px-1">
                              <span className="w-6 h-px bg-brand-green" />
                              <h4 className="text-[11px] font-black text-brand-green uppercase tracking-[0.2em]">Agri Context</h4>
                           </div>
                           
                           <div className="space-y-8">
                              <div>
                                 <label className="text-[10px] text-text-muted block mb-3 font-black uppercase tracking-widest">Ownership Matrix</label>
                                 <select 
                                   value={formData?.landOwnershipType}
                                   onChange={e => setFormData({...formData, landOwnershipType: e.target.value})}
                                   className="w-full bg-[#f8f7f4] border border-[#eae6de] rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-text-dark focus:ring-2 focus:ring-brand-green/10 focus:bg-white outline-none transition-all cursor-pointer"
                                 >
                                    <option value="OWNED">Freehold (Pattadar)</option>
                                    <option value="LEASED">Leased / Cluster Contract</option>
                                    <option value="TENANT">Tenant / Sharecropper</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[10px] text-text-muted block mb-3 font-black uppercase tracking-widest">Farming Topology</label>
                                 <select 
                                   value={formData?.farmingType}
                                   onChange={e => setFormData({...formData, farmingType: e.target.value})}
                                   className="w-full bg-[#f8f7f4] border border-[#eae6de] rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-text-dark focus:ring-2 focus:ring-brand-green/10 focus:bg-white outline-none transition-all cursor-pointer"
                                 >
                                    <option value="CONVENTIONAL">Conventional Multi-Crop</option>
                                    <option value="ORGANIC">Natural (Zero Budget)</option>
                                    <option value="HORTICULTURE">Horticulture (Fruits/Veg)</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[10px] text-text-muted block mb-3 font-black uppercase tracking-widest">Estimated Annual Yield Value (INR)</label>
                                 <input 
                                   type="number" 
                                   value={formData?.annualIncomeINR === undefined || Number.isNaN(formData?.annualIncomeINR) ? '' : formData.annualIncomeINR}
                                   onChange={e => {
                                     const val = e.target.value;
                                     setFormData({
                                       ...formData, 
                                       annualIncomeINR: val === '' ? 0 : parseInt(val)
                                     });
                                   }}
                                   className="w-full bg-[#f8f7f4] border border-[#eae6de] rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-text-dark focus:ring-2 focus:ring-brand-green/10 focus:bg-white outline-none transition-all" 
                                   placeholder="e.g. 150000"
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-10">
                           <div className="flex items-center gap-3 px-1">
                              <span className="w-6 h-px bg-brand-orange" />
                              <h4 className="text-[11px] font-black text-brand-orange uppercase tracking-[0.2em]">Socio-Economic Sensors</h4>
                           </div>
                           
                           <div className="space-y-5">
                              {[
                                { id: 'isIncomeTaxPayer', label: 'Registered IT Payer', sub: 'Critical for PM-KISAN filtering' },
                                { id: 'isGovtEmployee', label: 'Government Employment', sub: 'Ministry disqualification parameter' },
                                { id: 'hasLivestock', label: 'Integrated Livestock', sub: 'Dairy & Poultry grant access' },
                                { id: 'hasKCC', label: 'Kisan Credit Card Hub', sub: 'Refinancing & interest subvention' },
                              ].map(toggle => (
                                <div key={toggle.id} className="flex items-center justify-between p-5 bg-[#f8f7f4] rounded-[1.5rem] border border-[#eae6de] group hover:border-brand-green/20 transition-all">
                                   <div>
                                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{toggle.label}</p>
                                      <p className="text-[9px] text-text-muted font-bold uppercase mt-1 italic">{toggle.sub}</p>
                                   </div>
                                   <input 
                                     type="checkbox" 
                                     checked={formData?.[toggle.id]}
                                     onChange={e => setFormData({...formData, [toggle.id]: e.target.checked})}
                                     className="w-6 h-6 accent-brand-green rounded-lg cursor-pointer transition-transform hover:scale-110" 
                                   />
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-[#f8f7f4]">
                        <p className="text-[11px] text-text-muted max-w-sm italic font-medium leading-relaxed">
                           Updating these intelligence parameters helps our AI synchronization engine prioritize high-yield schemes that match your operational profile exactly.
                        </p>
                        <button 
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="w-full md:w-auto bg-brand-green text-white px-12 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-brand-green/20 hover:bg-[var(--primary-hover)] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                          {saving ? 'Syncing Profile...' : 'Finalize & Refresh Matches'}
                          <Save className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
      </main>
    </div>
  );
}
