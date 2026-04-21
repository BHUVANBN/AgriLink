'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Mail, ArrowRight, ChevronLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        toast.success('Reset link sent! Please check your email.');
      } else {
        toast.error(data.error ?? 'Something went wrong');
      }
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <Link 
        href="/auth/login" 
        className="fixed top-8 left-8 flex items-center gap-2 text-text-muted hover:text-brand-green font-semibold text-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Login
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-3 justify-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center shadow-lg shadow-brand-green/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-text-dark font-serif">AgriLink</span>
        </Link>

        <div className="bg-white rounded-2xl p-10 shadow-xl border border-[#eae6de]">
          {!submitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-dark mb-2 font-serif tracking-tight">Forgot Password?</h1>
                <p className="text-text-muted text-sm font-medium">Enter your email and we'll send you a link to reset your password.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      Sending...
                    </span>
                  ) : (
                    <>Send Reset Link <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-brand-green" />
              </div>
              <h1 className="text-3xl font-bold text-text-dark mb-3 font-serif tracking-tight">Check your email</h1>
              <p className="text-text-muted text-sm mb-8 leading-relaxed font-medium">
                We've sent a password reset link to <br/>
                <span className="text-text-dark font-bold">{email}</span>
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-brand-green font-bold text-sm hover:underline"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
