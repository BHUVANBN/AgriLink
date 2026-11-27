import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata: Metadata = { title: 'Contact' };

// Set NEXT_PUBLIC_SUPPORT_EMAIL / NEXT_PUBLIC_SUPPORT_PHONE at build time.
const EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE;

export default function ContactPage() {
  return (
    <PublicPage title="Contact us" intro="We usually reply within one working day.">
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#eae6de] rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Email</p>
          {EMAIL ? <a href={`mailto:${EMAIL}`} className="text-lg">{EMAIL}</a> : <p className="text-text-muted">Support email coming soon</p>}
        </div>
        <div className="bg-white border border-[#eae6de] rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Phone / WhatsApp</p>
          {PHONE ? <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="text-lg">{PHONE}</a> : <p className="text-text-muted">Support line coming soon</p>}
        </div>
      </section>
      <section>
        <h2>Before you write</h2>
        <p>
          Many questions are answered in <Link href="/help">Help &amp; FAQ</Link>. For an order, include the order number
          (for example ORD-1A2B3C4D). Never share your password or OTP. AgriLink staff will never ask for them.
        </p>
      </section>
    </PublicPage>
  );
}
