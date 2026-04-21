"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function OrdersClient({ orders }: { orders: any[] }) {
  const { formatPrice } = useCart();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-primary border-primary/30";
      case "failed":
      case "expired": return "text-error border-error/30";
      default: return "text-secondary border-outline-variant/30";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="font-headline italic text-4xl mb-6 uppercase tracking-tight">NO ORDERS YET</h1>
        <p className="font-label text-[0.625rem] tracking-[0.2em] text-outline uppercase mb-10">Start your journey with our minimalist architectural pieces.</p>
        <Link 
          href="/products"
          className="bg-primary text-on-primary py-4 px-10 font-label text-[0.6875rem] font-bold tracking-[0.3em] uppercase hover:bg-primary-container transition-all"
        >
          EXPLORE SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 animate-[fade-up-slide_0.5s_forwards]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h1 className="font-headline italic text-5xl md:text-6xl tracking-tighter leading-none mb-3">Order History</h1>
          <p className="font-label text-[0.625rem] tracking-[0.3em] text-outline uppercase">A ARCHIVE OF YOUR ARCHITECTURAL SILENCE SELECTIONS</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link 
            key={order.orderId} 
            href={`/orders/${order.orderId}`}
            className="group block bg-surface-container border border-transparent hover:border-outline-variant/30 transition-all duration-300"
          >
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-label text-sm font-black text-on-surface select-all">{order.orderId}</span>
                  <span className={`px-3 py-1 border text-[10px] font-bold tracking-widest uppercase rounded-full ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] tracking-[0.1em] text-outline uppercase font-medium">
                  <span>DATE: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>ITEMS: {order.items?.length || 0} PIECES</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-12 border-t border-surface-container-highest md:border-none pt-6 md:pt-0">
                <div className="text-right">
                    <p className="font-label text-[0.625rem] tracking-widest text-outline uppercase mb-1">TOTAL</p>
                    <p className="font-body text-lg font-black text-on-surface">{formatPrice(order.totalAmount)}</p>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
