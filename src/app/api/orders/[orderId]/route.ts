import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { client } from "@/sanity/lib/client";
import { orderByIdQuery } from "@/sanity/lib/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await client.fetch(orderByIdQuery, { orderId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security: Check if order belongs to user (or is admin)
    // In our query, user._ref is userId. But our query uses $orderId.
    // Let's verify the user owns the order.
    if (order.user._ref !== user.userId && user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("[ORDER_DETAIL_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
