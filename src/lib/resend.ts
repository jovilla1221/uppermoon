import { Resend } from 'resend';

// Initialize the Resend client. Ensure RESEND_API_KEY is available in your environment variables.
// Default fallback prevents Next.js compiler crashes if the key isn't present during build stage.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export interface SendEmailOtpParams {
  email: string;
  otp: string;
  template?: 'default' | 'admin-verify' | 'password-reset';
}

export async function sendEmailOtpViaResend({
  email,
  otp,
  template = 'default'
}: SendEmailOtpParams): Promise<{ success: boolean; data?: unknown; error?: string }> {
  
  if (!process.env.RESEND_API_KEY) {
    console.error('[RESEND] API Key is missing in environment variables');
    return { success: false, error: 'Konfigurasi Email (Resend) tidak lengkap. Pastikan RESEND_API_KEY sudah diset di Vercel.' };
  } else {
    console.log('[RESEND] API Key detected (length: ' + process.env.RESEND_API_KEY.length + ')');
  }

  // By default, Resend testing mode ONLY works if sending from 'onboarding@resend.dev' 
  // TO the exact email address you used to register the Resend account.
  // We use this as a safe fallback until you add a verified domain (like noreply@yourdomain.com).
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@uppermoon.store';
  const FROM_NAME = 'UPPERMOON';

  const htmlContent = template === 'password-reset'
    ? `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;background-color:#ffffff;">
        <h2 style="color:#1f2937;margin:0 0 16px">Reset Password</h2>
        <p style="color:#4b5563;margin:0 0 24px">Anda meminta untuk mereset password akun UPPERMOON Anda. Gunakan kode berikut:</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;text-align:center">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111827">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:14px;margin:24px 0 0">Kode berlaku 10 menit. Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>
    `
    : template === 'admin-verify'
    ? `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;background-color:#ffffff;">
        <h2 style="color:#1f2937;margin:0 0 16px">Verifikasi Email Admin</h2>
        <p style="color:#4b5563;margin:0 0 24px">Gunakan kode ini untuk menyelesaikan login:</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;text-align:center">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111827">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:14px;margin:24px 0 0">Kode berlaku 10 menit. Jangan bagikan ke siapapun.</p>
      </div>
    `
    : `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;background-color:#ffffff;">
        <h2 style="color:#1f2937;margin:0 0 16px">Kode Verifikasi Anda</h2>
        <p style="color:#4b5563;margin:0 0 24px">Silakan gunakan kode OTP ini untuk mengaktifkan akun UPPERMOON Anda:</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;text-align:center">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111827">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:14px;margin:24px 0 0">Berlaku 10 menit. Abaikan email ini jika Anda tidak mendaftar.</p>
      </div>
    `;

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email, // this will send the email exactly to the user who registered
      subject: template === 'password-reset' 
        ? 'Reset Password UPPERMOON' 
        : template === 'admin-verify' 
        ? 'Kode Verifikasi Admin' 
        : 'Verifikasi Akun UPPERMOON',
      html: htmlContent,
    });

    if (error) {
      console.error('[RESEND] Failed to send email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    console.error('[RESEND] Unexpected error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Gagal mengirim email' };
  }
}
