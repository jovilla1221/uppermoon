import { z } from 'zod';

const FazpassResponseSchema = z.object({
  status: z.boolean(),
  code: z.number().optional(),
  message: z.string().optional(),
  data: z.object({
    reference_id: z.string().optional(),
  }).optional(),
});

export interface SendEmailOtpParams {
  email: string;
  otp: string;
  template?: 'default' | 'admin-verify';
}

export async function sendEmailOtpViaFazpass({
  email,
  otp,
  template = 'default'
}: SendEmailOtpParams): Promise<{ success: boolean; referenceId?: string; error?: string }> {
  const API_BASE = process.env.FAZPASS_API_BASE || 'https://api.fazpass.com';
  const MERCHANT_KEY = process.env.FAZPASS_MERCHANT_KEY;
  const GATEWAY_KEY = process.env.FAZPASS_EMAIL_GATEWAY_KEY;

  if (!MERCHANT_KEY || !GATEWAY_KEY) {
    console.error('[FAZPASS] Missing credentials');
    return { success: false, error: 'Konfigurasi Fazpass tidak lengkap' };
  }

  const htmlContent = template === 'admin-verify' 
    ? `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#1f2937;margin:0 0 16px">Verifikasi Email Admin</h2>
        <p style="color:#4b5563;margin:0 0 24px">Gunakan kode ini untuk menyelesaikan login:</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;text-align:center">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111827">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:14px;margin:24px 0 0">Kode berlaku 5 menit. Jangan bagikan ke siapapun.</p>
      </div>
    `
    : `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#1f2937;margin:0 0 16px">Kode Verifikasi Anda</h2>
        <p style="color:#4b5563;margin:0 0 24px">Kode OTP Anda:</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;text-align:center">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111827">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:14px;margin:24px 0 0">Berlaku 5 menit. Abaikan jika tidak meminta.</p>
      </div>
    `;

  try {
    const response = await fetch(`${API_BASE}/v1/otp/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCHANT_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        gateway_key: GATEWAY_KEY,
        message: htmlContent,
        is_html: true,
      }),
    });

    const raw = await response.json();
    const parsed = FazpassResponseSchema.safeParse(raw);

    if (!parsed.success) {
      console.error('[FAZPASS] Invalid response schema', raw);
      return { success: false, error: 'Response Fazpass tidak valid' };
    }

    if (!parsed.data.status) {
      console.error('[FAZPASS] API error', parsed.data.message);
      return { success: false, error: parsed.data.message || 'Gagal mengirim OTP' };
    }

    return { 
      success: true, 
      referenceId: parsed.data.data?.reference_id 
    };
  } catch (err) {
    console.error('[FAZPASS] Network error', err);
    return { success: false, error: 'Gagal terhubung ke Fazpass' };
  }
}
