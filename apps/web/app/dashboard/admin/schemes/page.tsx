'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Edit3, 
  X, 
  Save, 
  Search, 
  Filter,
  FileCheck,
  Globe,
  Settings,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function AdminSchemesPage() {
  useRequireAuth('admin');
  const { data: schemesData, mutate, isLoading } = useSWR(`${API}/farmer/admin/schemes`, fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    benefit: '',
    ministry: '',
    sourceUrl: '',
    state: '',
    eligibility: {
      maxLandAcres: 5.0,
      isIncomeTaxPayer: false,
      isGovtEmployee: false,
      farmingType: 'any',
      hasLivestock: false
    }
  });

  const openAddModal = () => {
    setEditingScheme(null);
    setFormData({
      name: '',
      description: '',
      benefit: '',
      ministry: '',
      sourceUrl: '',
      state: '',
      eligibility: {
        maxLandAcres: 5.0,
        isIncomeTaxPayer: false,
        isGovtEmployee: false,
        farmingType: 'any',
        hasLivestock: false
      }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (scheme: any) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name || '',
      description: scheme.description || '',
      benefit: scheme.benefit || '',
      ministry: scheme.ministry || '',
      sourceUrl: scheme.sourceUrl || '',
      state: scheme.state || '',
      eligibility: scheme.eligibility || {
        maxLandAcres: 5.0,
        isIncomeTaxPayer: false,
        isGovtEmployee: false,
        farmingType: 'any',
        hasLivestock: false
      }
    });
    setIsModalOpen(true);
  };

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch(`${API}/farmer/admin/schemes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to save scheme');
      toast.success(editingScheme ? 'Scheme Updated' : 'New Scheme Added');
      mutate();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/farmer/admin/schemes?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Scheme removed from database');
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const schemes = schemesData?.schemes || [];

  return (
    <AdminLayout pageTitle="Manage Government Schemes">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Central & State Repository</p>
              <h2 className="text-2xl font-black text-white">Manual Scheme Controls</h2>
           </div>
           <button 
             onClick={openAddModal}
             className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl shadow-red-500/20"
           >
             <Plus className="w-4 h-4" /> Add New Scheme
           </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="glass-card p-6 border-white/5">
              <div className="flex items-center gap-3 mb-2">
                 <Globe className="w-4 h-4 text-blue-400" />
                 <span className="text-[10px] text-slate-500 uppercase font-black">Total Active</span>
              </div>
              <p className="text-3xl font-black text-white">{schemes.length}</p>
           </div>
           <div className="glass-card p-6 border-white/5">
              <div className="flex items-center gap-3 mb-2">
                 <FileCheck className="w-4 h-4 text-green-400" />
                 <span className="text-[10px] text-slate-500 uppercase font-black">Karnataka State</span>
              </div>
              <p className="text-3xl font-black text-white">{schemes.filter((s:any) => s.state === 'Karnataka').length}</p>
           </div>
           <div className="glass-card p-6 border-white/5">
              <div className="flex items-center gap-3 mb-2">
                 <Settings className="w-4 h-4 text-purple-400" />
                 <span className="text-[10px] text-slate-500 uppercase font-black">Auto-Scraped</span>
              </div>
              <p className="text-3xl font-black text-white">{schemes.filter((s:any) => s.scrapedAt).length}</p>
           </div>
        </div>

        {/* Schemes Table */}
        <div className="glass-card overflow-hidden border-white/5 bg-white/[0.02]">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheme Name</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ministry / Dept</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">State</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Eligibility</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                       Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                             <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-full" /></td>
                             <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-3/4" /></td>
                             <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-1/2" /></td>
                             <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-1/4" /></td>
                             <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-16 ml-auto" /></td>
                          </tr>
                       ))
                    ) : (
                       schemes.map((scheme: any) => (
                          <tr key={scheme.name} className="hover:bg-white/[0.03] transition-colors group">
                             <td className="px-6 py-4">
                                <p className="text-white font-bold text-sm">{scheme.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <a href={scheme.sourceUrl} target="_blank" className="text-[10px] text-slate-500 hover:text-blue-400 flex items-center gap-1">
                                       Source link <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-slate-400 text-xs font-medium">{scheme.ministry || '—'}</td>
                             <td className="px-6 py-4">
                                <span className={`badge-${scheme.state ? 'blue' : 'slate'} text-[10px] font-bold`}>
                                   {scheme.state || 'Central'}
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                   {scheme.eligibility?.maxLandAcres && <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400 border border-white/5">Max {scheme.eligibility.maxLandAcres} ac</span>}
                                   {scheme.eligibility?.isIncomeTaxPayer === false && <span className="text-[9px] bg-red-500/10 px-1.5 py-0.5 rounded text-red-400 border border-red-500/10">Non-Taxpayer</span>}
                                </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                     onClick={() => openEditModal(scheme)}
                                     className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/20"
                                   >
                                      <Edit3 className="w-4 h-4" />
                                   </button>
                                   <button 
                                     onClick={() => handleDelete(scheme.name)}
                                     className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                                   >
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </motion.div>

      {/* ── Add/Edit Modal ─────────────────────────────────────── */}
      <AnimatePresence>
         {isModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0d1526] rounded-3xl border border-white/10 shadow-2xl p-8 overflow-y-auto max-h-[90vh]"
              >
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-xl font-black text-white">{editingScheme ? 'Edit Scheme' : 'Add Strategic Scheme'}</h3>
                       <p className="text-slate-500 text-xs">Configure eligibility rules for the matching engine</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-slate-400">
                       <X className="w-6 h-6" />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Scheme Name</label>
                          <input 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="input-field py-3 text-sm" 
                            placeholder="e.g. PM-KISAN 2.0" 
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Ministry / Department</label>
                          <input 
                            value={formData.ministry}
                            onChange={e => setFormData({...formData, ministry: e.target.value})}
                            className="input-field py-3 text-sm" 
                            placeholder="Agri Dept" 
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">State (Leave empty for Central)</label>
                          <input 
                            value={formData.state}
                            onChange={e => setFormData({...formData, state: e.target.value})}
                            className="input-field py-3 text-sm" 
                            placeholder="Karnataka" 
                          />
                       </div>
                       <div className="col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Source URL (Application Link)</label>
                          <input 
                            value={formData.sourceUrl}
                            onChange={e => setFormData({...formData, sourceUrl: e.target.value})}
                            className="input-field py-3 text-sm font-mono text-xs" 
                            placeholder="https://..." 
                          />
                       </div>
                       <div className="col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Brief Benefit</label>
                          <input 
                            value={formData.benefit}
                            onChange={e => setFormData({...formData, benefit: e.target.value})}
                            className="input-field py-3 text-sm" 
                            placeholder="₹5,000 per season..." 
                          />
                       </div>
                       <div className="col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Full Description</label>
                          <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="input-field py-3 text-sm h-24" 
                            placeholder="Detailed explanation..." 
                          />
                       </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                       <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          <Settings className="w-4 h-4 text-red-400" /> Eligibility Logic Settings
                       </h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Max Land Holding (Acres)</label>
                             <input 
                               type="number" 
                               value={formData.eligibility.maxLandAcres}
                               onChange={e => setFormData({
                                 ...formData, 
                                 eligibility: {...formData.eligibility, maxLandAcres: parseFloat(e.target.value)}
                               })}
                               className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white w-full text-sm" 
                             />
                          </div>
                          <div>
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Farming Type Requirement</label>
                             <select 
                               value={formData.eligibility.farmingType}
                               onChange={e => setFormData({
                                 ...formData, 
                                 eligibility: {...formData.eligibility, farmingType: e.target.value}
                               })}
                               className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white w-full text-sm"
                             >
                                <option value="any">Any Style</option>
                                <option value="ORGANIC">Organic Only</option>
                                <option value="CONVENTIONAL">Conventional Only</option>
                             </select>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                             <span className="text-[11px] text-slate-300">Exclude Tax Payers?</span>
                             <input 
                               type="checkbox" 
                               checked={formData.eligibility.isIncomeTaxPayer === false}
                               onChange={e => setFormData({
                                 ...formData, 
                                 eligibility: {...formData.eligibility, isIncomeTaxPayer: !e.target.checked}
                               })}
                               className="w-4 h-4 accent-red-500" 
                             />
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                             <span className="text-[11px] text-slate-300">Requires Livestock?</span>
                             <input 
                               type="checkbox" 
                               checked={formData.eligibility.hasLivestock}
                               onChange={e => setFormData({
                                 ...formData, 
                                 eligibility: {...formData.eligibility, hasLivestock: e.target.checked}
                               })}
                               className="w-4 h-4 accent-red-500" 
                             />
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                       <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1 py-4 font-bold">Cancel</button>
                       <button 
                         onClick={handleSave}
                         disabled={isSaving}
                         className="btn-primary flex-1 py-4 font-bold"
                       >
                          {isSaving ? 'Processing...' : (editingScheme ? 'Update Database' : 'Publish Scheme')}
                          <Save className="w-4 h-4 ml-2" />
                       </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </AdminLayout>
  );
}
