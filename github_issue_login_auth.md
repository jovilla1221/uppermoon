Berikut adalah dokumen `.md` yang sudah diperbarui dengan integrasi **Fazpass.com** untuk layanan Email OTP. Kamu bisa langsung simpan sebagai `feature-auth-login-fazpass.md`.

```markdown
# [FEATURE] Implement Authentication & Email OTP Verification (Fazpass Integration)

## 📖 Description
Persiapan teknis dan arsitektur sebelum mengeksekusi fitur login yang berfungsi penuh, khususnya untuk mengamankan halaman Admin Dashboard. Fitur ini mencakup autentikasi email/password, verifikasi email via OTP menggunakan **Fazpass.com**, manajemen sesi aman, dan perlindungan rute dinamis.

> 💡 **Catatan Arsitektur**: CMS (Sanity) hanya digunakan untuk **konten**. Sistem User, Password, Session, dan OTP disimpan di **Database Relasional Terpisah** (PostgreSQL/MySQL/Supabase) untuk alasan keamanan, performa, dan kemudahan migrasi CMS di masa depan.

---

## 📋 Persiapan Teknis (Pre-Implementation Checklist)

### 1. Pemilihan Strategi Autentikasi (Authentication Strategy)
- **✅ Opsi A: Custom Route Handler + Secure Cookies + JWT**  
  Fleksibel, lightweight, mudah dikustomisasi untuk flow OTP dengan Fazpass. Cocok untuk Next.js App Router.
- **⚠️ Opsi B: NextAuth.js (Auth.js v5)**  
  Direkomendasikan untuk OAuth, namun perlu custom adapter untuk integrasi Fazpass OTP.
- **❌ Tidak Disarankan: Menyimpan User di Sanity CMS**  
  Sanity tidak memiliki built-in rate limiting, secure session handling, atau struktur auth yang terisolasi.

### 2. Skema User & Database (Decoupled dari CMS)
```prisma
// schema.prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  passwordHash      String   // bcrypt / argon2
  role              String   @default("admin")
  isEmailVerified   Boolean  @default(false)
  emailVerifiedAt   DateTime?
  isActive          Boolean  @default(true)
  otpRecords        Otp[]
}

model Otp {
  id          String   @id @default(cuid())
  email       String   @unique
  fazpassRef  String?  // Reference ID dari Fazpass (opsional untuk tracking)
  expiresAt   DateTime
  attempts    Int      @default(0)
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [email], references: [email])
}
```
🔹 *Indexing:* `@@index([email])`, `@@index([expiresAt])` untuk query cepat.

### 3. Keamanan Password (Password Hashing)
- Instal library hashing: `npm install bcrypt` atau `npm install argon2`
- **Cost factor minimum:** `12` untuk bcrypt, atau preset `argon2id`
- **DILARANG KERAS:** Menyimpan password dalam plain text di database mana pun.

### 4. Environment Variables (`.env.local`)
```env
# Database & Auth
DATABASE_URL="postgresql://user:pass@host:5432/authdb?sslmode=disable"
JWT_SECRET="min_32_char_random_string_change_in_production"
COOKIE_SECRET="another_random_32_char_string"

# Fazpass Email OTP [[19]]
FAZPASS_API_BASE="https://api.fazpass.com"
FAZPASS_MERCHANT_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoyOTc0OH0.r5JhLGnVys_ObBAYvdV46mjpihZ_pMnFLwjxBbj0SPs"
FAZPASS_EMAIL_GATEWAY_KEY="9772afc7-3c3c-43ae-9c60-4e498ecd11c4"
FAZPASS_EMAIL_FROM="filla.saputro@gmail.com"

# CMS (Content Only)
CMS_PROVIDER=sanity
SANITY_PROJECT_ID="..."
SANITY_DATASET="production"
SANITY_TOKEN="sk_..."
```

🔐 **Cara Dapatkan Fazpass Keys** [[19]]:
1. Login ke [dashboard.fazpass.com](https://dashboard.fazpass.com)
2. **Merchant Key**: `Settings Menu → Merchant Key`
3. **Gateway Key (Email)**: `Proxy Menu → Add New Gateway → Pilih Email → Show Key Gateway → Copy`
4. Whitelist IP server kamu di dashboard Fazpass untuk keamanan tambahan.

### 5. Perlindungan Rute (Route Protection)
```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
```

### 6. Desain UI, UX Vibe & Penanganan Error
- **Form:** Input Email, Input Password (toggle show/hide), Tombol Submit
- **OTP UI:** 6-digit box, auto-focus next, support paste (`Ctrl+V`), backspace auto-prev, timer countdown `05:00`
- **Feedback:** Loading state, shake animation on error, toast success
- **Pesan Error Aman:** 
  - ❌ `"Password salah"` atau `"Email tidak terdaftar"`
  - ✅ `"Email atau password tidak valid."`
- **Aksesibilitas:** `aria-label`, `role="alert"`, navigasi keyboard penuh, kontras ≥ 4.5:1

---

## 🔄 Alur Login + Fazpass Email OTP (End-to-End Flow)

```text
1. User input email & password → klik Login
2. Backend validasi payload → cari user by email
3. bcrypt.compare(password, user.passwordHash)
4. Jika gagal → return 401 { error: "Email atau password tidak valid." }
5. Jika berhasil & isEmailVerified === true:
   ├─ Generate session/JWT → set httpOnly cookie
   └─ Return 200 → redirect ke /admin/dashboard
6. Jika berhasil & isEmailVerified === false:
   ├─ Trigger /api/auth/send-otp (auto)
   ├─ Backend panggil Fazpass API: POST /v1/otp/request [[19]]
   │  ├─ Headers: { Authorization: "Bearer FAZPASS_MERCHANT_KEY" }
   │  ├─ Body: { email: "user@example.com", gateway_key: "FAZPASS_EMAIL_GATEWAY_KEY" }
   │  └─ Simpan fazpassRef (opsional) di DB untuk tracking
   ├─ Return 200 { requiresOtp: true, email, expiresIn: 300 }
   └─ Frontend tampilkan step OTP + timer 5 menit
7. User submit OTP → /api/auth/verify-otp
8. Backend validasi:
   ├─ Cek OTP record di DB (expiresAt, attempts)
   ├─ ⚠️ Fazpass Email OTP tidak menyediakan endpoint verify publik
   │  → Gunakan strategi: OTP dikirim Fazpass, validasi dilakukan di backend kamu
   │  → Simpan hashed OTP di DB saat request, bandingkan saat verify
   ├─ Jika benar: update user.isEmailVerified = true, delete OTP record, set session
   └─ Redirect ke /admin/dashboard
```

> ⚠️ **Catatan Penting Fazpass Email OTP** [[21]]:  
> Fazpass Email OTP mendukung **HTML formatting**, namun **tidak menyediakan endpoint publik untuk verifikasi OTP**. Strategi yang direkomendasikan:
> 1. Generate OTP di backend kamu (6 digit angka)
> 2. Hash & simpan di DB
> 3. Kirim OTP via Fazpass API sebagai konten email
> 4. Verifikasi OTP di backend kamu dengan membandingkan hash
> 
> Ini memberikan kontrol penuh + keamanan + tetap memanfaatkan delivery email Fazpass yang reliable.

---

## 🛠️ Integrasi Fazpass Email OTP (Code Snippet)

### 🔹 Service Layer: `lib/fazpass/email-otp.ts`
```ts
// lib/fazpass/email-otp.ts
import { z } from 'zod';

const FazpassResponseSchema = z.object({
  status: z.boolean(),
  code: z.number().optional(),
  message: z.string().optional(),
  data: z.object({
    reference_id: z.string().optional(), // Fazpass reference for tracking
  }).optional(),
});

export interface SendEmailOtpParams {
  email: string;
  otp: string; // OTP yang sudah digenerate di backend kamu
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

  // Template email HTML (support HTML formatting) [[21]]
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
        email, // Fazpass support email channel [[21]]
        gateway_key: GATEWAY_KEY,
        message: htmlContent, // Fazpass Email OTP supports HTML formatting [[21]]
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
```

### 🔹 Route Handler: `/api/auth/send-otp/route.ts`
```ts
// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { sendEmailOtpViaFazpass } from '@/lib/fazpass/email-otp';
import { rateLimit } from '@/lib/rate-limit';

const SendOtpSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const limited = await rateLimit(`otp-send:${ip}`, { max: 3, window: 60 * 60 * 1000 }); // 3x/jam
    if (!limited) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Coba lagi nanti.' }, { status: 429 });
    }

    const body = await request.json();
    const { email } = SendOtpSchema.parse(body);

    // Cek user ada & belum verified
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isEmailVerified) {
      // Return sukses palsu untuk hindari user enumeration
      return NextResponse.json({ success: true, expiresIn: 300 });
    }

    // Generate OTP 6 digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Simpan hashed OTP di DB
    await prisma.otp.upsert({
      where: { email },
      update: { otpHash, expiresAt: new Date(Date.now() + 5 * 60 * 1000), attempts: 0 },
      create: { email, otpHash, expiresAt: new Date(Date.now() + 5 * 60 * 1000), attempts: 0 },
    });

    // Kirim via Fazpass
    const fazpassResult = await sendEmailOtpViaFazpass({ email, otp, template: 'admin-verify' });
    if (!fazpassResult.success) {
      console.error('[SEND-OTP] Fazpass failed', fazpassResult.error);
      return NextResponse.json({ error: 'Gagal mengirim kode verifikasi.' }, { status: 502 });
    }

    return NextResponse.json({ 
      success: true, 
      expiresIn: 300,
      // ⚠️ JANGAN return referenceId ke frontend untuk keamanan
    });
  } catch (err) {
    console.error('[SEND-OTP] Error', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
```

---

## 🔒 Security & Production Checklist

- [ ] Password & OTP di-hash sebelum disimpan (`bcrypt` ≥12 / `argon2id`)
- [ ] Session disimpan di `httpOnly`, `Secure`, `SameSite=Lax` cookie
- [ ] Rate limiting aktif: `5 login/15min`, `3 OTP send/jam`, `3 verify/OTP`
- [ ] Fazpass keys disimpan di `.env`, **tidak** di-commit ke repo
- [ ] Whitelist IP server di dashboard Fazpass [[19]]
- [ ] Auto-cleanup OTP expired (cron job atau on-demand query)
- [ ] Error message generik (tidak membedakan gagal email vs password)
- [ ] CORS hanya izinkan origin frontend yang terdaftar
- [ ] Security headers: `Strict-Transport-Security`, `X-Frame-Options`, `Content-Security-Policy`
- [ ] Log failed attempt (tanpa password/token) untuk monitoring abuse
- [ ] Frontend tidak menyimpan token di `localStorage`/`sessionStorage`
- [ ] Test flow: verified, unverified, expired, wrong, max attempts, Fazpass API down

---

## 📊 Status & Metadata
- **Status:** 📋 Todo → 🟦 In Progress → ✅ Done
- **Labels:** `enhancement`, `security`, `authentication`, `otp`, `fazpass`, `admin-dashboard`
- **Assignee:** _(nama developer)_
- **Estimasi:** 3–5 hari kerja (termasuk testing & security review)

---

## 📚 Referensi Fazpass
- Dokumentasi API: [https://fazpass.com/developer/](https://fazpass.com/developer/) [[19]]
- Dashboard: [https://dashboard.fazpass.com](https://dashboard.fazpass.com)
- Email OTP Feature: Supports HTML formatting, sent via email channel [[21]]
- Base API Endpoint: `https://api.fazpass.com/v1/otp/request` [[19]]

---

