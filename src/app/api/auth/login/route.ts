import { NextResponse } from "next/server";
import { z } from "zod";
import { comparePassword, setSessionCookie } from "@/lib/auth";
import { writeClient } from "@/sanity/lib/writeClient";

const LoginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string().min(8),
}).refine(data => data.email || data.username, {
  message: "Email or username is required",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Input tidak valid" }, { status: 400 });
    }

    const { email, username, password } = parsed.data;

    // Search for user in Sanity (supports both adminUser and siteUser)
    // First try adminUser
    const adminQuery = email 
      ? `*[_type == "adminUser" && email == $email][0]` 
      : `*[_type == "adminUser" && username == $username][0]`;
    
    let user = await writeClient.fetch(adminQuery, email ? { email } : { username });

    // If not found in admin, check general users (siteUser)
    if (!user) {
      const userQuery = `*[_type == "siteUser" && email == $email][0]`;
      user = await writeClient.fetch(userQuery, { email: email || username });
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
