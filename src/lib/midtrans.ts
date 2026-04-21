import midtransClient from "midtrans-client";

// Trim to guard against trailing newlines when env vars are set via CLI
const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
const clientKey = (process.env.MIDTRANS_CLIENT_KEY || "").trim();
const isProduction = (process.env.MIDTRANS_IS_PRODUCTION || "false").trim() === "true";

console.log(`[Midtrans] Mode: ${isProduction ? "PRODUCTION" : "SANDBOX"} | ServerKey prefix: ${serverKey.substring(0, 12)}`);

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

export const MIDTRANS_CLIENT_KEY = clientKey;
export const MIDTRANS_IS_PRODUCTION = isProduction;
