'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader2,
  Building2,
  Clock
} from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function SupplierKycPage() {
  const router = useRouter();
  const { data: profile, mutate } = useSWR(`${API}/supplier/profile`, fetcher);
  
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    businessType: '',
    yearsInOperation: '',
    gstNumber: '',
    businessCertUrl: '',
    tradeLicenseUrl: '',
    ownerIdProofUrl: '',
    gstCertUrl: '',
  });

  // Basic sync from profile if exists
  useState(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        businessType: profile.businessType || '',
        yearsInOperation: profile.yearsInOperation || '',
        gstNumber: profile.gstNumber || '',
        businessCertUrl: profile.businessCertUrl || '',
        tradeLicenseUrl: profile.tradeLicenseUrl || '',
        ownerIdProofUrl: profile.ownerIdProofUrl || '',
        gstCertUrl: profile.gstCertUrl || '',
      }));
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(field);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch(`${API}/supplier/documents/upload`, {
        method: 'POST',
        body,
        credentials: 'include',
      });
      const result = await res.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, [field]: result.data.url }));
        toast.success('Document uploaded successfully');
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Connection error during upload');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessCertUrl || !formData.ownerIdProofUrl) {
      toast.error('Please upload at least Business Certificate and Owner ID Proof');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/supplier/kyc/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const result = await res.json();
      if (result.success) {
        toast.success('KYC Submitted for Review!');
        mutate();
        router.push('/dashboard/supplier');
      } else {
        toast.error(result.error || 'Submission failed');
      }
    } catch (err) {
      toast.error('Connection error during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (profile?.kycStatus === 'APPROVED') {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[2.5rem] shadow-soft text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-text-dark font-serif mb-2">Verified Partner</h2>
          <p className="text-text-muted text-sm mb-8 leading-relaxed">Your business identity is fully verified. You have full access to all marketplace features.</p>
          <button onClick={() => router.push('/dashboard/supplier')} className="btn-primary w-full rounded-2xl">Return to Dashboard</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="KYC Verification" />
      
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-brand-orange" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange">Trust & Safety</span>
              </div>
              <h2 className="text-4xl font-bold text-text-dark font-serif mb-3">Business Verification</h2>
              <p className="text-text-muted font-medium max-w-xl">Complete your legal profile to unlock product listings and secure payments on the AgriLink network.</p>
            </motion.div>
          </div>

          {profile?.kycStatus === 'PENDING' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#eae6de] rounded-[2rem] p-12 text-center shadow-soft">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-text-dark font-serif mb-2">Review in Progress</h3>
              <p className="text-text-muted text-sm max-w-xs mx-auto mb-8">Documents submitted on {profile.kycSubmittedAt ? new Date(profile.kycSubmittedAt).toLocaleDateString() : 'N/A'}. Verification typically takes 48-72 hours.</p>
              <div className="px-6 py-3 bg-[#f8f7f4] rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-500 inline-block">Status: Pending Admin Approval</div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Business Details */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#eae6de] rounded-[2rem] p-8 lg:p-10 shadow-soft">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-[#f8f7f4] rounded-xl flex items-center justify-center text-text-dark font-bold">01</div>
                  <h3 className="text-xl font-bold text-text-dark font-serif">Business Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Entity Type</label>
                    <select 
                      className="input-field rounded-xl"
                      value={formData.businessType}
                      onChange={e => setFormData({...formData, businessType: e.target.value})}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Pvt Ltd">Private Limited</option>
                      <option value="Farmer Group">FPO / Farmer Group</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Operational Years</label>
                    <input 
                      type="number" 
                      className="input-field rounded-xl" 
                      placeholder="e.g. 5"
                      value={formData.yearsInOperation}
                      onChange={e => setFormData({...formData, yearsInOperation: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">GST Identification Number (GSTIN)</label>
                    <input 
                      type="text" 
                      className="input-field rounded-xl uppercase" 
                      placeholder="Optional but recommended for Gold Tier"
                      value={formData.gstNumber}
                      onChange={e => setFormData({...formData, gstNumber: e.target.value})}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Step 2: Documents */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-[#eae6de] rounded-[2rem] p-8 lg:p-10 shadow-soft">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-[#f8f7f4] rounded-xl flex items-center justify-center text-text-dark font-bold">02</div>
                  <h3 className="text-xl font-bold text-text-dark font-serif">Document Verification</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { id: 'businessCertUrl', label: 'Business Registration Certificate', desc: 'COI, Shop Act, or Udyam Aadhaar', required: true },
                    { id: 'ownerIdProofUrl', label: 'Owner Identity Proof', desc: 'Aadhaar Card or PAN Card (Front & Back)', required: true },
                    { id: 'tradeLicenseUrl', label: 'Trade License', desc: 'Current valid license copy', required: false },
                    { id: 'gstCertUrl', label: 'GST Certificate', desc: 'REG-06 Document', required: false },
                  ].map((doc, i) => (
                    <div key={doc.id} className="relative">
                      <p className="text-xs font-bold text-text-dark mb-1">{doc.label}{doc.required && <span className="text-brand-orange ml-1">*</span>}</p>
                      <p className="text-[10px] text-text-muted mb-4">{doc.desc}</p>
                      
                      <div className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center min-h-[160px] ${
                        formData[doc.id as keyof typeof formData] 
                          ? 'border-emerald-200 bg-emerald-50/30' 
                          : 'border-[#eae6de] hover:border-brand-green/30 hover:bg-[#f8f7f4]'
                      }`}>
                        {formData[doc.id as keyof typeof formData] ? (
                          <>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-emerald-600">Uploaded Successfully</span>
                            <button type="button" onClick={() => setFormData({...formData, [doc.id]: ''})} className="text-[9px] font-bold text-text-muted mt-2 underline hover:text-red-500">Remove</button>
                          </>
                        ) : (
                          <>
                            {isUploading === doc.id ? (
                              <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-slate-300 mb-3" />
                                <label className="cursor-pointer">
                                  <span className="px-4 py-2 bg-white text-text-dark border border-[#eae6de] rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm hover:bg-slate-50 transition-colors">Select File</span>
                                  <input type="file" className="hidden" accept="image/*,application/pdf" onChange={e => handleFileUpload(e, doc.id)} />
                                </label>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Submit Section */}
              <div className="flex items-center justify-between p-4 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-brand-orange" />
                    <p className="text-[10px] font-medium text-brand-orange">By submitting, you agree to the AgriLink Business Verification Policy.</p>
                 </div>
                 <button 
                  type="submit" 
                  disabled={isSubmitting || isUploading !== null}
                  className="px-8 py-4 bg-brand-green text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-green-hover transition-all flex items-center gap-3 disabled:opacity-50"
                 >
                    {isSubmitting ? 'Verifying Pipeline...' : 'Submit Verification Request'}
                    <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
