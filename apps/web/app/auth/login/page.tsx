'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { mutate } from 'swr';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unverifiedUserId, setUnverifiedUserId] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'EMAIL_NOT_VERIFIED') {
          setUnverifiedUserId(data.userId ?? null);
          toast.error('Please verify your email first');
          return;
        }
        toast.error(data.error ?? 'Login failed');
        return;
      }

      // ─ Fix for "double login" bug ───────────────────────────
      // Tell SWR to re-fetch /auth/me globally so dashboard doesn't use cached 401
      await mutate(`${API}/auth/me`);

      const role = data.data.user.role;
      toast.success(`Welcome back, ${data.data.user.displayName}!`);

      if (role === 'farmer') router.push('/dashboard/farmer');
      else if (role === 'supplier') router.push('/dashboard/supplier');
      else if (role === 'admin') router.push('/admin');
      else router.push('/');
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      {/* Back Link */}
      <Link 
        href="/" 
        className="fixed top-8 left-8 flex items-center gap-2 text-text-muted hover:text-brand-green font-semibold text-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 justify-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center shadow-lg shadow-brand-green/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-text-dark font-serif">AgriLink</span>
        </Link>

        <div className="bg-white rounded-2xl p-10 shadow-xl border border-[#eae6de]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-dark mb-2 font-serif tracking-tight">Welcome back</h1>
            <p className="text-text-muted text-sm font-medium">Log in to manage your AgriLink profile</p>
          </div>

          {/* Email not verified prompt */}
          {unverifiedUserId && (
            <div className="bg-[#fef3c7] border border-[#f59e0b]/20 rounded-xl p-5 mb-8">
              <p className="text-[#92400e] text-sm font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                Action Required
              </p>
              <p className="text-[#78350f]/80 text-xs mb-4 leading-relaxed font-medium">
                Your email is not verified. Please verify your identity to continue.
              </p>
              <button
                onClick={async () => {
                  const res = await fetch(`${API}/auth/resend-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: unverifiedUserId }),
                  });
                  if (res.ok) toast.success('A new OTP has been sent to your email');
                  else toast.error('Failed to resend OTP — please try later');
                }}
                className="w-full py-3 bg-white border border-[#f59e0b]/20 text-[#92400e] text-xs font-bold rounded-xl hover:bg-[#fef3c7] transition-colors"
              >
                Resend Verification Code
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  className="input-field pl-12"
                  type="email"
                  placeholder="e.g. farmer@agrilink.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-bold text-brand-green hover:text-brand-green-hover">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  className="input-field pl-12 pr-12"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 mt-4 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>Sign in to Account <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-8 font-medium">
            New to AgriLink?{' '}
            <Link href="/auth/register" className="text-brand-green hover:underline font-bold">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
