'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, Clock } from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import FarmerSidebar from '@/components/FarmerSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function FarmerSettingsPage() {
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const { data: profile, mutate, isLoading: profileLoading } = useSWR(`${API}/farmer/profile`, fetcher);
  
  if (authLoading || profileLoading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" /></div>;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  const merged = { ...profile, ...form };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/farmer/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Profile updated!');
      mutate();
      setForm({});
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  function change(field: string, value: string) {
    setForm((f: any) => ({ ...f, [field]: value }));
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <FarmerSidebar pageTitle="Settings" />
      <main className="lg:ml-72 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h2 className="text-text-dark font-serif font-bold">Account Settings</h2>
              <p className="text-text-muted text-sm mt-1">Update your profile and agricultural information</p>
            </div>

            <form onSubmit={save} className="space-y-6">
              {/* Profile Info */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <User className="w-4 h-4 text-text-muted" />
                  <h3 className="text-text-dark font-serif font-bold">Profile Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Display Name</label>
                    <input className="input-field" value={merged.nameDisplay ?? ''} onChange={e => change('nameDisplay', e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Village</label>
                      <input className="input-field" value={merged.village ?? ''} onChange={e => change('village', e.target.value)} placeholder="Village" />
                    </div>
                    <div>
                      <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Taluk</label>
                      <input className="input-field" value={merged.taluk ?? ''} onChange={e => change('taluk', e.target.value)} placeholder="Taluk" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Hobli</label>
                      <input className="input-field" value={merged.hobli ?? ''} onChange={e => change('hobli', e.target.value)} placeholder="Hobli" />
                    </div>
                    <div>
                      <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">District</label>
                      <input className="input-field" value={merged.district ?? ''} onChange={e => change('district', e.target.value)} placeholder="District" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Annual Income (INR)</label>
                      <input type="number" className="input-field" value={merged.annualIncomeINR ?? ''} onChange={e => change('annualIncomeINR', e.target.value)} placeholder="e.g. 150000" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Security & Verification Summary */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <h3 className="text-text-dark font-serif font-bold text-lg">Verification Hub</h3>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Digital Identity Status</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-text-muted uppercase tracking-tighter mb-1">KYC STATUS</p>
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${
                        profile?.kycStatus === 'approved' 
                          ? 'bg-[#d1fae5] text-[#065f46] border-[#10b981]/20' 
                          : 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/20'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                        {profile?.kycStatus?.replace('_', ' ') ?? 'Not started'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#f8f7f4]">
                  {[
                    { label: 'Aadhaar', status: profile?.aadhaarVerified, icon: User },
                    { label: 'Land Record', status: profile?.rtcVerified, icon: Lock },
                    { label: 'Integration', status: profile?.readyToIntegrate, icon: Lock },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.status ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                        <s.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-tight">{s.label}</p>
                        <p className={`text-[11px] font-bold ${s.status ? 'text-green-600' : 'text-slate-400'}`}>
                          {s.status ? 'Verified ✓' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Transparency Hub (Gated) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Aadhaar Details Card */}
                <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-8 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="text-text-dark font-serif font-bold">Identity Details</h3>
                  </div>

                  {profile?.kycStatus === 'approved' ? (
                    <div className="space-y-4">
                      {[
                        { l: 'Aadhaar ID', v: profile?.aadhaarDataJson?.aadhaarNumber },
                        { l: 'Birth Date', v: profile?.dob },
                        { l: 'Gender', v: profile?.gender, cap: true },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-[#f8f7f4] last:border-0">
                          <span className="text-text-muted text-xs font-bold uppercase tracking-wider">{item.l}</span>
                          <span className={`text-sm text-text-dark font-semibold ${item.cap ? 'capitalize' : ''}`}>{item.v ?? '—'}</span>
                        </div>
                      ))}
                      <div className="mt-4 pt-4 border-t border-[#f8f7f4]">
                        <span className="text-text-muted text-xs font-bold uppercase tracking-wider block mb-2">Registered Address</span>
                        <p className="text-sm text-text-dark font-medium leading-relaxed">{profile?.aadhaarAddress ?? '—'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Clock className="w-6 h-6 text-slate-300" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gated Metadata</h4>
                      <p className="text-[10px] text-slate-400/60 mt-2 max-w-[160px] mx-auto">Sensitive Aadhaar credentials are sequestered until KYC approval.</p>
                    </div>
                  )}
                </div>

                {/* Land Record (Bhoomi) Card */}
                <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-8 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="text-text-dark font-serif font-bold">Property Digest</h3>
                  </div>

                  {profile?.kycStatus === 'approved' ? (
                    <div className="space-y-4">
                      {[
                        { l: 'Survey / Hissa', v: `${profile?.surveyNumber ?? '—'} / ${profile?.hissaNumber ?? '—'}` },
                        { l: 'Total Extent', v: `${profile?.totalExtentAcres ?? '—'} Acres` },
                        { l: 'Soil Matrix', v: profile?.soilType },
                        { l: 'Irrigation', v: profile?.irrigationType },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-[#f8f7f4] last:border-0">
                          <span className="text-text-muted text-xs font-bold uppercase tracking-wider">{item.l}</span>
                          <span className="text-sm text-text-dark font-semibold">{item.v ?? '—'}</span>
                        </div>
                      ))}
                      
                      {profile?.rtcDataJson?.ownership?.owners?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#f8f7f4]">
                          <span className="text-text-muted text-[10px] uppercase font-black tracking-widest block mb-2">Verified Title Deeds</span>
                          <p className="text-xs text-text-dark font-medium leading-relaxed">{profile.rtcDataJson.ownership.owners.join(', ')}</p>
                        </div>
                      )}

                      {profile?.rtcDataJson?.cultivation?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#f8f7f4]">
                          <span className="text-text-muted text-[10px] uppercase font-black tracking-widest block mb-2">Cultivation Registry</span>
                          <p className="text-xs text-text-dark font-medium leading-relaxed italic text-brand-green">
                            {profile.rtcDataJson.cultivation.map((c: any) => c.crop || c.name || JSON.stringify(c)).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Clock className="w-6 h-6 text-slate-300" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gated Property</h4>
                      <p className="text-[10px] text-slate-400/60 mt-2 max-w-[160px] mx-auto">Property geolocation and title details unlock after Bhoomi verification.</p>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={saving || Object.keys(form).length === 0} className="btn-primary w-full justify-center py-3.5">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
      </main>
    </div>
  );
}
