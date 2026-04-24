import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { writeClient } from "@/sanity/lib/writeClient";
import { sendEmailOtpViaResend } from "@/lib/resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export async function POST(request: Request) {
  try {
    // Rate limit: 3 attempts per hour per IP
    const ip = getClientIp(request);
    const { limited, retryAfterSeconds } = rateLimit(ip, {
      storeName: "forgot-password",
      max: 3,
      windowMs: 60 * 60 * 1000,
    });

    if (limited) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan. Coba lagi dalam ${Math.ceil(retryAfterSeconds / 60)} menit.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = ForgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email tidak valid" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Check if email exists in either adminUser or siteUser
    let user = await writeClient.fetch(
      `*[_type == "adminUser" && email == $email][0]`,
      { email }
    );

    if (!user) {
      user = await writeClient.fetch(
        `*[_type == "siteUser" && email == $email][0]`,
        { email }
      );
    }

    // SECURITY: Always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      console.log(`[FORGOT_PASSWORD] Attempt for non-existent email: ${email}`);
      return NextResponse.json({
        success: true,
        message: "Jika email terdaftar, kode verifikasi telah dikirim.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 12);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Upsert OTP record with purpose 'password-reset'
    const existingOtp = await writeClient.fetch(
      `*[_type == "otpRecord" && email == $email && purpose == "password-reset"] | order(_updatedAt desc)[0]`,
      { email }
    );

    if (existingOtp) {
      await writeClient
        .patch(existingOtp._id)
        .set({ otpHash, expiresAt, attempts: 0 })
        .commit();
    } else {
      await writeClient.create({
        _type: "otpRecord",
        email,
        otpHash,
        expiresAt,
        attempts: 0,
        purpose: "password-reset",
      });
    }

    // Send email via Resend
    const emailResult = await sendEmailOtpViaResend({
      email,
      otp,
      template: "password-reset",
    });

    if (!emailResult.success) {
      console.error("[FORGOT_PASSWORD_API] Resend error:", emailResult.error);
      return NextResponse.json(
        {
          error: `Gagal mengirim email: ${emailResult.error || "Server email error"}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Jika email terdaftar, kode verifikasi telah dikirim.",
    });
  } catch (err) {
    console.error("[FORGOT_PASSWORD_API] Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
