/**
 * Email templates for every Kafka event the notification service handles.
 * Returns { subject, html, text } for each event type.
 */

// ── Shared brand header/footer ────────────────────────────────

const BRAND_COLOR = '#16a34a';

function header(title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,${BRAND_COLOR},#059669);padding:28px 40px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px;">🌾 AgriLink</h1>
      <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">${title}</p>
    </td>
  </tr>

  <!-- Body -->
  <tr><td style="padding:40px;">`;
}

function footer(): string {
  return `
  </td></tr>

  <!-- Footer -->
  <tr>
    <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0 0 8px;">
        © ${new Date().getFullYear()} AgriLink — Agricultural Intelligence Platform
      </p>
      <p style="color:#9ca3af;font-size:11px;margin:0;">
        You are receiving this email because you have an account at AgriLink.
        <br>If you did not request this, please contact <a href="mailto:support@agrilink.app" style="color:${BRAND_COLOR};">support@agrilink.app</a>
      </p>
    </td>
  </tr>
</table>
</td></tr></table>
</body>
</html>`;
}

function btn(url: string, label: string, color = BRAND_COLOR): string {
  return `
<div style="text-align:center;margin:24px 0;">
  <a href="${url}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">${label}</a>
</div>`;
}

function alert(text: string, type: 'success' | 'warning' | 'error' = 'success'): string {
  const colors: Record<string, string> = {
    success: 'border-left:4px solid #22c55e;background:#f0fdf4;color:#15803d',
    warning: 'border-left:4px solid #f59e0b;background:#fffbeb;color:#92400e',
    error:   'border-left:4px solid #ef4444;background:#fef2f2;color:#991b1b',
  };
  return `<div style="${colors[type]};padding:12px 16px;border-radius:4px;margin:16px 0;font-size:14px;">${text}</div>`;
}

// ── Template Registry ─────────────────────────────────────────

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const templates: Record<string, (data: any) => EmailTemplate> = {

  // ── ORDER PLACED ───────────────────────────────────────────
  'order.placed': (data) => ({
    subject: `✅ Order Confirmed — ${data.orderNumber ?? 'AgriLink'}`,
    html: header('Order Confirmed') + `
      <h2 style="color:#1f2937;margin:0 0 8px;font-size:22px;">Your order is confirmed!</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Thank you for your order. Here's your order summary:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <tr style="background:#f9fafb;">
          <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;">ORDER NUMBER</td>
          <td style="padding:12px 16px;font-size:14px;color:#111827;font-weight:700;">${data.orderNumber ?? '—'}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;">TOTAL</td>
          <td style="padding:12px 16px;font-size:18px;color:${BRAND_COLOR};font-weight:800;border-top:1px solid #e5e7eb;">₹${data.totalAmount ? (data.totalAmount / 100).toFixed(2) : '—'}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;">PAYMENT</td>
          <td style="padding:12px 16px;font-size:14px;color:#059669;font-weight:600;border-top:1px solid #e5e7eb;">✅ Confirmed</td>
        </tr>
      </table>
      ${data.items?.length ? `
      <h3 style="color:#374151;font-size:15px;margin:0 0 12px;">Items ordered:</h3>
      <ul style="padding:0 0 0 20px;margin:0 0 24px;color:#4b5563;font-size:14px;">
        ${data.items.map((i: any) => `<li style="margin-bottom:6px;">${i.name ?? i.productId} × ${i.quantity}</li>`).join('')}
      </ul>` : ''}
      <p style="color:#6b7280;font-size:13px;">Your supplier will confirm the order shortly. Track your order in the <a href="${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/dashboard/farmer" style="color:${BRAND_COLOR};">AgriLink dashboard</a>.</p>
    ` + footer(),
    text: `Order Confirmed!\nOrder: ${data.orderNumber}\nTotal: ₹${data.totalAmount ? (data.totalAmount / 100).toFixed(2) : '—'}\nLogin to AgriLink to track your order.`,
  }),

  // ── ORDER STATUS UPDATED ───────────────────────────────────
  'order.status.updated': (data) => {
    const statusLabel: Record<string, string> = {
      processing: '🔄 Processing', shipped: '🚚 Shipped', delivered: '✅ Delivered',
      cancelled: '❌ Cancelled', returned: '↩️ Return Initiated',
    };
    const label = statusLabel[data.newStatus] ?? data.newStatus;
    return {
      subject: `Order Update — ${label} | ${data.orderNumber}`,
      html: header(`Order ${label}`) + `
        <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;">Order status updated</h2>
        <p style="color:#4b5563;font-size:15px;margin:0 0 24px;">Your order <strong>#${data.orderNumber}</strong> is now: <strong>${label}</strong></p>
        ${data.trackingNumber ? `<p style="color:#4b5563;font-size:14px;">Tracking: <strong>${data.trackingNumber}</strong> (${data.carrier ?? 'courier'})</p>` : ''}
        ${btn(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/dashboard/farmer`, 'Track Order')}
      ` + footer(),
      text: `Order ${data.orderNumber} status: ${label}. ${data.trackingNumber ? `Tracking: ${data.trackingNumber}` : ''} Login to AgriLink to view details.`,
    };
  },

  // ── KYC SUBMITTED ─────────────────────────────────────────
  'kyc.submitted': (data) => ({
    subject: '📋 KYC Submitted — We\'ll Review Soon',
    html: header('KYC Submitted') + `
      <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;">Your KYC is under review</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Hello <strong>${data.displayName ?? data.email}</strong>,
        <br><br>
        We've received your KYC documents and they are now under review by our team.
      </p>
      ${alert('⏱ Expected review time: <strong>2–3 business days</strong>', 'warning')}
      <p style="color:#6b7280;font-size:13px;">We'll notify you by email and SMS once your KYC is processed.</p>
    ` + footer(),
    text: `Hello ${data.displayName ?? data.email}, your KYC documents have been submitted and are under review. Expected time: 2-3 business days. We'll notify you once reviewed.`,
  }),

  // ── KYC APPROVED ──────────────────────────────────────────
  'kyc.approved': (data) => ({
    subject: '🎉 KYC Approved — Full Access Unlocked!',
    html: header('KYC Approved!') + `
      <div style="text-align:center;margin:0 0 32px;">
        <div style="display:inline-block;background:#dcfce7;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;text-align:center;">✅</div>
      </div>
      <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;text-align:center;">KYC Approved!</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;text-align:center;">
        Congratulations, <strong>${data.displayName ?? data.email}</strong>!<br>
        Your identity and ${data.role === 'supplier' ? 'business' : 'land'} details have been verified.
      </p>
      ${alert('You now have <strong>full access</strong> to all AgriLink features.', 'success')}
      <h3 style="color:#374151;font-size:15px;margin:24px 0 12px;">What's unlocked for you:</h3>
      <ul style="padding:0 0 0 20px;margin:0 0 24px;color:#4b5563;font-size:14px;line-height:1.8;">
        ${data.role === 'supplier'
          ? '<li>List products on the AgriLink Marketplace</li><li>Accept B2B orders from farmers</li><li>Access analytics dashboard</li>'
          : '<li>Connect with verified suppliers</li><li>Initiate blockchain land agreements</li><li>Access all government scheme benefits</li>'}
      </ul>
      ${btn(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/login`, 'Go to Dashboard')}
    ` + footer(),
    text: `KYC Approved! Hello ${data.displayName ?? data.email}, your AgriLink KYC has been verified. Login to access all features at agrilink.app`,
  }),

  // ── KYC REJECTED ──────────────────────────────────────────
  'kyc.rejected': (data) => ({
    subject: '⚠️ KYC Update Required — AgriLink',
    html: header('KYC Action Required') + `
      <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;">KYC Review — Action Required</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Hello <strong>${data.displayName ?? data.email}</strong>,
        <br><br>
        We were unable to verify your submitted documents. Here's why:
      </p>
      ${alert(`<strong>Reason:</strong> ${data.reason ?? 'Documents were unclear or incomplete.'}`, 'error')}
      <h3 style="color:#374151;font-size:15px;margin:24px 0 12px;">What to do next:</h3>
      <ol style="padding:0 0 0 20px;margin:0 0 24px;color:#4b5563;font-size:14px;line-height:1.8;">
        <li>Review the rejection reason above</li>
        <li>Obtain clear, high-resolution scans of your documents</li>
        <li>Ensure documents are unobstructed and fully visible</li>
        <li>Re-upload through your AgriLink dashboard</li>
      </ol>
      ${btn(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/dashboard/farmer/kyc`, 'Re-submit Documents', '#dc2626')}
      <p style="color:#6b7280;font-size:13px;">Need help? Reply to this email or contact <a href="mailto:support@agrilink.app" style="color:${BRAND_COLOR};">support@agrilink.app</a></p>
    ` + footer(),
    text: `KYC Update Required. Hello ${data.displayName ?? data.email}, your KYC was not approved. Reason: ${data.reason ?? 'Documents unclear'}. Please re-upload your documents at agrilink.app`,
  }),

  // ── LAND AGREEMENT CREATED ─────────────────────────────────
  'land.agreement.created': (data) => ({
    subject: '📝 Land Integration Agreement Created',
    html: header('Land Agreement Created') + `
      <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;">Land Agreement Initiated</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
        A land integration agreement has been created on the blockchain involving your land record.
        Both parties must <strong>sign the agreement</strong> to make it active.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <tr style="background:#f9fafb;">
          <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;">AGREEMENT ID</td>
          <td style="padding:12px 16px;font-size:12px;color:#111827;font-family:monospace;">${data.agreementId ?? '—'}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;">NETWORK</td>
          <td style="padding:12px 16px;font-size:14px;color:#111827;border-top:1px solid #e5e7eb;">Polygon Blockchain</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;">STATUS</td>
          <td style="padding:12px 16px;font-size:14px;color:#f59e0b;font-weight:600;border-top:1px solid #e5e7eb;">⏳ Pending Signatures</td>
        </tr>
      </table>
      ${btn(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/dashboard/farmer/integration`, 'View & Sign Agreement')}
      ${alert('Both farmers must sign for the agreement to become active and immutable on the blockchain.', 'warning')}
    ` + footer(),
    text: `Land Integration Agreement created on blockchain. Agreement ID: ${data.agreementId}. Login to AgriLink to review and sign.`,
  }),

  // ── LAND AGREEMENT SIGNED ──────────────────────────────────
  'land.agreement.signed': (data) => ({
    subject: data.fullyExecuted ? '✅ Land Agreement Fully Executed — Both Parties Signed' : '🖊️ Land Agreement Signed by One Party',
    html: header(data.fullyExecuted ? 'Agreement Fully Executed!' : 'Signature Received') + `
      <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;">${data.fullyExecuted ? '🎉 Agreement is Now Active!' : 'Signature Recorded'}</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${data.fullyExecuted
          ? 'Both parties have signed the land integration agreement. It is now <strong>active and immutable</strong> on the Polygon blockchain.'
          : `<strong>${data.signerName}</strong> has signed the agreement. Waiting for the other party's signature.`
        }
      </p>
      ${data.fullyExecuted ? alert('This agreement is permanently recorded on the blockchain and cannot be altered.', 'success') : alert('The agreement will become active once both parties have signed.', 'warning')}
      ${data.txHash ? `<p style="color:#9ca3af;font-size:11px;font-family:monospace;word-break:break-all;">Tx: ${data.txHash}</p>` : ''}
    ` + footer(),
    text: data.fullyExecuted
      ? `Land Agreement Fully Executed! Both parties have signed. Agreement is now active on blockchain. Tx: ${data.txHash}`
      : `Land Agreement Update: ${data.signerName} has signed. Waiting for the other party.`,
  }),

  // ── GENERIC notification.send ──────────────────────────────
  'notification.send': (data) => ({
    subject: data.subject ?? 'AgriLink Notification',
    html: header(data.subject ?? 'Notification') + `
      <div style="color:#4b5563;font-size:15px;line-height:1.7;">${data.body?.replace(/\n/g, '<br>') ?? ''}</div>
    ` + footer(),
    text: data.body ?? '',
  }),

  // ── WELCOME (post-registration) ────────────────────────────
  'user.registered': (data) => ({
    subject: `👋 Welcome to AgriLink, ${data.displayName?.split(' ')[0] ?? 'Farmer'}!`,
    html: header('Welcome to AgriLink!') + `
      <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;">ನಮಸ್ಕಾರ! Welcome, ${data.displayName?.split(' ')[0] ?? 'Friend'}!</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
        You're now part of AgriLink — Karnataka's agricultural intelligence platform.
        ${data.role === 'farmer' ? "Let's start by verifying your land records and unlocking government schemes." : "Let's complete your business verification to start listing products."}
      </p>
      <h3 style="color:#374151;font-size:15px;margin:0 0 12px;">Your next steps:</h3>
      <ol style="padding:0 0 0 20px;margin:0 0 24px;color:#4b5563;font-size:14px;line-height:1.8;">
        ${data.role === 'farmer'
          ? '<li>Upload your Aadhaar card for identity verification</li><li>Upload your RTC (land record) for land verification</li><li>Submit KYC to unlock all features</li>'
          : '<li>Upload business documents (GST, trade license)</li><li>Submit KYC for admin review</li><li>Start listing products once approved</li>'
        }
      </ol>
      ${btn(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/login`, 'Get Started')}
    ` + footer(),
    text: `Welcome to AgriLink, ${data.displayName}! Login at agrilink.app to complete your profile and access all features.`,
  }),
};

// Lookup function with fallback
export function getTemplate(topic: string, data: any): EmailTemplate | null {
  const fn = templates[topic];
  if (!fn) return null;
  try {
    return fn(data);
  } catch (err) {
    console.error(`[templates] Error rendering template for ${topic}:`, err);
    return null;
  }
}
