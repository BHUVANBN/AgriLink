'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Leaf, BarChart3, FileCheck, ShoppingBag, 
  MapPin, TrendingUp, TrendingDown, ChevronRight, Upload,
  AlertTriangle, Clock, Activity, CloudRain, Sprout, ArrowRight, Maximize2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import FarmerSidebar from '@/components/FarmerSidebar';
import WeatherWidget from '@/components/WeatherWidget';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const GlobalDiscoveryMap = dynamic(() => import('@/components/GlobalDiscoveryMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-3xl" />
});

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async r => {
    if (!r.ok) {
      const error = new Error('API Error');
      (error as any).status = r.status;
      try { (error as any).info = await r.json(); } catch { }
      throw error;
    }
    return r.json().then(d => d.data);
  });

function KycBanner({ profile }: { profile: any }) {
  if (!profile || profile.kycStatus === 'approved') return null;

  const config: Record<string, { color: string, bg: string, border: string, text: string, icon: any; msg: string; action?: string; href?: string }> = {
    not_started: { color: 'orange', bg: 'bg-[#fef3c7]', border: 'border-[#f59e0b]/20', text: 'text-[#92400e]', icon: AlertTriangle, msg: 'Complete your KYC to unlock full trading platform features', action: 'Verify Now', href: '/dashboard/farmer/kyc' },
    partially_uploaded: { color: 'blue', bg: 'bg-[#dbeafe]', border: 'border-[#3b82f6]/20', text: 'text-[#1e3a8a]', icon: Upload, msg: 'Some documents are missing. Please complete your profile.', action: 'Continue', href: '/dashboard/farmer/kyc' },
    submitted: { color: 'green', bg: 'bg-[#d1fae5]', border: 'border-[#10b981]/20', text: 'text-[#065f46]', icon: Clock, msg: 'Verification in progress. We will notify you once approved.' },
    rejected: { color: 'red', bg: 'bg-[#fee2e2]', border: 'border-[#ef4444]/20', text: 'text-[#991b1b]', icon: AlertTriangle, msg: `Verification failed: ${profile.kycRejectionReason ?? 'Docs unclear'}.`, action: 'Review', href: '/dashboard/farmer/kyc' },
  };

  const c = config[profile.kycStatus] || config.not_started;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${c.bg} ${c.border} border p-4 rounded-2xl flex items-center gap-4 mb-8 shadow-sm`}
    >
      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${c.text}`}>
        <c.icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className={`${c.text} text-sm font-bold`}>{c.msg}</p>
      </div>
      {c.action && c.href && (
        <Link href={c.href} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-700 hover:bg-slate-50 transition-colors">
          {c.action}
        </Link>
      )}
    </motion.div>
  );
}

function StatCard({ label, value, subtext, icon: Icon, color }: any) {
  const colors: any = {
    green: 'bg-[#f6f3eb] text-brand-green border-brand-green/10',
    blue: 'bg-[#dbeafe] text-[#3b82f6] border-[#3b82f6]/20',
    amber: 'bg-[#fef3c7] text-brand-orange border-brand-orange/10',
    purple: 'bg-[#ede9fe] text-[#7c3aed] border-[#7c3aed]/20'
  }
  
  return (
    <div className={`p-6 rounded-2xl border ${colors[color] || colors.green} flex flex-col justify-between h-44 shadow-sm group hover:scale-[1.02] transition-transform`}>
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">{label}</h4>
        <p className="text-3xl font-bold text-text-dark font-serif tracking-tight">{value}</p>
        <p className="text-xs font-semibold text-text-muted mt-2 flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-brand-green" />
          {subtext}
        </p>
      </div>
    </div>
  );
}

function PriceCard({ crop, price, trend, unit }: any) {
  return (
    <div className="bg-[#f8f7f4] rounded-xl p-4 border border-[#eae6de] group hover:bg-white hover:shadow-md transition-all cursor-pointer">
      <div className="flex justify-between items-center mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#d1fae5] text-[#065f46] flex items-center justify-center font-bold text-xs">
          {crop[0]}
        </div>
        <div className={`flex items-center gap-1 font-bold text-[10px] uppercase ${
          trend === 'rising' ? 'text-brand-green' : trend === 'falling' ? 'text-red-500' : 'text-text-muted'
        }`}>
          {trend === 'rising' ? <TrendingUp className="w-3 h-3" /> : trend === 'falling' ? <TrendingDown className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <h5 className="text-sm font-bold text-text-dark capitalize mb-1">{crop}</h5>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-text-dark">₹{price?.toLocaleString('en-IN')}</span>
        <span className="text-[10px] font-bold text-text-muted uppercase">/{unit}</span>
      </div>
    </div>
  );
}

function AIInsightCard() {
  return (
    <div className="p-1 rounded-3xl bg-gradient-to-br from-brand-green/20 via-brand-orange/10 to-brand-green/5">
      <div className="bg-white/80 backdrop-blur-md rounded-[22px] p-8 h-full border border-white/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-text-dark font-serif">AgriLink Insights</h3>
        </div>
        <p className="text-text-muted text-sm leading-relaxed mb-8 font-medium">
          Based on recent soil moisture (18%) and upcoming rain forecasts, we recommend planting Ragi between March 28-30.
        </p>
        <button className="flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-orange/80 transition-colors group">
          View Soil Analysis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const router = useRouter();
  const { data: profile, error, isLoading: profileLoading } = useSWR(`${API}/farmer/profile`, fetcher);
  const { data: stats, isLoading: statsLoading } = useSWR(`${API}/farmer/stats`, fetcher);
  const { data: weatherData, isLoading: weatherLoading } = useSWR(`${API}/farmer/weather`, fetcher);
  const { data: allLands, isLoading: landsLoading } = useSWR(`${API}/farmer/land/all-boundaries`, fetcher);

  const isLoading = authLoading || profileLoading;

  useEffect(() => {
    // Only redirect if SWR explicitly returns a 401 Unauthorized error
    if (!isLoading && error?.status === 401) {
      router.push('/auth/login');
    }
  }, [isLoading, error, router]);

  if (isLoading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="animate-pulse text-brand-green font-bold text-center">Opening AgriLink Farmer Hub...<br/><span className="text-[10px] uppercase opacity-50 font-sans tracking-widest">Farmer Portal V2.0</span></div></div>;
  
  if (error && error.status !== 401) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
        </div>
        <h1 className="text-2xl font-bold text-text-dark font-serif mb-2">Service Temporarily Unavailable</h1>
        <p className="text-text-muted text-sm max-w-xs mb-8">
          The AgriLink backend is currently having issues (Error {error.status}). Our engineers are on it!
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Reloading
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <FarmerSidebar pageTitle="Overview" />
      
      <main className="lg:ml-72 p-6 lg:p-8">
        {/* Verification Status */}
        <KycBanner profile={{ kycStatus: stats?.kycStatus, kycRejectionReason: profile?.kycRejectionReason }} />

        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-brand-green font-bold text-xs uppercase tracking-wider mb-3 block">Dashboard Overview</span>
            <h2 className="text-4xl font-bold text-text-dark font-serif">
              Namaskara, {profile?.nameDisplay || 'Farmer'}! 👋
            </h2>
            <p className="text-text-muted font-medium text-sm mt-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-green" />
              {profile?.village 
                ? `Monitoring land profiles in ${profile.village}, ${profile.hobli}, ${profile.district}` 
                : 'Welcome to AgriLink. Complete your profile to get personalized insights.'
              }
            </p>
          </motion.div>
          
          <div className="flex gap-3">
             <a 
                href="https://rdservices.karnataka.gov.in/BhoomiMaps/" 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-2.5 bg-[#f6f3eb] border border-[#eae6de] rounded-xl text-xs font-bold text-brand-green hover:bg-brand-green hover:text-white transition-all shadow-sm flex items-center gap-2"
             >
                <MapPin className="w-3.5 h-3.5" /> Get RTC from Bhoomi
             </a>
             <button 
                onClick={() => {
                  if (profile?.rtcCloudUrl) {
                    window.open(profile.rtcCloudUrl, '_blank');
                  } else {
                    toast.error('No verified RTC found. Please complete land mapping.');
                  }
                }}
                className="px-5 py-2.5 bg-white border border-[#eae6de] rounded-xl text-xs font-bold text-text-muted hover:bg-[#f8f7f4] transition-all shadow-sm flex items-center gap-2"
             >
                <Upload className="w-3.5 h-3.5" /> Download RTC
             </button>
             <Link href="/dashboard/farmer/integration" className="px-5 py-2.5 bg-brand-green text-white rounded-xl text-xs font-bold hover:bg-brand-green-hover transition-all shadow-md shadow-brand-green/20">
                New Integration
             </Link>
          </div>
        </div>


        {/* Operational Row: Critical Tasks (Horizontal) */}
        <div className="mb-12">
           <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Operational Pipeline</h3>
              <div className="h-px bg-[#eae6de] flex-1 ml-6" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             {[
               { icon: Upload, label: 'RTC Mapping', desc: 'Secure blockchain registry', href: '/dashboard/farmer/kyc' },
               { icon: Leaf, label: 'Incentive Match', desc: 'Govt subsidies hub', href: '/dashboard/farmer/schemes' },
               { icon: ShoppingBag, label: 'Marketplace', desc: 'Supplier gateway', href: '/dashboard/farmer/marketplace' },
             ].map(a => (
               <Link key={a.href} href={a.href} className="group p-6 rounded-2xl bg-white border border-[#eae6de] hover:border-brand-green/30 hover:shadow-lg hover:shadow-brand-green/5 transition-all relative overflow-hidden flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-[#f8f7f4] flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-white transition-all text-text-muted">
                    <a.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-text-dark font-bold text-lg group-hover:text-brand-green transition-colors font-serif">{a.label}</h4>
                  <p className="text-text-muted text-xs mt-1 font-medium leading-relaxed">{a.desc}</p>
                  <ArrowRight className="absolute bottom-6 right-6 w-4 h-4 text-brand-green opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
               </Link>
             ))}
           </div>
        </div>

        {/* Intelligence Hub: Weather & GIS Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch mb-12">
            {/* Weather - Compact Focus */}
            <div className="lg:col-span-1">
               <WeatherWidget weather={weatherData} isLoading={weatherLoading} />
            </div>

            {/* Geospatial View / Intelligence Map */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-[#eae6de] shadow-sm overflow-hidden flex flex-col min-h-[500px] relative group">
               <div className="p-6 border-b border-[#f8f7f4] flex items-center justify-between bg-white relative z-10">
                  <div>
                     <h3 className="text-xl font-bold text-text-dark font-serif">Property Geospatial Insight</h3>
                     <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">
                        {profile?.surveyNumber ? `Survey #${profile.surveyNumber} Digital Twin` : 'Geospatial mapping pending'}
                     </p>
                  </div>
                  <Link href="/dashboard/farmer/land" className="px-4 py-2 bg-[#f6f3eb] text-brand-green rounded-xl text-xs font-bold hover:bg-brand-green hover:text-white transition-all flex items-center gap-2">
                     <Maximize2 className="w-3.5 h-3.5" /> Full GIS View
                  </Link>
               </div>
                           <div className="flex-1 bg-[#f8f7f4] relative flex items-center justify-center overflow-hidden">
                   {allLands && allLands.length > 0 ? (
                     <GlobalDiscoveryMap 
                       currentUserId={profile.userId} 
                       allLands={allLands} 
                     />
                  ) : (
                    <>
                      {/* Map Placeholder with visual polish */}
                      <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/0,0,1/600x600?access_token=none')] bg-cover grayscale" />
                      <div className="relative z-10 flex flex-col items-center text-center p-12">
                         <div className="w-20 h-20 rounded-3xl bg-white shadow-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MapPin className="w-10 h-10 text-brand-green" />
                         </div>
                         <h4 className="text-text-dark font-serif font-bold text-2xl mb-2">Initialize Land Digital Twin</h4>
                         <p className="text-text-muted text-sm max-w-sm mb-8 font-medium">Trace your land boundaries to secure property records and enable neighbor-integrated trading pipelines.</p>
                         <Link href="/dashboard/farmer/land" className="btn-primary flex items-center gap-2">
                            Start Digital Mapping <ArrowRight className="w-4 h-4" />
                         </Link>
                      </div>
                    </>
                  )}
                  
                  {/* Status Indicator */}
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#eae6de] flex items-center gap-3 shadow-xl z-20">
                     <div className={`w-2 h-2 rounded-full animate-pulse ${profile?.surveyNumber ? 'bg-brand-green' : 'bg-amber-500'}`} />
                     <span className="text-[9px] font-black uppercase tracking-widest text-text-dark">
                       {profile?.surveyNumber ? 'Satellite Active' : 'GIS Sync Required'}
                     </span>
                  </div>
               </div>
            </div>
        </div>
      </main>
    </div>
  );
}
