'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Captured by Next.js Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 selection:bg-brand-orange/20 selection:text-brand-orange/80">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#eae6de] shadow-2xl shadow-brand-green/10 relative overflow-hidden text-center">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('/bg-grid.svg')] bg-center opacity-5 pointer-events-none" />

        <div className="relative z-10 space-y-6 p-8">
          <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto text-white shadow-lg shadow-red-500/20">
            <svg 
              className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-text-dark mb-2 font-serif">Something went wrong</h1>
            <p className="text-text-muted text-sm">
              We've encountered an unexpected error. Please try again or return home.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="btn-secondary w-full !py-3"
            >
              Try again
            </button>
            <Link
              href="/"
              className="w-full h-11 flex items-center justify-center bg-[#f8f7f4] text-text-dark rounded-xl font-medium hover:bg-[#eae6de] transition-colors border border-[#eae6de]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
