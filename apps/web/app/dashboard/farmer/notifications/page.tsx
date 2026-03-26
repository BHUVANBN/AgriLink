'use client';

import { motion } from 'framer-motion';
import { Bell, BellOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FarmerSidebar from '@/components/FarmerSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function NotificationsPage() {
  const { isLoading } = useRequireAuth('farmer');

  if (isLoading) return <div className="min-h-screen bg-[#0a0f1e] flex" />;

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <FarmerSidebar pageTitle="Notifications" />
      <main className="lg:ml-72 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 flex items-center gap-4">
              <Link href="/dashboard/farmer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h2 className="text-2xl font-black text-white">Notifications</h2>
                <p className="text-slate-400 text-sm mt-1">Stay updated with KYC status, market alerts, and orders</p>
              </div>
            </div>

            <div className="glass-card p-16 text-center border-dashed border-white/10">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4">
                <BellOff className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-white font-bold text-lg">No new notifications</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                We'll notify you here when your KYC is reviewed or when market prices for your crops change significantly.
              </p>
            </div>
          </motion.div>
      </main>
    </div>
  );
}
