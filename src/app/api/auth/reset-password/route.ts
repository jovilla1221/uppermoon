import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { writeClient } from "@/sanity/lib/writeClient";
import { hashPassword } from "@/lib/auth";

const ResetPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
  otp: z.string().length(6, "Kode OTP harus 6 digit"),
  newPassword: z.string().min(8, "Password minimal 8 karakter"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ResetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, otp, newPassword } = parsed.data;

    // Get OTP record for password-reset purpose
    const otpRecord = await writeClient.fetch(
      `*[_type == "otpRecord" && email == $email && purpose == "password-reset"][0]`,
      { email }
    );

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Sesi reset password tidak ditemukan atau sudah kedaluwarsa" },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date(otpRecord.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Kode OTP sudah kedaluwarsa. Silakan minta kode baru." },
        { status: 400 }
      );
    }

    // Check attempts (max 5 for password reset)
    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Silakan minta kode baru." },
        { status: 400 }
      );
    }

    // Compare OTP hash
    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      // Increment attempts
      await writeClient
        .patch(otpRecord._id)
        .set({ attempts: (otpRecord.attempts || 0) + 1 })
        .commit();

      return NextResponse.json(
        { error: "Kode OTP salah" },
        { status: 401 }
      );
    }

    // OTP valid — Find user and update password
    const user = await writeClient.fetch(
      `*[_type == "siteUser" && email == $email][0]`,
      { email }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hash new password and update
    const newPasswordHash = await hashPassword(newPassword);
    await writeClient
      .patch(user._id)
      .set({ passwordHash: newPasswordHash })
      .commit();

    // Delete OTP record
    await writeClient.delete(otpRecord._id);

    return NextResponse.json({
      success: true,
      message: "Password berhasil direset. Silakan login dengan password baru.",
    });
  } catch (err) {
    console.error("[RESET_PASSWORD_API] Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
