/**
 * SMS Templates — concise 160-char messages for each event.
 * Smart2SMS transactional route limit: 160 chars.
 */

export const smsTemplates: Record<string, (data: any) => string> = {
  'order.placed': (data) =>
    `AgriLink: Order #${data.orderNumber ?? ''} confirmed! Total: Rs.${data.totalAmount ? (data.totalAmount / 100).toFixed(0) : ''}. Track at agrilink.app`,

  'order.status.updated': (data) =>
    `AgriLink: Order #${data.orderNumber} is now ${data.newStatus?.toUpperCase()}. ${data.trackingNumber ? `Track: ${data.trackingNumber}.` : ''} agrilink.app`,

  'kyc.submitted': (data) =>
    `AgriLink: Hi ${data.displayName?.split(' ')[0] ?? ''}, your KYC is under review. Expect 2-3 working days. We'll SMS you the result.`,

  'kyc.approved': (data) =>
    `AgriLink: Congrats ${data.displayName?.split(' ')[0] ?? ''}! Your KYC is APPROVED. Login to access all features: agrilink.app`,

  'kyc.rejected': (data) =>
    `AgriLink: KYC Update for ${data.displayName?.split(' ')[0] ?? ''}. Reason: ${(data.reason ?? 'docs unclear').slice(0, 60)}. Re-upload at agrilink.app`,

  'land.agreement.created': (_data) =>
    `AgriLink: A land integration agreement has been created. Login to review and sign: agrilink.app/dashboard/farmer/integration`,

  'land.agreement.signed': (data) =>
    data.fullyExecuted
      ? `AgriLink: Land agreement fully executed! Both parties signed. Stored on Polygon blockchain permanently.`
      : `AgriLink: ${data.signerName} signed the land agreement. Waiting for the other party's signature.`,

  'notification.send': (data) =>
    (data.body ?? '').slice(0, 155),

  'user.registered': (data) =>
    `Welcome to AgriLink, ${data.displayName?.split(' ')[0] ?? 'Farmer'}! Your OTP was sent separately. agrilink.app`,
};

export function getSmsText(topic: string, data: any): string | null {
  const fn = smsTemplates[topic];
  if (!fn) return null;
  try {
    const msg = fn(data);
    return msg.slice(0, 160); // Hard limit
  } catch {
    return null;
  }
}
