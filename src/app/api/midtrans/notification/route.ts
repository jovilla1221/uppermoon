import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(req: NextRequest) {
  try {
    const notification = await req.json();
    // Trim to match the fix in midtrans.ts — prevents signature mismatch
    const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      transaction_id,
    } = notification;

    console.log(`[MIDTRANS_NOTIFICATION] Received: order=${order_id}, status=${transaction_status}, payment_type=${payment_type}`);

    // 1. Verify Signature (only if signature_key is present)
    if (signature_key) {
      const hash = crypto
        .createHash("sha512")
        .update(order_id + status_code + gross_amount + serverKey)
        .digest("hex");

      if (hash !== signature_key) {
        console.error(`[MIDTRANS_NOTIFICATION] Invalid Signature! Expected: ${hash}, Got: ${signature_key}`);
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    }

    console.log(`[MIDTRANS_NOTIFICATION] Valid notification for Order: ${order_id}, Status: ${transaction_status}`);

    // 2. Find Order in Sanity
    const query = `*[_type == "order" && orderId == $orderId][0]`;
    const order = await writeClient.fetch(query, { orderId: order_id });

    if (!order) {
      console.error(`[MIDTRANS_NOTIFICATION] Order not found: ${order_id}`);
      // Return 200 OK anyway so Midtrans doesn't keep retrying
      return NextResponse.json({ status: "OK", message: "Order not found but acknowledged" });
    }

    // 3. Map Midtrans status to our schema
    let paymentStatus = "pending";
    if (transaction_status === "capture" || transaction_status === "settlement") {
      paymentStatus = "paid";
    } else if (transaction_status === "deny" || transaction_status === "cancel") {
      paymentStatus = "failed";
    } else if (transaction_status === "expire") {
      paymentStatus = "expired";
    } else if (transaction_status === "pending") {
      paymentStatus = "pending";
    } else if (transaction_status === "refund") {
      paymentStatus = "refunded";
    }

    console.log(`[MIDTRANS_NOTIFICATION] Updating order ${order_id} to status: ${paymentStatus}`);

    // 4. Update Order in Sanity & Decrement Stock if newly paid
    if (paymentStatus === "paid" && order.paymentStatus !== "paid") {
      console.log(`[MIDTRANS_NOTIFICATION] Order ${order_id} is newly PAID. Decrementing stock...`);
      
      // Perform as part of a transaction/batch if possible, but for now individual patches
      for (const item of order.items || []) {
        try {
          // Find product to get ID and ensure it exists
          const productQuery = `*[_type == "product" && slug.current == $slug][0]._id`;
          const productId = await writeClient.fetch(productQuery, { slug: item.productSlug });
          
          if (productId) {
            console.log(`[MIDTRANS_NOTIFICATION] Decrementing stock for product: ${item.productName}, Size: ${item.size}, Qty: ${item.quantity}`);
            
            // Note: We use the size filter to target the correct variant in the array
            await writeClient
              .patch(productId)
              .dec({ [`variants[size == "${item.size}"].stock`]: item.quantity })
              .commit();
          }
        } catch (itemError) {
          console.error(`[MIDTRANS_NOTIFICATION] Failed to decrement stock for item ${item.productName}:`, itemError);
        }
      }
    }

    await writeClient
      .patch(order._id)
      .set({
        paymentStatus,
        midtransTransactionId: transaction_id,
        midtransPaymentType: payment_type,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log(`[MIDTRANS_NOTIFICATION] Order ${order_id} updated successfully to ${paymentStatus}`);
    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("[MIDTRANS_NOTIFICATION_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
