import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: decoded });
  } catch (err) {
    console.error("[ME_API] Error:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
