import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: { default: 'AgriLink — Agricultural Intelligence Platform', template: '%s | AgriLink' },
  description: 'Empowering Indian farmers with AI-powered insights, verified land records, blockchain agreements, and direct market access.',
  keywords: ['agriculture', 'farming', 'Karnataka', 'land records', 'crop prices', 'government schemes'],
  openGraph: {
    type: 'website',
    title: 'AgriLink — Agricultural Intelligence Platform',
    description: 'Empowering Indian farmers with AI-powered insights and direct market access.',
  },
};

import ClientWrapper from '@/components/ClientWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#1e293b', color: '#f1f5f9', borderRadius: '12px', fontSize: '14px' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
