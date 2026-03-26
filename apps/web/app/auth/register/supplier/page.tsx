'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, EyeOff, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function RegisterSupplier() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [userId, setUserId] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: ''
  });
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');



  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be 8+ chars'); return; }

    setLoading(true);
    try {
      const body = { companyName: form.name, email: form.email, phone: form.phone, password: form.password };
      const res = await fetch(`${API}/auth/register/supplier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.details ? Object.values(data.details).flat()[0] : (data.error ?? 'Registration failed');
        toast.error(msg as string);
        return;
      }

      setUserId(data.data.userId);
      toast.success(`OTP sent to ${form.email}`);
      setStep('verify');
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) { setOtpError('OTP must be 6 digits'); return; }
    setOtpError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp }),
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error ?? 'Invalid OTP');
        return;
      }

      toast.success('Identity verified!');
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch {
      setOtpError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans flex flex-col selection:bg-brand-orange/20">
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
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#fbfbf9] rounded-xl p-10 border border-[#eae6de] shadow-[0_12px_40px_rgba(0,0,0,0.06)] max-w-[420px] w-full"
        >
          {step === 'form' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-[26px] font-serif text-text-dark mb-2">Create Supplier Account</h2>
                <p className="text-[#84827c] text-xs">
                  Enter your details to join the AgriLink ecosystem.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-text-dark mb-1.5 ml-1">Company Name</label>
                  <input
                    className="input-field"
                    placeholder="Rajesh Traders"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-serif text-text-dark mb-1.5 ml-1">Email</label>
                  <input 
                    className="input-field" 
                    type="email" 
                    placeholder="rajesh@rajeshtraders.in" 
                    value={form.email} 
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-text-dark mb-1.5 ml-1">Business Phone</label>
                  <input 
                    className="input-field" 
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    value={form.phone} 
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                    required 
                    pattern="^[+]?[0-9\s-]+$" 
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-serif text-text-dark mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <input 
                      className="input-field pr-12 focus:border-brand-orange focus:ring-brand-orange" 
                      type={showPass ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      value={form.password} 
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loading} className="btn-secondary w-full !py-3">
                    {loading ? 'Creating Account...' : 'Register as Supplier'}
                  </button>
                </div>
              </form>

              <p className="text-[#84827c] text-xs text-center mt-6">
                Already have an account? <Link href="/auth/login" className="text-text-dark font-medium underline decoration-[#dfdcd5] underline-offset-4 hover:decoration-brand-orange transition-colors">Log in</Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-[26px] font-serif text-text-dark mb-2">Check Email</h2>
                <p className="text-[#84827c] text-xs leading-relaxed">
                  We've sent a 6-digit verification code to
                  <br />
                  <span className="text-text-dark font-medium">{form.email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <input
                    className={`w-full bg-transparent border-b-2 text-center text-3xl font-medium tracking-[0.4em] outline-none transition-all pb-2 ${otpError ? 'border-red-400 text-red-900' : 'border-[#dfdcd5] text-text-dark focus:border-brand-orange'}`}
                    placeholder="000000"
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
                    maxLength={6}
                    autoFocus
                    required
                  />
                  {otpError && <p className="text-red-500 text-xs font-medium mt-2 text-center">{otpError}</p>}
                </div>

                <button type="submit" disabled={loading || otp.length !== 6} className="btn-secondary w-full !py-3">
                  {loading ? 'Verifying...' : 'Confirm Identity'}
                </button>

                <div className="text-center pt-2">
                  <button type="button" className="text-text-muted text-xs hover:text-text-dark transition-colors">
                    Didn't receive code? Resend
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </main>

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