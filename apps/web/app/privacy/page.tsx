import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata: Metadata = { title: 'Privacy Policy' };

// DRAFT — reflects how the software actually handles data. Have it reviewed
// for compliance with the Digital Personal Data Protection Act, 2023 and
// UIDAI rules on Aadhaar before launch.
export default function PrivacyPage() {
  return (
    <PublicPage title="Privacy Policy" updated="Draft — pending legal review">
      <section>
        <h2>What we collect</h2>
        <ul>
          <li><strong>Account:</strong> name or company name, email, mobile number, password (stored only as a one-way hash).</li>
          <li><strong>Farmer KYC:</strong> Aadhaar and RTC document images, details extracted from them (name, date of birth, gender, address, survey number, land extent), and optional land sketches and boundaries.</li>
          <li><strong>Supplier KYC:</strong> business certificate, trade licence, GST certificate and owner identity proof.</li>
          <li><strong>Profile and eligibility:</strong> location, bank details you choose to add, and answers used to match government schemes.</li>
          <li><strong>Orders:</strong> items, delivery address and payment status. Card/UPI details are handled by Razorpay and never reach our servers.</li>
        </ul>
      </section>

      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To verify identity and land ownership (KYC).</li>
          <li>To run the marketplace: process orders, payments and deliveries.</li>
          <li>To match you with government schemes and nearby farmers for land integration, only if you opt in.</li>
          <li>To send OTPs, order updates and important account notices.</li>
        </ul>
      </section>

      <section>
        <h2>How documents are protected</h2>
        <p>
          KYC documents are stored privately with our storage provider (Cloudinary). They are not publicly accessible; viewing
          links are generated on request, expire after 15 minutes, and are only given to you and authorised reviewers.
          Text extraction uses Google Cloud Vision and Groq; documents are sent to these providers only for processing.
        </p>
      </section>

      <section>
        <h2>Blockchain records are permanent</h2>
        <p>
          When you sign a land integration agreement, the agreement text (names, AgriLink IDs, survey numbers, land extent and
          terms) is published to IPFS and its fingerprint is recorded on the Polygon blockchain. This is what makes the
          agreement tamper-proof, and it also means <strong>this information is public and cannot be deleted</strong>.
          Aadhaar data is never written to the blockchain. You will be asked to confirm with your password before signing.
        </p>
      </section>

      <section>
        <h2>Who we share with</h2>
        <ul>
          <li>Suppliers you order from see your name, phone and delivery address for that order.</li>
          <li>Farmers who have opted in to land integration see each other&apos;s name, village, survey number and land outline.</li>
          <li>Service providers that run the platform: hosting, database, storage, email/SMS, payments (Razorpay), OCR.</li>
          <li>Authorities, if required by law.</li>
        </ul>
        <p>We do not sell personal data.</p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You can view and correct your profile at any time, withdraw from land integration, and ask us to delete your account
          and KYC documents (except records we must keep by law, completed orders, and blockchain records described above).
          To exercise these rights, <Link href="/contact">contact us</Link>.
        </p>
      </section>

      <section>
        <h2>Retention</h2>
        <p>
          KYC documents are kept while your account is active and deleted on request after account closure, subject to legal
          retention requirements. Order records are kept as required for tax purposes.
        </p>
      </section>
    </PublicPage>
  );
}
