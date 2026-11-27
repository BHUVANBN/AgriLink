import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata: Metadata = { title: 'Terms of Service' };

// DRAFT — have this reviewed by a lawyer before launch.
export default function TermsPage() {
  return (
    <PublicPage title="Terms of Service" updated="Draft — pending legal review">
      <section>
        <h2>1. Using AgriLink</h2>
        <p>
          You must provide accurate information and keep your password secret. You are responsible for activity on your
          account. We may suspend accounts that submit false documents, abuse the platform or break these terms.
        </p>
      </section>

      <section>
        <h2>2. KYC and verification</h2>
        <p>
          Verification relies on the documents you upload and on government records (Bhoomi). Approval confirms that the
          documents appeared consistent at the time of review; it is not a legal certification of title.
        </p>
      </section>

      <section>
        <h2>3. Marketplace</h2>
        <ul>
          <li>Suppliers are responsible for the accuracy of listings, product quality, pricing (including GST) and delivery.</li>
          <li>Prices are confirmed by AgriLink at checkout from the supplier&apos;s current listing.</li>
          <li>Online payments are processed by Razorpay. Unpaid orders can be cancelled by the buyer before processing; refunds for paid orders are handled by AgriLink support.</li>
          <li>Reviews must reflect your genuine experience. We may remove reviews that are abusive or misleading.</li>
        </ul>
      </section>

      <section>
        <h2>4. Land integration agreements</h2>
        <p>
          AgriLink provides a template agreement and records it on the Polygon blockchain with both parties&apos; signatures.
          The terms are agreed between the farmers; AgriLink is not a party to the agreement and does not guarantee
          profits or performance. Signed records are permanent and public (see our <Link href="/privacy">Privacy Policy</Link>).
          Either party may revoke an agreement through the platform; revocation is also recorded on-chain.
        </p>
      </section>

      <section>
        <h2>5. Information services</h2>
        <p>
          Price forecasts, weather and scheme eligibility are estimates based on public data (Agmarknet, Open-Meteo, government
          scheme rules). They are for guidance only; please confirm with official sources before making decisions.
        </p>
      </section>

      <section>
        <h2>6. Liability</h2>
        <p>
          AgriLink is provided as is. To the extent permitted by law, we are not liable for indirect losses, crop outcomes,
          or disputes between buyers, suppliers or agreement parties.
        </p>
      </section>

      <section>
        <h2>7. Contact</h2>
        <p>Questions about these terms? <Link href="/contact">Contact us</Link>.</p>
      </section>
    </PublicPage>
  );
}
