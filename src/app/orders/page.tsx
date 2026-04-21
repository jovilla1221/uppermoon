import { Metadata } from "next";
import OrdersClient from "./OrdersClient";
import { client } from "@/sanity/lib/client";
import { ordersByUserQuery } from "@/sanity/lib/queries";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ORDER HISTORY | UPPERMOON",
  description: "View your previous orders and track their delivery status.",
};

export default async function MyOrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await client.fetch(ordersByUserQuery, { userId: user.userId });

  return <OrdersClient orders={orders} />;
}
