import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { allOrdersQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    const orders = await writeClient.fetch(allOrdersQuery);
    return NextResponse.json(orders || []);
  } catch (error: any) {
    console.error("[ADMIN_ORDERS_FETCH_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const result = await writeClient
      .patch(id)
      .set({ paymentStatus, updatedAt: new Date().toISOString() })
      .commit();

    return NextResponse.json({ success: true, id: result._id });
  } catch (error: any) {
    console.error("[ADMIN_ORDERS_UPDATE_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
