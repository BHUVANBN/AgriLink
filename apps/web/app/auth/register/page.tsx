'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, ArrowRight, Wrench } from 'lucide-react';

export default function RegisterRoleSelection() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans flex flex-col selection:bg-brand-green/20">
      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="w-full relative z-50 border-b border-[#dfdcd5]/30">
        <div className="mx-auto px-6 h-20 flex items-center justify-between max-w-[1400px]">
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-green group-hover:scale-110 transition-transform">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.44 3.23a4 4 0 00-6.16 5.1L5.59 9a1 1 0 000 1.41l3.54 3.54a1 1 0 001.41 0l.69-.69A4 4 0 0016.33 7.1L12.44 3.23zM9.61 6.77a2 2 0 112.83 2.83l-2.83-2.83z" fill="currentColor"/>
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M10.83 13.66a5 5 0 006.36 5.66l2.12-2.12a5 5 0 00-5.66-6.36" />
            </svg>
            <span className="font-serif font-bold text-xl text-brand-green tracking-wide">AgriLink</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] tracking-wide font-bold text-text-muted">
            <Link href="/marketplace" className="hover:text-brand-green transition-colors">Marketplace</Link>
            <Link href="/#features" className="hover:text-brand-green transition-colors">Features</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-[13px] font-bold text-text-dark hover:text-brand-green transition-colors">
              Log In
            </Link>
            <Link href="/auth/register" className="btn-primary py-2 px-5 !text-[12px] !rounded-full !font-black uppercase tracking-widest shadow-lg shadow-brand-green/20">
              Register
            </Link>
            <button className="p-2.5 border border-[#dfdcd5] rounded-full text-text-dark hover:bg-brand-green hover:text-white transition-all">
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page Content ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif text-text-dark mb-6 font-bold"
          >
            Join AgriLink
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#69665f] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Choose your role to get started. Are you looking to grow, or to provide the tools for growth?
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* Farmer Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl p-10 border border-[#eae6de] shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col h-full relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-brand-green/10 rounded-xl flex items-center justify-center mb-6">
                <Check className="w-7 h-7 text-brand-green" />
              </div>
              <h3 className="text-2xl font-serif text-text-dark mb-4 font-semibold">Register as a Farmer</h3>
              <p className="text-[#69665f] text-base leading-relaxed mb-8">
                Join our community to integrate your land, access smart tools, and leverage AI for better yields.
              </p>
              
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Securely pool land with neighbors',
                  'Access AI-powered crop insights',
                  'Discover relevant government schemes'
                ].map((item, index) => (
                  <motion.li 
                    key={item} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 text-[#69665f] text-base"
                  >
                    <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Link href="/auth/register/farmer" className="btn-primary w-full group !py-4 !text-base !rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Register as Farmer
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Supplier Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl p-10 border border-[#eae6de] shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col h-full relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-6">
                <Wrench className="w-7 h-7 text-brand-orange" />
              </div>
              <h3 className="text-2xl font-serif text-text-dark mb-4 font-semibold">Register as a Supplier</h3>
              <p className="text-[#69665f] text-base leading-relaxed mb-8">
                List your agricultural equipment and supplies on our marketplace to reach a wider audience of farmers.
              </p>
              
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Showcase your products to verified farmers',
                  'Easy-to-use product listing tools',
                  'Secure payment processing'
                ].map((item, index) => (
                  <motion.li 
                    key={item} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 text-[#69665f] text-base"
                  >
                    <Check className="w-5 h-5 text-brand-orange mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Link href="/auth/register/supplier" className="btn-secondary w-full group !py-4 !text-base !rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Register as Supplier
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        <p className="text-[#84827c] text-[13px] mt-12 text-center">
          Already have an account? <Link href="/auth/login" className="text-brand-green font-medium hover:underline">Log in here</Link>
        </p>
      </main>

      {/* Very subtle footer elements aligned with original image */}
      <footer className="w-full max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between text-[11px] font-bold text-[#b5b2aa] uppercase tracking-widest border-t border-[#dfdcd5]/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#dfdcd5]/50 flex items-center justify-center text-text-dark border border-[#dfdcd5]">N</div>
          <span>AgriLink</span>
        </div>
        <div className="hidden sm:flex gap-16">
          <span>Platform</span>
          <span>Company</span>
        </div>
      </footer>
    </div>
  );
}
