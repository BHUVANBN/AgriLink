'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, pageTitle }: { children: React.ReactNode; pageTitle: string }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-red-500/30 selection:text-red-500">
      <AdminSidebar pageTitle={pageTitle} />
      
      <main className="lg:ml-72 min-h-screen flex flex-col relative">
          {/* Subtle background ambient glow */}
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative z-10">
             <motion.div
               key={pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
             >
                {children}
             </motion.div>
          </div>
          
          <footer className="mt-auto p-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40 border border-white/10">V2</div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">AgriLink Protocol // Admin Node Stable</p>
             </div>
             <div className="flex items-center gap-8">
                <a href="#" className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">Emergency Protocol</a>
                <a href="#" className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">Audit Ledger</a>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest border-l border-white/5 pl-8 italic">Encrypted Connection Ready</p>
             </div>
          </footer>
      </main>
    </div>
  );
}
