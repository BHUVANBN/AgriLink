'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#eae6de] shadow-xl shadow-brand-green/5 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 bg-[url('/bg-grid.svg')] bg-center opacity-3 pointer-events-none" />

        <div className="relative z-10 p-12 text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-brand-green font-serif tracking-tighter mb-2">
              404
            </h1>
            <div className="w-24 h-1 bg-brand-orange rounded-full mx-auto"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-dark mb-3 font-serif">
              Page Not Found
            </h2>
            <p className="text-text-muted text-base max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to where you need to be.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="btn-primary flex items-center gap-2 px-6 py-3"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            
            <Link
              href="/marketplace"
              className="flex items-center gap-2 px-6 py-3 bg-[#f8f7f4] text-text-dark rounded-xl font-bold hover:bg-[#eae6de] transition-colors border border-[#eae6de]"
            >
              <Search className="w-4 h-4" />
              Browse Marketplace
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-[#eae6de]">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">
              Quick Links
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link 
                href="/marketplace" 
                className="text-brand-green hover:text-brand-green-hover font-medium transition-colors"
              >
                Marketplace
              </Link>
              <span className="text-text-muted">•</span>
              <Link 
                href="/auth/register" 
                className="text-brand-green hover:text-brand-green-hover font-medium transition-colors"
              >
                Register
              </Link>
              <span className="text-text-muted">•</span>
              <Link 
                href="/auth/login" 
                className="text-brand-green hover:text-brand-green-hover font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
