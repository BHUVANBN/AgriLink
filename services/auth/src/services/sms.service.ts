// ── SMS Service (Fast2SMS — Transactional Route) ──────────────
// BUG-005 fix: correct transactional route 'q', proper return value

export async function sendOtpSms(phone: string, otp: string, purpose: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.warn('[sms-service] FAST2SMS_API_KEY not set — SMS disabled');
    return false;
  }

  // Ensure 10-digit Indian mobile number
  const normalizedPhone = phone.replace(/^(\+91|91)/, '').replace(/\D/g, '');
  if (normalizedPhone.length !== 10) {
    console.error('[sms-service] Invalid phone number:', phone);
    return false;
  }

  const message = `${otp} is your AgriLink OTP for ${purpose}. Valid for 10 minutes. Do not share. -AgriLink`;

  try {
    // BUG-005 fix: use 'q' (Quick/Transactional) route, not 'v3'
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',              // Transactional Quick route
        message,
        language: 'english',
        flash: 0,
        numbers: normalizedPhone,
      }),
    });

    const body = await res.json() as { return?: boolean; message?: string[] };

    if (!res.ok || body.return !== true) {
      const apiError = body.message?.join(', ') ?? 'Unknown Fast2SMS error';
      console.error('[sms-service] Fast2SMS error:', apiError);
      
      // FALLBACK for Dev/Recharge issue: Log the OTP to console so user can finish testing
      console.log('----------------------------------------------------');
      console.log(`[DEVELOPMENT FALLBACK] SMS OTP to ${normalizedPhone}: ${otp}`);
      console.log('----------------------------------------------------');
      
      return false;
    }

    // BUG-036 fix: log success without OTP value
    console.log('[sms-service] OTP SMS sent successfully to', normalizedPhone.slice(-4).padStart(10, '*'));
    return true;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[sms-service] Request failed:', errorMsg);
    
    // FALLBACK for Network/Other issues
    console.log('----------------------------------------------------');
    console.log(`[DEVELOPMENT FALLBACK] SMS OTP to ${phone}: ${otp}`);
    console.log('----------------------------------------------------');
    
    return false;
  }
}
