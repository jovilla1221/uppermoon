import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { writeClient } from "@/sanity/lib/writeClient";
import { sendEmailOtpViaResend } from "@/lib/resend";
import bcrypt from "bcrypt";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const RegisterSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap terlalu pendek"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export async function POST(request: Request) {
  try {
    // Rate limit: 5 attempts per hour per IP
    const ip = getClientIp(request);
    const { limited, retryAfterSeconds } = rateLimit(ip, {
      storeName: "register",
      max: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (limited) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan. Coba lagi dalam ${Math.ceil(retryAfterSeconds / 60)} menit.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { fullName, email, password } = parsed.data;

    // Check if user already exists in adminUser or siteUser
    const existingAdmin = await writeClient.fetch(
      `*[_type == "adminUser" && email == $email][0]`,
      { email }
    );
    const existingUser = await writeClient.fetch(
      `*[_type == "siteUser" && email == $email][0]`,
      { email }
    );

    if (existingAdmin) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // If user exists but not verified, allow re-registration:
    // update their data, generate new OTP, and send again
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user's data
      const passwordHash = await hashPassword(password);
      await writeClient.patch(existingUser._id).set({ fullName, passwordHash }).commit();

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 12);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      // Upsert OTP record
      const existingOtp = await writeClient.fetch(
        `*[_type == "otpRecord" && email == $email][0]`,
        { email }
      );
      if (existingOtp) {
        await writeClient.patch(existingOtp._id).set({ otpHash, expiresAt, attempts: 0 }).commit();
      } else {
        await writeClient.create({ _type: "otpRecord", email, otpHash, expiresAt, attempts: 0 });
      }

      // Send email
      const emailResult = await sendEmailOtpViaResend({ email, otp, template: 'default' });
      if (!emailResult.success) {
        return NextResponse.json({ 
          error: `Gagal mengirim email verifikasi: ${emailResult.error || "Server email error"}` 
        }, { status: 502 });
      }

      return NextResponse.json({ 
        success: true, 
        message: "Kode verifikasi baru telah dikirim ke email Anda.",
        email 
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create unverified siteUser
    const newUser = await writeClient.create({
      _type: "siteUser",
      fullName,
      email,
      passwordHash,
      isVerified: false,
      role: "user",
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 12);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP in Sanity
    await writeClient.create({
      _type: "otpRecord",
      email,
      otpHash,
      expiresAt,
      attempts: 0,
    });

    // Send via Resend
    const emailResult = await sendEmailOtpViaResend({ 
      email, 
      otp, 
      template: 'default' 
    });

    if (!emailResult.success) {
      console.error("[REGISTER_API] Resend error:", emailResult.error);
      return NextResponse.json({ 
        error: `Akun dibuat, tapi gagal mengirim email: ${emailResult.error || "Gagal terhubung ke server email"}. Silakan coba login untuk kirim ulang.` 
      }, { status: 502 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Akun berhasil dibuat. Silakan cek email Anda untuk kode verifikasi.",
      email 
    });
    
  } catch (err: unknown) {
    console.error("[REGISTER_API] Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
