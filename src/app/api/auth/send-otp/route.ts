import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { writeClient } from "@/sanity/lib/writeClient";
import { sendEmailOtpViaResend } from "@/lib/resend";

const SendOtpSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    const { email } = parsed.data;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 12);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // Store in Sanity (Upsert based on email)
    // Find existing OTP record for this email
    const existingOtp = await writeClient.fetch(
      `*[_type == "otpRecord" && email == $email][0]`,
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
      });
    }

    // Send via Resend
    const emailResult = await sendEmailOtpViaResend({ 
      email, 
      otp, 
      template: 'admin-verify' 
    });

    if (!emailResult.success) {
      console.error("[SEND_OTP_API] Resend error:", emailResult.error);
      return NextResponse.json({ 
        error: `Gagal mengirim email: ${emailResult.error || "Gagal terhubung ke server email"}` 
      }, { status: 502 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "OTP telah dikirim ke email Anda",
      expiresIn: 300 
    });
    
  } catch (err) {
    console.error("[SEND_OTP_API] Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
