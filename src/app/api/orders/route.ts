import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { client } from "@/sanity/lib/client";
import { ordersByUserQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await client.fetch(ordersByUserQuery, { userId: user.userId });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("[ORDERS_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
