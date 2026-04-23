import { NextResponse } from "next/server";
import { z } from "zod";
import { comparePassword, setSessionCookie } from "@/lib/auth";
import { writeClient } from "@/sanity/lib/writeClient";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const LoginSchema = z.object({
  identifier: z.string().min(1, "Email atau username wajib diisi"),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    // Rate limit: 5 attempts per 15 minutes per IP
    const ip = getClientIp(request);
    const { limited, retryAfterSeconds } = rateLimit(ip, {
      storeName: "login",
      max: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (limited) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan. Coba lagi dalam ${retryAfterSeconds} detik.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { identifier, password } = parsed.data;

    // Search for user in Sanity (supports both adminUser and siteUser)
    // Try adminUser by email OR username
    let user = await writeClient.fetch(
      `*[_type == "adminUser" && (email == $identifier || username == $identifier)][0]`,
      { identifier }
    );

    // If not found in admin, check general users (siteUser) by email
    if (!user) {
      user = await writeClient.fetch(
        `*[_type == "siteUser" && email == $identifier][0]`,
        { identifier }
      );
    }

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Email atau password tidak valid" }, { status: 401 });
    }

    const isPasswordMatch = await comparePassword(password, user.passwordHash);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: "Email atau password tidak valid" }, { status: 401 });
    }

    // Check if user is verified (only for siteUser, admin is usually pre-verified)
    if (user._type === "siteUser" && !user.isVerified) {
      return NextResponse.json({ 
        error: "Email belum diverifikasi. Silakan cek email Anda.",
        requiresVerification: true,
        email: user.email
      }, { status: 403 });
    }

    // Determine the correct role
    const resolvedRole = user.role || (user._type === "adminUser" ? "admin" : "user");

    // Success - Set session cookie directly for admin or verified user
    const sessionCookie = setSessionCookie({
      userId: user._id,
      username: user.username || user.fullName,
      email: user.email,
      role: resolvedRole,
    });
    
    // Update last login timestamp in Sanity
    try {
      await writeClient
        .patch(user._id)
        .set({ lastLoginAt: new Date().toISOString() })
        .commit();
    } catch (trackErr) {
      console.error("[LOGIN_API] Failed to update lastLoginAt:", trackErr);
      // We don't block login if tracking fails
    }

    const response = NextResponse.json({ 
      success: true, 
      message: "Login berhasil",
      role: resolvedRole
    });

    response.headers.set("Set-Cookie", sessionCookie);

    return response;
    
  } catch (err) {
    console.error("[LOGIN_API] Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
