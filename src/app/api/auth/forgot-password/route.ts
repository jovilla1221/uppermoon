import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { writeClient } from "@/sanity/lib/writeClient";
import { sendEmailOtpViaResend } from "@/lib/resend";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ForgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email tidak valid" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Check if email exists and is verified (siteUser only)
    const user = await writeClient.fetch(
      `*[_type == "siteUser" && email == $email && isVerified == true][0]`,
      { email }
    );

    // SECURITY: Always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
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
      `*[_type == "otpRecord" && email == $email && purpose == "password-reset"][0]`,
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
