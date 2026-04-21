import { Metadata } from "next";
import OrderDetailClient from "./OrderDetailClient";
import { client } from "@/sanity/lib/client";
import { orderByIdQuery } from "@/sanity/lib/queries";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ORDER SUMMARY | UPPERMOON",
};

export default async function OrderPage({ params }: { params: { orderId: string } }) {
  const { orderId } = await params;
  
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect(`/login?callbackUrl=/orders/${orderId}`);
  }

  // Fetch Order
  const order = await client.fetch(orderByIdQuery, { orderId });

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="font-headline italic text-2xl uppercase">Order NOT FOUND.</h1>
      </div>
    );
  }

  // Ownership check
  if (order.user._ref !== user.userId && user.role !== "admin") {
    redirect("/");
  }

  return <OrderDetailClient initialOrder={order} />;
}
