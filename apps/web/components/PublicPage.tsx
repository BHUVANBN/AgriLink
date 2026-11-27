import Link from 'next/link';
import type { ReactNode } from 'react';

/** Shared layout for public informational pages (help, legal, about, contact). */
export default function PublicPage({ title, intro, updated, children }: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <nav className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-green/10">
        <div className="mx-auto px-6 h-16 flex items-center justify-between max-w-5xl">
          <Link href="/" className="font-serif font-bold text-xl text-brand-green tracking-wide">AgriLink</Link>
          <div className="flex items-center gap-5 text-[13px] font-medium text-text-muted">
            <Link href="/marketplace" className="hover:text-brand-green hidden sm:inline">Marketplace</Link>
            <Link href="/help" className="hover:text-brand-green">Help</Link>
            <Link href="/auth/login" className="font-bold text-text-dark hover:text-brand-green">Log in</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-serif font-bold text-text-dark">{title}</h1>
        {intro && <p className="mt-4 text-lg text-text-muted leading-relaxed">{intro}</p>}
        {updated && <p className="mt-2 text-xs text-text-muted">Last updated: {updated}</p>}
        <div className="mt-10 space-y-8 text-text-dark leading-relaxed [&_h2]:text-xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:mb-3 [&_p]:text-[15px] [&_li]:text-[15px] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-brand-green [&_a]:underline">
          {children}
        </div>
      </main>

      <footer className="border-t border-brand-green/10 py-8 text-center text-sm text-text-muted">
        <div className="flex flex-wrap justify-center gap-6 mb-3">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        © {new Date().getFullYear()} AgriLink
      </footer>
    </div>
  );
}
