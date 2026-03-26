'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Building2, Phone, FileText, CreditCard,
  Upload, CheckCircle, Clock, AlertTriangle, Shield
} from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

const BUSINESS_TYPES = ['Sole Proprietorship', 'Partnership', 'Private Limited', 'OPC', 'LLP', 'Other'];

const KYC_DOCS = [
  { key: 'businessCertUrl', label: 'Business Registration Certificate', hint: 'Certificate of Incorporation or Shop Act License' },
  { key: 'tradeLicenseUrl', label: 'Trade License', hint: 'Municipal trade/business license' },
  { key: 'ownerIdProofUrl', label: 'Owner ID Proof', hint: 'Aadhaar, Passport, or Voter ID of the owner' },
  { key: 'gstCertUrl', label: 'GST Certificate', hint: 'GSTIN registration certificate (if applicable)' },
];

function DocUploadRow({
  doc, currentUrl, onUploaded
}: {
  doc: typeof KYC_DOCS[0];
  currentUrl?: string;
  onUploaded: (key: string, url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      toast.error('Only PDF, JPG, PNG allowed'); return;
    }
    if (file.size > 10 * 1024 * 1024) { toast.error('Max file size: 10MB'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Upload to cloudinary via supplier service
      const res = await fetch(`${API}/supplier/documents/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      onUploaded(doc.key, json.data?.url ?? json.data?.secure_url);
      toast.success(`${doc.label} uploaded!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/8 last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium">{doc.label}</p>
        <p className="text-slate-500 text-xs mt-0.5">{doc.hint}</p>
        {currentUrl && (
          <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs hover:underline">View uploaded ↗</a>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {currentUrl && <CheckCircle className="w-4 h-4 text-green-400" />}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${currentUrl
            ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20'
            : 'border-white/15 bg-white/5 text-slate-300 hover:border-white/30'
          }`}
        >
          <Upload className="w-3 h-3" />
          {uploading ? 'Uploading...' : currentUrl ? 'Re-upload' : 'Upload'}
        </button>
        <input
          ref={ref}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={e => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </div>
    </div>
  );
}

export default function SupplierSettingsPage() {
  const { isLoading: authLoading } = useRequireAuth('supplier');
  const { data: profile, mutate } = useSWR(`${API}/supplier/profile`, fetcher);
  const [saving, setSaving] = useState(false);
  const [submittingKyc, setSubmittingKyc] = useState(false);
  const [form, setForm] = useState<any>({});
  const [kycDocs, setKycDocs] = useState<Record<string, string>>({});

  const merged = { ...profile, ...form };

  function change(field: string, value: string) {
    setForm((f: any) => ({ ...f, [field]: value }));
  }

  function setDocUrl(key: string, url: string) {
    setKycDocs(d => ({ ...d, [key]: url }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/supplier/profile`, {
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

  async function submitKyc() {
    const payload = {
      ...kycDocs,
      gstNumber: merged.gstNumber,
      businessType: merged.businessType,
      yearsInOperation: merged.yearsInOperation,
    };
    const hasDocs = Object.keys(kycDocs).length > 0 ||
      KYC_DOCS.some(d => profile?.[d.key]);

    if (!hasDocs) {
      toast.error('Upload at least one KYC document first'); return;
    }

    setSubmittingKyc(true);
    try {
      const res = await fetch(`${API}/supplier/kyc/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Submission failed');
      toast.success('KYC submitted for admin review!');
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmittingKyc(false);
    }
  }

  const kycStatus = profile?.kycStatus ?? 'NOT_SUBMITTED';
  const kycStatusConfig = {
    NOT_SUBMITTED: { label: 'Not Submitted', cls: 'badge-slate', icon: Clock },
    PENDING:       { label: 'Under Review',  cls: 'badge-amber', icon: Clock },
    APPROVED:      { label: 'Approved ✓',    cls: 'badge-green', icon: CheckCircle },
    REJECTED:      { label: 'Rejected',      cls: 'badge-red',   icon: AlertTriangle },
  };
  const kycCfg = kycStatusConfig[kycStatus as keyof typeof kycStatusConfig] ?? kycStatusConfig.NOT_SUBMITTED;

  if (authLoading) return <div className="min-h-screen bg-[#0a0f1e] flex"><div className="flex-1 lg:ml-64 pt-16" /></div>;

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Settings" />
      <main className="lg:ml-72 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-3xl font-bold text-text-dark font-serif">Business Settings</h2>

            <form onSubmit={save} className="space-y-6">
              {/* Business Profile */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-4 h-4 text-text-muted" />
                  <h3 className="text-white font-semibold">Business Information</h3>
                </div>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Company Name</label>
                  <input className="input-field" value={merged.companyName ?? ''} onChange={e => change('companyName', e.target.value)} placeholder="Your company name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Business Type</label>
                    <select className="input-field" value={merged.businessType ?? ''} onChange={e => change('businessType', e.target.value)}>
                      <option value="" className="bg-slate-900">Select type</option>
                      {BUSINESS_TYPES.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Years in Operation</label>
                    <input className="input-field" value={merged.yearsInOperation ?? ''} onChange={e => change('yearsInOperation', e.target.value)} placeholder="e.g. 5" />
                  </div>
                </div>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Product Categories</label>
                  <input className="input-field" value={merged.productCategories?.join?.(', ') ?? merged.productCategories ?? ''} onChange={e => change('productCategories', e.target.value)} placeholder="seeds, fertilizers, tools" />
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-4 h-4 text-text-muted" />
                  <h3 className="text-white font-semibold">Contact & Address</h3>
                </div>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Phone</label>
                  <input className="input-field" type="tel" value={merged.phone ?? ''} onChange={e => change('phone', e.target.value)} placeholder="10-digit mobile" />
                </div>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Business Address</label>
                  <input className="input-field" value={merged.address ?? ''} onChange={e => change('address', e.target.value)} placeholder="Full address" />
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-4 h-4 text-text-muted" />
                  <h3 className="text-white font-semibold">Compliance</h3>
                </div>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">GST Number</label>
                  <input className="input-field" value={merged.gstNumber ?? ''} onChange={e => change('gstNumber', e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} />
                </div>
              </div>

              {/* Payments */}
              <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-4 h-4 text-text-muted" />
                  <h3 className="text-white font-semibold">Payment Details</h3>
                </div>
                <div>
                  <label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">UPI ID (for payouts)</label>
                  <input className="input-field" value={merged.upiId ?? ''} onChange={e => change('upiId', e.target.value)} placeholder="yourname@upi" />
                </div>
              </div>

              <button type="submit" disabled={saving || Object.keys(form).length === 0} className="btn-primary w-full justify-center py-3.5">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            {/* KYC Section */}
            <div className="bg-white rounded-2xl border border-[#eae6de] shadow-sm p-6 mt-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-text-muted" />
                  <h3 className="text-white font-semibold">KYC Verification</h3>
                </div>
                <span className={`${kycCfg.cls} text-xs flex items-center gap-1`}>
                  <kycCfg.icon className="w-3 h-3" /> {kycCfg.label}
                </span>
              </div>

              {kycStatus === 'APPROVED' ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300 font-medium text-sm">KYC Verified! You can now list products on the marketplace.</p>
                </div>
              ) : (
                <>
                  {kycStatus === 'REJECTED' && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                      <p className="text-red-300 text-sm">Your KYC was rejected. Please re-upload documents and resubmit.</p>
                    </div>
                  )}
                  {kycStatus === 'PENDING' && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                      <p className="text-amber-300 text-sm">Your KYC is under admin review. You will be notified within 2–3 business days.</p>
                    </div>
                  )}

                  <div className="mb-5">
                    {KYC_DOCS.map(doc => (
                      <DocUploadRow
                        key={doc.key}
                        doc={doc}
                        currentUrl={kycDocs[doc.key] ?? profile?.[doc.key]}
                        onUploaded={setDocUrl}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={submitKyc}
                    disabled={submittingKyc || kycStatus === 'PENDING'}
                    className="btn-primary w-full justify-center py-3.5 disabled:opacity-50"
                  >
                    {submittingKyc ? 'Submitting...' : kycStatus === 'PENDING' ? 'Review Pending...' : '🚀 Submit KYC for Review'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
      </main>
    </div>
  );
}
