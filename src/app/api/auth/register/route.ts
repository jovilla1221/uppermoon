import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { writeClient } from "@/sanity/lib/writeClient";
import { sendEmailOtpViaFazpass } from "@/lib/fazpass";
import bcrypt from "bcrypt";

const RegisterSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap terlalu pendek"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export async function POST(request: Request) {
  try {
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

    if (existingAdmin || existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
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
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store OTP in Sanity
    await writeClient.create({
      _type: "otpRecord",
      email,
      otpHash,
      expiresAt,
      attempts: 0,
    });

    // Send via Fazpass
    const fazpassResult = await sendEmailOtpViaFazpass({ 
      email, 
      otp, 
      template: 'default' 
    });

    if (!fazpassResult.success) {
      console.error("[REGISTER_API] Fazpass error:", fazpassResult.error);
      return NextResponse.json({ error: "Akun dibuat, tapi gagal mengirim email verifikasi. Silakan login untuk kirim ulang." }, { status: 502 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Akun berhasil dibuat. Silakan cek email Anda untuk kode verifikasi.",
      email 
    });
    
  } catch (err: any) {
    console.error("[REGISTER_API] Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
