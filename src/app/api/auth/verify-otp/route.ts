import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { writeClient } from "@/sanity/lib/writeClient";
import { setSessionCookie } from "@/lib/auth";

const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VerifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const { email, otp } = parsed.data;

    // Get OTP record from Sanity
    const otpRecord = await writeClient.fetch(
      `*[_type == "otpRecord" && email == $email][0]`,
      { email }
    );

    if (!otpRecord) {
      return NextResponse.json({ error: "Sesi verifikasi kadaluarsa" }, { status: 400 });
    }

    // Check expiration
    if (new Date(otpRecord.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Kode OTP kadaluarsa" }, { status: 400 });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      return NextResponse.json({ error: "Terlalu banyak percobaan. Silakan minta kode baru." }, { status: 400 });
    }

    // Compare Hash
    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      // Increment attempts
      await writeClient
        .patch(otpRecord._id)
        .set({ attempts: (otpRecord.attempts || 0) + 1 })
        .commit();
      
      return NextResponse.json({ error: "Kode OTP salah" }, { status: 401 });
    }

    // OTP is valid!
    // Get the user data to create session (Search in both adminUser and siteUser)
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

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Update user verification status if needed
    if (!user.isVerified) {
      await writeClient.patch(user._id).set({ isVerified: true }).commit();
    }

    // Delete OTP record
    await writeClient.delete(otpRecord._id);

    // Create session cookie
    const sessionCookie = setSessionCookie({
      userId: user._id,
      username: user.username || user.fullName || "User",
      email: user.email,
      role: user.role || "user",
    });

    const response = NextResponse.json({ 
      success: true, 
      message: "Verifikasi berhasil" 
    });

    // Set cookie header
    response.headers.set("Set-Cookie", sessionCookie);

    return response;
    
  } catch (err) {
    console.error("[VERIFY_OTP_API] Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
