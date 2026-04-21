'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Link2, MapPin, User, CheckCircle, AlertTriangle, ArrowRight, X, Shield, FileText, Calendar, Percent, Briefcase } from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import FarmerSidebar from '@/components/FarmerSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);
const getWallet = (userId: string) => '0x' + Array.from(userId).map(c => c.charCodeAt(0).toString(16)).join('').padEnd(40, '0').slice(0, 40);

function AgreementModal({ partner, myProfile, onClose, onProposed }: { partner: any; myProfile: any; onClose: () => void; onProposed: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [myShare, setMyShare] = useState(50);
  const [duration, setDuration] = useState(12);
  const [showPreview, setShowPreview] = useState(false);

  const agreementText = `LAND INTEGRATION & PROFIT SHARING AGREEMENT

This Agreement is made on ${new Date().toLocaleDateString()} between:

PARTY 1 (Owner): ${myProfile.nameDisplay}
ID: ${myProfile.userId}
Land Survey: #${myProfile.surveyNumber}
Area: ${myProfile.totalExtentAcres} Acres

PARTY 2 (Partner): ${partner.nameDisplay}
ID: ${partner.userId}
Land Survey: #${partner.surveyNumber}
Area: ${partner.totalExtentAcres} Acres

TERMS OF INTEGRATION:
1. Operations: The parties agree to integrate agricultural operations for a period of ${duration} months.
2. Profit Sharing: Party 1 shall receive ${myShare}% and Party 2 shall receive ${100 - myShare}% of net proceeds.
3. Governance: Decisions regarding crop selection and inputs will be made mutually.
4. Blockchain Verification: This agreement is secured on the Polygon network and is legally binding upon digital signature.

DATE: ${new Date().toISOString()}
AGREEMENT HASH: [PENDING DEPLOYMENT]`;

  async function propose() {
    const password = window.prompt('Please enter your password to authorize this legal contract on the blockchain:');
    if (!password) return;

    setSubmitting(true);
    try {
      const blob = new Blob([agreementText], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', blob, 'land_agreement.txt');

      const ipfsRes = await fetch(`${API}/blockchain/ipfs/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const ipfsJson = await ipfsRes.json();
      if (!ipfsRes.ok) throw new Error(ipfsJson.error ?? 'IPFS failed');
      const cid = ipfsJson.data.cid;

      const now = Math.floor(Date.now() / 1000);
      const endTs = now + (duration * 30 * 24 * 3600);

      const contractPayload = {
        farmer1UserId: myProfile.userId,
        farmer1Name: myProfile.nameDisplay,
        farmer1Address: myProfile.ethAddress || getWallet(myProfile.userId),
        farmer1SurveyNumber: myProfile.surveyNumber,
        farmer1Centiacres: Math.round((myProfile.totalExtentAcres ?? 0) * 100),
        farmer1SharePercent: myShare,
        farmer2UserId: partner.userId,
        farmer2Name: partner.nameDisplay,
        farmer2Address: partner.ethAddress || getWallet(partner.userId),
        farmer2SurveyNumber: partner.surveyNumber,
        farmer2Centiacres: Math.round((partner.totalExtentAcres ?? 0) * 100),
        farmer2SharePercent: 100 - myShare,
        startTimestamp: now,
        endTimestamp: endTs,
        documentCid: cid,
        password: password
      };

      const res = await fetch(`${API}/blockchain/agreements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(contractPayload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to create agreement');

      toast.success('Contract generated and secured on-chain! ✓');
      onProposed();
    } catch (err: any) {
      console.error('Blockchain Propose Error:', err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2f2d29]/60 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#eae6de]">
        <div className="p-6 border-b border-[#f8f7f4] flex items-center justify-between bg-[#fdfcfb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-dark font-serif">Land Agreement</h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Smart Contract Generator</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f7f4] rounded-full transition-colors"><X className="w-5 h-5 text-text-muted" /></button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto bg-white">
          {!showPreview ? (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#f8f7f4] border border-[#eae6de]">
                <p className="text-[10px] text-brand-orange font-black uppercase tracking-widest mb-4">Partner Details</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green text-white flex items-center justify-center text-2xl font-bold font-serif shadow-lg shadow-brand-green/20">
                    {partner.nameDisplay?.[0]}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-dark">{partner.nameDisplay}</p>
                    <p className="text-text-muted text-sm font-medium">Village: {partner.village} | Survey: {partner.surveyNumber}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-text-muted font-black uppercase tracking-widest block ml-1">Your Revenue Share (%)</label>
                  <input type="number" value={myShare} onChange={e => setMyShare(Math.min(99, Math.max(1, parseInt(e.target.value) || 0)))} className="input-field py-4" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-text-muted font-black uppercase tracking-widest block ml-1">Partner Share (%)</label>
                  <input readOnly value={100 - myShare} className="input-field py-4 bg-[#f8f7f4]/50 opacity-60" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-text-muted font-black uppercase tracking-widest block ml-1">Contract Duration (Months)</label>
                <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="input-field py-4 appearance-none">
                  <option value="6">6 Months (Short Term)</option>
                  <option value="12">12 Months (Full Season)</option>
                  <option value="24">24 Months (Strategic)</option>
                </select>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-[#fcfcfc] border-2 border-[#eae6de] border-dashed rounded-3xl p-8 font-mono text-[13px] leading-relaxed text-text-dark shadow-inner max-h-[400px] overflow-y-auto">
                <pre className="whitespace-pre-wrap">{agreementText}</pre>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-blue-800 text-xs font-medium">Please review all terms. This document will be permanently stored on IPFS and indexed on the Polygon blockchain.</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-8 border-t border-[#f8f7f4] bg-[#fdfcfb] flex gap-4">
          {!showPreview ? (
            <button onClick={() => setShowPreview(true)} className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest">
              Review Legal Document
            </button>
          ) : (
            <>
              <button onClick={() => setShowPreview(false)} className="px-6 py-4 border border-[#eae6de] rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted hover:bg-white transition-all">
                Back to Edit
              </button>
              <button onClick={propose} disabled={submitting} className="btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-green/20">
                {submitting ? 'Verifying...' : 'Sign & Deploy to Chain'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function ViewAgreementModal({ agreement, onClose, onSign, signing }: { agreement: any; onClose: () => void; onSign: (id: string) => void; signing: string | null }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2f2d29]/60 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl border border-[#eae6de]">
        <div className="p-6 border-b border-[#f8f7f4] flex items-center justify-between bg-[#fdfcfb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-dark font-serif">Review Partnership Terms</h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Received Proposal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f7f4] rounded-full transition-colors"><X className="w-5 h-5 text-text-muted" /></button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto bg-white">
          <div className="p-6 rounded-3xl bg-[#f8f7f4] border border-[#eae6de]">
            <p className="text-[10px] text-brand-orange font-black uppercase tracking-widest mb-4">Agreement Details</p>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-text-dark">
              <div>
                <p className="text-text-muted text-[10px] uppercase font-bold mb-1">Proposer</p>
                <p>{agreement.farmer1Name}</p>
              </div>
              <div>
                <p className="text-text-muted text-[10px] uppercase font-bold mb-1">Your Share</p>
                <p>{agreement.farmer2SharePercent}%</p>
              </div>
            </div>
          </div>

          <div className="bg-[#fcfcfc] border-2 border-[#eae6de] border-dashed rounded-3xl p-8 font-mono text-[13px] leading-relaxed text-text-dark shadow-inner min-h-[200px]">
            <p className="italic text-text-muted mb-4 text-xs font-sans">[Legal document content fetched from IPFS CID: {agreement.documentCid.slice(0, 10)}...]</p>
            <p>This digital smart contract establishes a profit-sharing partnership between {agreement.farmer1Name} and {agreement.farmer2Name}. By counter-signing, you agree to the division of yields as specified above for the duration of the operational period.</p>
          </div>
        </div>

        <div className="p-8 border-t border-[#f8f7f4] bg-[#fdfcfb] flex gap-4">
          <button onClick={onClose} className="px-6 py-4 border border-[#eae6de] rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted hover:bg-white transition-all">
            Later
          </button>
          <button 
            onClick={() => onSign(agreement.agreementId)} 
            disabled={signing === agreement.agreementId} 
            className="btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-green/20"
          >
            {signing === agreement.agreementId ? 'Signing...' : 'Counter-Sign & Activate'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function IntegrationPage() {
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const { data: stats, isLoading: statsLoading, mutate: mutateStats } = useSWR(`${API}/farmer/stats`, fetcher);
  const { data: profile, isLoading: profileLoading } = useSWR(`${API}/farmer/profile`, fetcher);

  const { data: partnerResult, mutate: mutatePartners, isLoading: partnersLoading } = useSWR(
    stats?.readyToIntegrate ? `${API}/farmer/land/eligible-partners` : null,
    fetcher
  );

  const { data: agreementsResult, mutate: mutateAgreements, isLoading: agreementsLoading } = useSWR(
    profile?.userId ? `${API}/blockchain/agreements/user/${profile.ethAddress || getWallet(profile.userId)}` : null,
    fetcher
  );

  const partners = partnerResult ?? [];
  const myAgreements = agreementsResult?.agreements ?? [];

  const [enabling, setEnabling] = useState(false);
  const [signing, setSigning] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [viewingAgreement, setViewingAgreement] = useState<any>(null);

  if (authLoading || statsLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
      </div>
    );
  }

  const kycApproved = stats?.kycStatus === 'approved';
  const readyToIntegrate = stats?.readyToIntegrate;

  async function toggleIntegration(ready: boolean) {
    setEnabling(true);
    try {
      const res = await fetch(`${API}/farmer/land/ready-to-integrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ready })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed');
      toast.success(ready ? 'Your profile is now live!' : 'You are now offline');

      // Update local state without waiting for re-fetch
      await mutateStats();
      if (ready) await mutatePartners();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setEnabling(false);
    }
  }

  async function signAgreement(id: string) {
    const password = window.prompt('Please enter your password to counter-sign this legal agreement on the Polygon blockchain:');
    if (!password) return;

    setSigning(id);
    try {
      const res = await fetch(`${API}/blockchain/agreements/${id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          signerName: profile.nameDisplay,
          password: password
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to sign');
      toast.success('Agreement successfully activated on Polygon!');
      mutateAgreements();
      setViewingAgreement(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSigning(null);
    }
  }

  // ViewAgreementModal and AgreementModal are now top-level components

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <FarmerSidebar pageTitle="Land Integration" />
      <main className="lg:ml-72 p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header Section */}
          <div className="mb-12">
            <span className="text-brand-green font-bold text-xs uppercase tracking-wider mb-3 block">Blockchain Network</span>
            <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tight">
              Land Integration Hub
            </h2>
            <p className="text-text-muted font-medium text-sm mt-2 max-w-2xl">
              Digitally merge your agricultural operations with trusted neighbors using smart contracts.
              Create immutable land-sharing agreements secured on the Polygon network.
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {/* Status & Requirements */}
            {!kycApproved && (
              <div className="bg-[#fee2e2] border border-[#ef4444]/20 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 shadow-sm flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#991b1b] font-bold text-sm uppercase tracking-wider">KYC Verification Required</h3>
                  <p className="text-[#991b1b]/80 text-sm mt-1 leading-relaxed">
                    Your identity and land records must be verified by our administration team before you can propose or sign integration agreements.
                  </p>
                  <Link href="/dashboard/farmer/kyc" className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#991b1b] mt-3 hover:underline">
                    Complete Verification <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* How It Works - Cards */}
            <div className="bg-white rounded-3xl border border-[#eae6de] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-text-dark font-serif mb-6">Integration Pipeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: CheckCircle, title: 'Verified Identity', desc: 'Secure KYC validation of Aadhaar & RTC records.', color: 'green' },
                  { icon: Link2, title: 'Network Visibility', desc: 'Enable your profile to find neighbors in your village.', color: 'blue' },
                  { icon: Shield, title: 'Smart Contract', desc: 'Immutable agreement signed on the blockchain.', color: 'purple' },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] flex items-center justify-center mb-4 text-brand-green">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-text-dark font-bold text-sm font-serif mb-1">{item.title}</h4>
                    <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle Readiness */}
            {kycApproved && (
              <div className={`p-8 rounded-3xl border transition-all duration-300 ${readyToIntegrate ? 'bg-[#f0f9ff] border-blue-200' : 'bg-white border-[#eae6de] shadow-sm'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-dark font-serif">Participation Status</h3>
                    <p className="text-text-muted text-sm mt-1">
                      {readyToIntegrate
                        ? 'Your farm is currently visible to potential partners in your district.'
                        : 'Enable integration to discover neighbors and propose crop-sharing agreements.'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleIntegration(!readyToIntegrate)}
                    disabled={enabling}
                    className={`${readyToIntegrate ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-brand-green text-white hover:bg-brand-green-hover'} px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm transition-all flex items-center gap-2`}
                  >
                    {enabling ? 'Processing...' : readyToIntegrate ? 'Go Offline' : 'Enable Network'}
                    {!enabling && !readyToIntegrate && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Discovery Section */}
          {readyToIntegrate && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-text-dark font-serif">Discovery Results</h3>
                  <p className="text-text-muted text-sm mt-1">Found {partners.length} verified farmers matching your land profile.</p>
                </div>
                <div className="h-px bg-[#eae6de] flex-1 ml-8" />
              </div>

              {partners.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#eae6de] p-16 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-3xl bg-[#f8f7f4] flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-text-dark font-bold text-xl font-serif">No partners found nearby</h4>
                  <p className="text-text-muted text-sm mt-2 max-w-sm mx-auto">
                    We couldn't find any other farmers in {profile?.district} who have enabled integration yet. Check back later!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((p: any, i: number) => (
                    <motion.div
                      key={p.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-3xl border border-[#eae6de] p-6 shadow-sm hover:border-brand-green/30 transition-all group"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#f8f7f4] text-brand-green flex items-center justify-center text-xl font-bold font-serif group-hover:bg-brand-green group-hover:text-white transition-all">
                          {p.nameDisplay?.[0] ?? '?'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-text-dark font-bold truncate group-hover:text-brand-green transition-colors">{p.nameDisplay || 'Verified Farmer'}</h4>
                          <p className="text-text-muted text-xs truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {p.village}, {p.district}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 bg-[#f8f7f4] rounded-xl border border-[#eae6de]">
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-wider mb-1">Land Size</p>
                          <p className="text-sm font-bold text-text-dark">{p.totalExtentAcres ?? '—'} Acres</p>
                        </div>
                        <div className="p-3 bg-[#f8f7f4] rounded-xl border border-[#eae6de]">
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-wider mb-1">Status</p>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <p className="text-sm font-bold text-text-dark text-[11px]">Ready</p>
                          </div>
                        </div>
                      </div>

                      {(() => {
                        const existing = myAgreements?.find((a: any) => 
                          a.farmer1UserId === p.userId || a.farmer2UserId === p.userId
                        );
                        
                        if (existing) {
                          return (
                            <div className="flex items-center gap-2 px-6 py-3 bg-[#f8f7f4] rounded-2xl border border-[#eae6de]">
                              <div className={`w-2 h-2 rounded-full ${existing.status === 2 ? 'bg-brand-green' : 'bg-brand-orange animate-pulse'}`} />
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                                {existing.status === 2 ? 'Active Partner' : 'Proposal Pending'}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <button
                            onClick={() => setSelectedPartner(p)}
                            className="w-full py-3 bg-[#f6f3eb] text-brand-green border border-[#eae6de] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-green hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                          >
                            Propose Agreement <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        );
                      })()}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Agreements */}
          {myAgreements.length > 0 && (
            <div className="mt-12 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-text-dark font-serif">Integrations & Governance</h3>
                <div className="h-px bg-[#eae6de] flex-1 ml-8" />
              </div>

              <div className="space-y-4">
                {myAgreements.map((agr: any) => {
                  const isInitiator = agr.farmer1UserId === profile?.userId;
                  const partnerName = isInitiator ? agr.farmer2Name : agr.farmer1Name;
                  const isPending = agr.status === 1;
                  const isActive = agr.status === 2;
                  const needsMySignature = isPending && agr.creator !== getWallet(profile?.userId);

                  return (
                    <div key={agr.agreementId} className="bg-white rounded-3xl border border-[#eae6de] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${isActive ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-text-dark font-bold font-serif">Integration with {partnerName}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">ID: {agr.agreementId.slice(0, 8)}</span>
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {isActive ? 'Active' : 'Awaiting Signatures'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${agr.documentCid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-brand-green hover:underline flex items-center gap-2"
                        >
                          View Terms <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg]" />
                        </a>
                        {agr.status === 1 && agr.farmer2UserId === profile?.userId && (
                          <button
                            onClick={() => setViewingAgreement(agr)}
                            className="px-6 py-2 bg-brand-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green-hover transition-all shadow-md shadow-brand-green/20 flex items-center gap-2"
                          >
                            Review &amp; Sign <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedPartner && (
          <AgreementModal 
            partner={selectedPartner} 
            myProfile={profile} 
            onClose={() => setSelectedPartner(null)} 
            onProposed={() => {
              setSelectedPartner(null);
              mutateAgreements();
            }} 
          />
        )}

        {viewingAgreement && (
          <ViewAgreementModal 
            agreement={viewingAgreement} 
            onClose={() => setViewingAgreement(null)} 
            onSign={signAgreement}
            signing={signing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
