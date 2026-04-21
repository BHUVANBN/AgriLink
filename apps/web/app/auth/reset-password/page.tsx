'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!email || !token) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-text-dark mb-3 font-serif">Invalid Reset Link</h1>
        <p className="text-text-muted text-sm mb-8 leading-relaxed">
          The link you followed is invalid or has expired. Please request a new one.
        </p>
        <Link href="/auth/forgot-password" title="Forgot Password" className="btn-primary w-full justify-center">
          Request New Link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success('Password reset successful!');
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        toast.error(data.error ?? 'Failed to reset password');
      }
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-brand-green" />
        </div>
        <h1 className="text-3xl font-bold text-text-dark mb-3 font-serif tracking-tight">Success!</h1>
        <p className="text-text-muted text-sm mb-8 leading-relaxed font-medium">
          Your password has been reset successfully. <br/>
          Redirecting you to login page...
        </p>
        <Link href="/auth/login" title="Login" className="btn-primary w-full justify-center">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2 font-serif tracking-tight">Create New Password</h1>
        <p className="text-text-muted text-sm font-medium">Please enter your new secure password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              className="input-field pl-12 pr-12"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
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

        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              className="input-field pl-12"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
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
              Updating...
            </span>
          ) : (
            <>Reset Password <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
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
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
