'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileCheck, AlertTriangle, Clock, CheckCircle, ChevronRight, Search, Database, X } from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Link from 'next/link';
import FarmerSidebar from '@/components/FarmerSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

function BhoomiModal({ onClose, onFetched }: { onClose: () => void; onFetched: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    district: '', taluk: '', hobli: '', village: '', surveyNumber: '', hissaNumber: ''
  });

  async function fetchBhoomi(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/farmer/land/fetch-bhoomi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Bhoomi fetch failed');
      toast.success('Land records fetched and verified! ✓');
      onFetched(json.data.extracted);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-white/8 flex items-center justify-between bg-white/5">
            <h3 className="text-4xl font-bold text-text-dark font-serif">Bhoomi RTC Fetch</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={fetchBhoomi} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs uppercase mb-1.5 block">District</label>
              <input required className="input-field" value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="e.g. Udupi" />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase mb-1.5 block">Taluk</label>
              <input required className="input-field" value={form.taluk} onChange={e => setForm({...form, taluk: e.target.value})} placeholder="e.g. Kundapura" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs uppercase mb-1.5 block">Hobli</label>
              <input required className="input-field" value={form.hobli} onChange={e => setForm({...form, hobli: e.target.value})} placeholder="e.g. Kasaba" />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase mb-1.5 block">Village</label>
              <input required className="input-field" value={form.village} onChange={e => setForm({...form, village: e.target.value})} placeholder="Village name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs uppercase mb-1.5 block text-green-400 font-bold">Survey No.</label>
              <input required className="input-field border-green-500/30" value={form.surveyNumber} onChange={e => setForm({...form, surveyNumber: e.target.value})} placeholder="e.g. 142" />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase mb-1.5 block">Hissa No.</label>
              <input className="input-field" value={form.hissaNumber} onChange={e => setForm({...form, hissaNumber: e.target.value})} placeholder="Optional" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic mt-2">
            Connecting to landrecords.karnataka.gov.in... This may take up to 30 seconds.
          </p>
          <button disabled={loading} type="submit" className="btn-primary w-full justify-center py-3 mt-4">
            {loading ? 'Fetching from Gov Portal...' : 'Fetch Land Records'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function UploadCard({
  title, subtitle, status, onUpload, loading, extractedData, onBhoomiClick, disabled
}: {
  title: string; subtitle: string; status: 'idle' | 'uploading' | 'done' | 'error';
  onUpload: (file: File) => void; loading: boolean; extractedData?: any; onBhoomiClick?: () => void; disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const statusConfig = {
    idle:      { icon: Upload,       color: 'slate', label: 'Upload file' },
    uploading: { icon: Clock,        color: 'blue',  label: 'Processing...' },
    done:      { icon: CheckCircle,  color: 'green', label: 'Verified' },
    error:     { icon: AlertTriangle,color: 'red',   label: 'Failed — retry' },
  };
  const cfg = statusConfig[status];

  return (
    <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-text-dark font-serif">{title}</h3>
            {title.toLocaleLowerCase().includes('rtc') && (
              <a 
                href="https://landrecords.karnataka.gov.in/service53/RTC" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-bold hover:bg-brand-green/20 transition-colors"
              >
                Get RTC
              </a>
            )}
          </div>
          <p className="text-text-muted text-sm mt-1">{subtitle}</p>
        </div>
        <span className={`badge-${cfg.color} text-xs`}>{cfg.label}</span>
      </div>
      {!disabled ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${status === 'done' ? 'border-green-500/40 bg-green-500/5' : 'border-[#eae6de] hover:border-brand-green/30 hover:bg-brand-bg/50'}`}
          onClick={() => ref.current?.click()}
        >
          <cfg.icon className="w-10 h-10 mx-auto mb-3" />
          <p className="text-text-dark text-sm font-medium">
            {loading ? 'Uploading & extracting data...' : status === 'done' ? 'Re-upload to update' : 'Click to upload document'}
          </p>
          <p className="text-text-muted text-xs mt-1">PDF, JPG, PNG or HTML (Max 10MB)</p>
        </div>
      ) : (
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6 text-center">
           <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
           <p className="text-green-600 font-bold text-sm">Verified Successful</p>
           <p className="text-green-600/60 text-[10px] uppercase font-black tracking-widest mt-1">Document locked by Admin</p>
        </div>
      )}

      {onBhoomiClick && status !== 'done' && !disabled && (
        <a 
          href="https://landrecords.karnataka.gov.in/service53/RTC" 
          target="_blank" 
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-[#eae6de] text-xs font-bold text-text-muted hover:bg-brand-bg transition-all"
        >
          <Database className="w-4 h-4" />
          Get RTC / Bhoomi Record
        </a>
      )}

      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png,.html" className="hidden"
        onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />

      {extractedData && status === 'done' && (
        <div className="mt-4 p-5 bg-[#f8fcf9] rounded-xl border border-brand-green/10 shadow-inner">
          <p className="text-brand-green text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
            Extracted Intelligence
          </p>
          <div className="space-y-1">
            {Object.entries((function flatten(obj: any, prefix = ''): any {
              return Object.keys(obj).reduce((acc: any, k) => {
                const key = prefix ? `${prefix}_${k}` : k;
                if (k === 'rawText' || k === 'raw_text') return acc;
                if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
                  Object.assign(acc, flatten(obj[k], key));
                } else {
                  acc[key] = obj[k];
                }
                return acc;
              }, {});
            })(extractedData))
              .filter(([k, v]) => v && !['success', 'confidence', 'rawText', 'raw_text', 'error'].includes(k) && (Array.isArray(v) ? v.length > 0 : true))
              .map(([k, v]) => {
                const labelMap: Record<string, string> = {
                  'location_district': 'District',
                  'location_taluk': 'Taluk',
                  'location_hobli': 'Hobli',
                  'location_village': 'Village',
                  'landIdentification_surveyNumber': 'Survey Number',
                  'landIdentification_hissaNumber': 'Hissa Number',
                  'landDetails_totalExtent': 'Total Extent',
                  'landDetails_soilType': 'Soil Type',
                  'landDetails_landTax': 'Land Tax',
                  'ownership_ownerNames': 'Owner Names',
                  'ownership_accountNumber': 'Account Number',
                  'ownership_mutationNumber': 'Mutation Number',
                  'ownership_validFrom': 'Valid From',
                  'cultivation': 'Crop History',
                  'aadhaarNumber': 'Aadhaar Number',
                  'nameEnglish': 'Full Name',
                  'nameKannada': 'Name (Kannada)',
                  'dob': 'Date of Birth',
                  'gender': 'Gender',
                  'address': 'Address'
                };

                const heading = labelMap[k] || k.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1')).join(" ").trim();
                const displayValue = Array.isArray(v) 
                  ? v.map(i => typeof i === 'object' ? (i.name || i.crop || JSON.stringify(i)) : i).join(", ")
                  : String(v);

                return (
                  <div key={k} className="flex justify-between items-center text-sm py-2 border-b border-black/5 last:border-0 hover:bg-black/[0.01] -mx-2 px-2 rounded-md transition-colors">
                    <span className="text-text-muted font-bold whitespace-nowrap mr-4">{heading}</span>
                    <span className="text-text-dark font-serif font-semibold text-right break-words">{displayValue}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KycPage() {
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const { data: stats, mutate, isLoading: statsLoading } = useSWR(`${API}/farmer/stats`, fetcher);
  const { data: profile } = useSWR(`${API}/farmer/profile`, fetcher);

  const [aadhaarStatus, setAadhaarStatus] = useState<'idle'|'uploading'|'done'|'error'>('idle');
  const [rtcStatus, setRtcStatus] = useState<'idle'|'uploading'|'done'|'error'>('idle');
  const [aadhaarData, setAadhaarData] = useState<any>(null);
  const [rtcData, setRtcData]         = useState<any>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [showBhoomi, setShowBhoomi]   = useState(false);

  // Persistence: Hydrate extracted data from profile on refresh
  useEffect(() => {
    if (profile) {
      if (profile.aadhaarDataJson && !aadhaarData) {
        setAadhaarData(profile.aadhaarDataJson);
        setAadhaarStatus('done');
      }
      if (profile.rtcDataJson && !rtcData) {
        setRtcData(profile.rtcDataJson);
        setRtcStatus('done');
      }
    }
  }, [profile, aadhaarData, rtcData]);

  if (authLoading || statsLoading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" /></div>;


  async function uploadDoc(endpoint: string, file: File, setStatus: any, setData: any) {
    if (endpoint === 'rtc') setShowBhoomi(false);
    setStatus('uploading');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API}/farmer/documents/${endpoint}`, {
        method: 'POST', body: form, credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      setData(json.data?.extracted ?? {});
      setStatus('done');
      mutate();
      toast.success(`${endpoint === 'aadhaar' ? 'Aadhaar' : 'RTC'} uploaded and verified!`);
    } catch (err: any) {
      setStatus('error');
      toast.error(err.message);
    }
  }

  async function submitKyc() {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/farmer/kyc/submit`, { method: 'POST', credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Submission failed');
      toast.success(json.data?.message || 'KYC submitted successfully!');
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const kycStatus = stats?.kycStatus ?? 'not_started';
  const canSubmit = (stats?.aadhaarVerified || aadhaarStatus === 'done') &&
                   (stats?.rtcVerified || rtcStatus === 'done') &&
                   kycStatus !== 'submitted' && kycStatus !== 'approved';

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <FarmerSidebar pageTitle="KYC & Documents" />
      <main className="lg:ml-72 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold text-text-dark font-serif">KYC Verification</h2>
                <p className="text-text-muted text-sm mt-1">Upload Documents or use Digital Verification System</p>
              </div>
            </div>

            {/* Status Banner */}
            {kycStatus === 'submitted' && (
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-4 flex items-center gap-3 border border-blue-500/30 bg-blue-500/10 mb-6">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-blue-300 font-medium text-sm">KYC Under Review</p>
                  <p className="text-text-muted text-xs">Admin will verify within 2–3 business days</p>
                </div>
              </div>
            )}
            {kycStatus === 'approved' && (
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-4 flex items-center gap-3 border border-green-500/30 bg-green-500/10 mb-6">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300 font-medium text-sm">KYC Approved! You have full platform access.</p>
              </div>
            )}

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
              {[
                { label: 'Aadhaar', done: stats?.aadhaarVerified || aadhaarStatus === 'done' },
                { label: 'RTC / Bhoomi', done: stats?.rtcVerified || rtcStatus === 'done' },
                { label: 'Submitted', done: kycStatus === 'submitted' || kycStatus === 'approved' },
                { label: 'Approved', done: kycStatus === 'approved' },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    step.done ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-text-muted border-white/10'
                  }`}>
                    {step.done && <CheckCircle className="w-3 h-3" />}
                    {step.label}
                  </div>
                  {i < 3 && <ChevronRight className="w-4 h-4 text-slate-600" />}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UploadCard
                title="Aadhaar Card"
                subtitle={kycStatus === 'approved' ? "Verified Personal Identity" : "Upload front & back of Aadhaar card (PDF or image)"}
                status={(stats?.aadhaarVerified || kycStatus === 'approved') ? 'done' : aadhaarStatus}
                onUpload={f => uploadDoc('aadhaar', f, setAadhaarStatus, setAadhaarData)}
                loading={aadhaarStatus === 'uploading'}
                extractedData={aadhaarData}
                disabled={kycStatus === 'approved' || kycStatus === 'submitted'}
              />
              <UploadCard
                title="RTC / Bhoomi Record"
                subtitle={kycStatus === 'approved' ? "Verified Digital Land Records" : "Upload your land record from bhoomi.karnataka.gov.in"}
                status={(stats?.rtcVerified || kycStatus === 'approved') ? 'done' : rtcStatus}
                onUpload={f => uploadDoc('rtc', f, setRtcStatus, setRtcData)}
                loading={rtcStatus === 'uploading'}
                extractedData={rtcData}
                onBhoomiClick={() => setShowBhoomi(true)}
                disabled={kycStatus === 'approved' || kycStatus === 'submitted'}
              />
            </div>

            {/* Name Match */}
            {profile?.nameMatchStatus && profile.nameMatchStatus !== 'pending' && (
              <div className={`mt-6 bg-white rounded-2xl border border-[#eae6de] shadow-sm p-4 border ${profile.nameMatchStatus === 'matched' ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                <p className={`text-sm font-medium ${profile.nameMatchStatus === 'matched' ? 'text-green-300' : 'text-red-300'}`}>
                  {profile.nameMatchStatus === 'matched'
                    ? `✅ Name match successful — ${Math.round((profile.nameMatchConfidence ?? 0) * 100)}% confidence`
                    : '⚠️ Name mismatch detected between Aadhaar and RTC. Admin will review manually.'}
                </p>
              </div>
            )}

            {canSubmit && (
              <button
                onClick={submitKyc}
                disabled={submitting}
                className="btn-primary mt-8 w-full justify-center py-4 text-base shadow-lg shadow-green-500/20"
              >
                {submitting ? 'Submitting...' : '🚀 Submit KYC for Admin Review'}
              </button>
            )}
          </motion.div>
      </main>

      <AnimatePresence>
        {showBhoomi && (
          <BhoomiModal 
            onClose={() => setShowBhoomi(false)} 
            onFetched={data => {
              setRtcData(data);
              setRtcStatus('done');
              setShowBhoomi(false);
              mutate();
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
