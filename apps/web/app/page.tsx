'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Shield, TrendingUp, Wrench, FileText, Users, CheckCircle, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-green/20">
      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-green/10">
        <div className="mx-auto px-6 h-20 flex items-center justify-between max-w-[1400px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-green">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.44 3.23a4 4 0 00-6.16 5.1L5.59 9a1 1 0 000 1.41l3.54 3.54a1 1 0 001.41 0l.69-.69A4 4 0 0016.33 7.1L12.44 3.23zM9.61 6.77a2 2 0 112.83 2.83l-2.83-2.83z" fill="currentColor"/>
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M10.83 13.66a5 5 0 006.36 5.66l2.12-2.12a5 5 0 00-5.66-6.36" />
            </svg>
            <span className="font-serif font-bold text-xl text-brand-green tracking-wide">AgriLink</span>
          </Link>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-[13px] tracking-wide font-medium text-text-muted">
            <Link href="/marketplace" className="hover:text-brand-green transition-colors">Marketplace</Link>
            <Link href="#features" className="hover:text-brand-green transition-colors">Features</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-[13px] font-bold text-text-dark hover:text-brand-green transition-colors">
              Log In
            </Link>
            <Link href="/auth/register" className="btn-primary py-2 px-5 !text-[13px] !rounded">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative h-[calc(100vh-80px)] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2500")' }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#1c2720]/50" />

        <div className="relative z-10 text-center max-w-5xl px-6 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-[78px] font-serif text-white leading-[1.1] mb-8 text-center font-bold"
          >
            A New Era of Smart Agriculture
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#e2ded9] text-lg md:text-xl mb-12 max-w-3xl text-center font-light leading-relaxed"
          >
            Our platform is built on cutting-edge technology to empower every stakeholder in the agricultural ecosystem.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link href="/marketplace" className="btn-secondary !text-[14px] !px-10 !py-4 !rounded-lg group shadow-lg hover:shadow-xl transition-all duration-300">
              Explore the Marketplace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg text-[14px] font-medium transition-all duration-200 bg-[#a3b3a7]/90 text-[#1e3025] hover:bg-[#a3b3a7] shadow-lg hover:shadow-xl">
              Register
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-brand-bg relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-[48px] font-serif text-text-dark mb-6">Features</h2>
            <p className="text-[#69665f] text-lg max-w-3xl mx-auto leading-relaxed">
              Powerful tools designed to transform your agricultural experience with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Blockchain Land Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 border border-[#eae6de] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-serif text-text-dark mb-3">Blockchain Land Integration</h3>
              <p className="text-[#69665f] text-sm leading-relaxed">
                Securely pool land with neighbors using smart contracts, increasing yield potential and fostering trust.
              </p>
            </motion.div>

            {/* AI Crop Price Prediction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-8 border border-[#eae6de] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="text-xl font-serif text-text-dark mb-3">AI Crop Price Prediction</h3>
              <p className="text-[#69665f] text-sm leading-relaxed">
                Leverage AI to forecast crop prices based on historical data and location, enabling smarter selling decisions.
              </p>
            </motion.div>

            {/* Smart Equipment Marketplace */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 border border-[#eae6de] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mb-6">
                <Wrench className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-serif text-text-dark mb-3">Smart Equipment Marketplace</h3>
              <p className="text-[#69665f] text-sm leading-relaxed">
                Access a wide range of agricultural tools and machinery, from manual implements to smart, GPS-enabled equipment.
              </p>
            </motion.div>

            {/* Govt. Scheme Discovery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-8 border border-[#eae6de] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="text-xl font-serif text-text-dark mb-3">Govt. Scheme Discovery</h3>
              <p className="text-[#69665f] text-sm leading-relaxed">
                Automatically find and get notified about government schemes applicable to you based on your land and profile.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ────────────────────────────── */}
      <section className="py-24 px-6 bg-[#faf8f3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-[48px] font-serif text-text-dark mb-6">How It Works</h2>
            <p className="text-[#69665f] text-lg max-w-3xl mx-auto leading-relaxed">
              A simple, streamlined process to get you started on your journey to smarter farming
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-serif text-text-dark mb-4">Register & Verify</h3>
              <p className="text-[#69665f] text-sm leading-relaxed">
                Sign up as a farmer or supplier and complete a simple, secure KYC process by uploading your documents.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-serif text-text-dark mb-4">Integrate or Shop</h3>
              <p className="text-[#69665f] text-sm leading-relaxed">
                Either integrate your land with neighboring farmers or browse our marketplace for equipment and supplies.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-serif text-text-dark mb-4">Grow & Prosper</h3>
              <p className="text-[#69665f] text-sm leading-relaxed">
                Access AI insights, secure transactions, and government schemes to maximize your agricultural success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-brand-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-[48px] font-serif text-text-dark mb-6">Ready to Transform Your Farm?</h2>
          <p className="text-[#69665f] text-lg mb-10 leading-relaxed">
            Join thousands of farmers who are already using AgriLink to optimize their agricultural operations
          </p>
          <Link href="/auth/register" className="btn-primary !text-[16px] !px-12 !py-4 !rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Register Now
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#1e293b] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-green">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.44 3.23a4 4 0 00-6.16 5.1L5.59 9a1 1 0 000 1.41l3.54 3.54a1 1 0 001.41 0l.69-.69A4 4 0 0016.33 7.1L12.44 3.23zM9.61 6.77a2 2 0 112.83 2.83l-2.83-2.83z" fill="currentColor"/>
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M10.83 13.66a5 5 0 006.36 5.66l2.12-2.12a5 5 0 00-5.66-6.36" />
                </svg>
                <span className="font-serif font-bold text-xl text-brand-green tracking-wide">AgriLink</span>
              </div>
              <p className="text-[#94a3b8] text-sm leading-relaxed mb-6 max-w-md">
                Empowering farmers with cutting-edge technology to create a sustainable agricultural future.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/marketplace" className="text-[#94a3b8] hover:text-white text-sm transition-colors">Marketplace</Link></li>
                <li><Link href="/features" className="text-[#94a3b8] hover:text-white text-sm transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-[#94a3b8] hover:text-white text-sm transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="text-[#94a3b8] hover:text-white text-sm transition-colors">Integrations</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-[#94a3b8] hover:text-white text-sm transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-[#94a3b8] hover:text-white text-sm transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-[#94a3b8] hover:text-white text-sm transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="text-[#94a3b8] hover:text-white text-sm transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#334155] pt-8 text-center">
            <p className="text-[#94a3b8] text-sm">
              © 2024 AgriLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
