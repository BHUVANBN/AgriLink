import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata: Metadata = { title: 'Help & FAQ' };

const FAQ: { section: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    section: 'Getting started',
    items: [
      { q: 'Who can use AgriLink?', a: 'Farmers in Karnataka, and agri-input suppliers (seeds, fertiliser, tools) who sell to them. Registration is free for both.' },
      { q: 'I did not receive my OTP.', a: 'Check your spam folder. You can request a new code after 60 seconds from the verification screen. Codes expire after 10 minutes.' },
      { q: 'I forgot my password.', a: <>Use <Link href="/auth/forgot-password">Forgot password</Link> on the login page. The reset link is valid for 15 minutes.</> },
    ],
  },
  {
    section: 'Farmers: KYC and land',
    items: [
      { q: 'Why do I need to upload Aadhaar and RTC?', a: 'They prove your identity and land ownership. KYC is required before you can be listed for land integration or sign agreements. Documents are stored privately and only you and AgriLink reviewers can view them.' },
      { q: 'How long does KYC take?', a: 'If the name on your Aadhaar exactly matches the RTC owner name, approval is instant. Otherwise an admin reviews it, usually within 2–3 working days.' },
      { q: 'Can I fetch my RTC directly from Bhoomi?', a: 'Yes. In KYC, enter your district, taluk, hobli, village and survey number, and AgriLink fetches the record from the Bhoomi portal.' },
      { q: 'How do land agreements work?', a: 'Once both farmers have approved KYC and opted in, one proposes the terms (profit share and duration). Both sign with their password. The agreement document is stored on IPFS and recorded on the Polygon blockchain, so it cannot be altered later.' },
    ],
  },
  {
    section: 'Marketplace',
    items: [
      { q: 'How do I pay?', a: 'Pay online (UPI, cards, net banking via Razorpay) or choose cash on delivery. Prices include GST unless the supplier states otherwise.' },
      { q: 'Can I cancel an order?', a: 'Unpaid orders can be cancelled from My Orders until the supplier starts processing. For paid orders, contact support and we will arrange a refund.' },
      { q: 'How do reviews work?', a: 'After an order is delivered, open it in My Orders and tap Review on each product. Only verified buyers can review.' },
    ],
  },
  {
    section: 'Suppliers',
    items: [
      { q: 'Why can I not publish products?', a: 'Products can go live only after your supplier KYC (business certificate and owner ID) is approved.' },
      { q: 'Where do I see stock changes?', a: 'Products → Inventory log shows every sale, cancellation and manual edit.' },
    ],
  },
];

export default function HelpPage() {
  return (
    <PublicPage title="Help & FAQ" intro="Answers to common questions. Still stuck? Contact us and we will help.">
      {FAQ.map((s) => (
        <section key={s.section}>
          <h2>{s.section}</h2>
          <div className="space-y-3">
            {s.items.map((item) => (
              <details key={item.q} className="group bg-white border border-[#eae6de] rounded-2xl p-5 open:shadow-sm">
                <summary className="cursor-pointer font-bold list-none flex justify-between gap-4">
                  {item.q}
                  <span className="text-brand-green group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="mt-3 text-text-muted text-[15px]">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      ))}
      <p>
        Need more help? <Link href="/contact">Contact support</Link>.
      </p>
    </PublicPage>
  );
}
