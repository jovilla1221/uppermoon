import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Simple token-based session
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
    return NextResponse.json({ success: true, token });
  }

  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}
