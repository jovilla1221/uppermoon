import { NextResponse } from "next/server";

export async function GET() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION;

  return NextResponse.json({
    serverKey_prefix: serverKey.substring(0, 15) || "NOT SET",
    serverKey_length: serverKey.length,
    clientKey_prefix: clientKey.substring(0, 20) || "NOT SET",
    clientKey_length: clientKey.length,
    isProduction,
    env: process.env.NODE_ENV,
  });
}
