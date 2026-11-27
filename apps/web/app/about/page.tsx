import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <PublicPage
      title="About AgriLink"
      intro="AgriLink helps Karnataka's farmers verify their land, find the support they are entitled to, buy inputs directly from verified suppliers, and pool land with neighbours on trusted terms."
    >
      <section>
        <h2>What we do</h2>
        <ul>
          <li><strong>Verified identity and land</strong> — Aadhaar and RTC checks, with RTCs fetched straight from Bhoomi.</li>
          <li><strong>Government schemes</strong> — eligibility matched to your land holding, income and farming type.</li>
          <li><strong>Market prices</strong> — Agmarknet history for your district and a short-term price outlook.</li>
          <li><strong>Marketplace</strong> — seeds, fertiliser and tools from KYC-verified suppliers, with UPI or cash on delivery.</li>
          <li><strong>Land integration</strong> — profit-sharing agreements between neighbouring farmers, recorded on the Polygon blockchain so neither side can alter them.</li>
        </ul>
      </section>
      <section>
        <h2>Get started</h2>
        <p>
          <Link href="/auth/register/farmer">Register as a farmer</Link> or <Link href="/auth/register/supplier">register as a supplier</Link>. It&apos;s free.
        </p>
      </section>
    </PublicPage>
  );
}
