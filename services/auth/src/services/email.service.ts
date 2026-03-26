import nodemailer from 'nodemailer';

export interface OtpEmailContext {
  recipientName: string;
  purpose: string;
  otp: string;
  expiresInMinutes: number;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  // BUG-006 fix: TLS is properly validated in production
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

// ── OTP Email ─────────────────────────────────────────────────

export async function sendOtpEmail(to: string, ctx: OtpEmailContext): Promise<boolean> {
  const from = process.env.SMTP_FROM ?? 'AgriLink <noreply@agrilink.app>';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgriLink OTP</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f0;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f0;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#15803d 0%,#166534 100%);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🌾 AgriLink</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Agricultural Intelligence Platform</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1f2937;font-size:22px;font-weight:600;margin:0 0 12px;">Hello, ${ctx.recipientName} 👋</h2>
              <p style="color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Your One-Time Password for <strong>${ctx.purpose}</strong>:
              </p>
              <!-- OTP Box -->
              <div style="background:#f0fdf4;border:2px dashed #16a34a;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                <span style="font-size:40px;font-weight:700;color:#15803d;letter-spacing:8px;font-family:monospace;">${ctx.otp}</span>
              </div>
              <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0 0 8px;">
                ⏱ This OTP expires in <strong>${ctx.expiresInMinutes} minutes</strong>.
              </p>
              <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0;">
                🔒 Never share this OTP with anyone. AgriLink will never ask for your OTP.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
                If you didn't request this, please ignore this email.<br>
                &copy; ${new Date().getFullYear()} AgriLink. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `${ctx.otp} is your AgriLink OTP for ${ctx.purpose}`,
      html,
      text: `Your AgriLink OTP for ${ctx.purpose} is ${ctx.otp}. Valid for ${ctx.expiresInMinutes} minutes. Do NOT share this with anyone.`,
    });
    return true;
  } catch (err) {
    // BUG-036 fix: never log OTP value
    console.error('[email-service] Failed to send OTP email to', to, err instanceof Error ? err.message : err);
    return false;
  }
}

// ── Generic Email ─────────────────────────────────────────────

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<boolean> {
  const from = process.env.SMTP_FROM ?? 'AgriLink <noreply@agrilink.app>';
  try {
    await transporter.sendMail({ from, to, subject, html, text });
    return true;
  } catch (err) {
    console.error('[email-service] Failed to send email:', err instanceof Error ? err.message : err);
    return false;
  }
}
