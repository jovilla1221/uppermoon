import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(req: NextRequest) {
  try {
    const notification = await req.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      transaction_id,
    } = notification;

    // 1. Verify Signature
    const hash = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hash !== signature_key) {
      console.error("[MIDTRANS_NOTIFICATION] Invalid Signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    console.log(`[MIDTRANS_NOTIFICATION] Valid notification for Order: ${order_id}, Status: ${transaction_status}`);

    // 2. Find Order in Sanity
    const query = `*[_type == "order" && orderId == $orderId][0]`;
    const order = await writeClient.fetch(query, { orderId: order_id });

    if (!order) {
      console.error(`[MIDTRANS_NOTIFICATION] Order not found: ${order_id}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Map status to our schema
    let paymentStatus = "pending";
    if (transaction_status === "capture" || transaction_status === "settlement") {
      paymentStatus = "paid";
    } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire") {
      paymentStatus = "failed";
      if (transaction_status === "expire") paymentStatus = "expired";
    } else if (transaction_status === "pending") {
      paymentStatus = "pending";
    } else if (transaction_status === "refund") {
      paymentStatus = "refunded";
    }

    // 4. Update Order in Sanity
    await writeClient
      .patch(order._id)
      .set({
        paymentStatus,
        midtransTransactionId: transaction_id,
        midtransPaymentType: payment_type,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("[MIDTRANS_NOTIFICATION_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
