"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

export default function OrderDetailClient({ initialOrder }: { initialOrder: any }) {
  const [order, setOrder] = useState(initialOrder);
  const { formatPrice } = useCart();
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  // Polling for status updates if pending
  useEffect(() => {
    if (order.paymentStatus === "pending") {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/orders/${order.orderId}`);
          const data = await res.json();
          if (data.order && data.order.paymentStatus !== "pending") {
            setOrder(data.order);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Status check failed", err);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [order.paymentStatus, order.orderId]);

  const handleRetryPayment = () => {
    if (!order.snapToken) {
      alert("Snap token is missing. Please contact support.");
      return;
    }
    
    if (typeof window === "undefined" || !window.snap) {
      alert("Memuat sistem pembayaran lambat atau diblokir oleh AdBlocker di browser Anda. Harap matikan AdBlock/Brave Shields untuk website ini atau tunggu sebentar.");
      return;
    }

    try {
      setIsRetrying(true);
      window.snap.pay(order.snapToken, {
        onSuccess: () => { 
          setIsRetrying(false);
          router.refresh(); 
        },
        onPending: () => { 
          setIsRetrying(false);
          router.refresh(); 
        },
        onClose: () => { 
          setIsRetrying(false); 
        },
        onError: () => {
          setIsRetrying(false);
          alert("Pembayaran gagal dijalankan. Silakan coba lagi.");
        }
      });
    } catch (err) {
      setIsRetrying(false);
      console.error(err);
      alert("Gagal memanggil popup pembayaran. Coba refresh halaman.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-primary bg-primary/10 border-primary/20";
      case "failed":
      case "expired": return "text-error bg-error/10 border-error/20";
      default: return "text-secondary bg-surface-container-highest border-outline-variant/30";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-[fade-up-slide_0.4s_forwards]">
      <nav className="flex items-center gap-4 mb-10 text-[0.625rem] tracking-[0.2em] font-bold uppercase text-outline">
        <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-primary transition-colors">MY ORDERS</Link>
        <span>/</span>
        <span className="text-secondary">{order.orderId}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-headline italic text-4xl md:text-5xl tracking-tight leading-none mb-2">Order Summary</h1>
          <p className="font-label text-[0.625rem] tracking-[0.3em] text-outline uppercase">PLACED ON: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className={`px-4 py-2 border font-label text-[0.625rem] font-bold tracking-[0.2em] uppercase rounded-full ${getStatusColor(order.paymentStatus)}`}>
          {order.paymentStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-surface-container p-6 md:p-10">
            <h2 className="font-label text-[0.6875rem] font-bold tracking-[0.2em] text-on-surface mb-8 border-b border-surface-container-highest pb-2 uppercase text-center md:text-left">Items</h2>
            <div className="space-y-8">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-6 items-center">
                  <div className="w-16 h-20 bg-surface-container-highest shrink-0 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden relative">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-label text-[0.75rem] font-bold uppercase mb-1">{item.productName}</h3>
                    <div className="flex flex-wrap gap-4 text-[0.625rem] tracking-widest text-outline uppercase font-medium">
                      <span>SIZE: {item.size}</span>
                      <span>QTY: {item.quantity}</span>
                      <span>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-[0.6875rem] font-bold tracking-tight">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-container p-6 md:p-10">
            <h2 className="font-label text-[0.6875rem] font-bold tracking-[0.2em] text-on-surface mb-8 border-b border-surface-container-highest pb-2 uppercase text-center md:text-left">Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-label text-[0.6875rem] tracking-[0.1em] text-secondary leading-relaxed uppercase">
              <div>
                <p className="text-outline mb-2">RECIPIENT</p>
                <p className="text-on-surface font-bold text-sm">{order.customerName}</p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-outline mb-2">DELIVERY ADDRESS</p>
                <p className="text-on-surface">{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                <p>{order.shippingAddress.postalCode}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-container p-8 border-t-4 border-primary shadow-light">
            <h2 className="font-label text-[0.6875rem] font-bold tracking-[0.2em] text-on-surface mb-6 uppercase">Total Amount</h2>
            <div className="space-y-3 pb-6 border-b border-surface-container-highest">
              <div className="flex justify-between items-center text-[0.625rem] tracking-[0.1em] uppercase">
                <span className="text-outline">Subtotal</span>
                <span className="text-secondary font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[0.625rem] tracking-[0.1em] uppercase">
                <span className="text-outline">Shipping</span>
                <span className="text-secondary font-medium">{formatPrice(order.shippingCost)}</span>
              </div>
            </div>
            <div className="pt-4 flex justify-between items-baseline mb-8">
              <span className="font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase">TOTAL</span>
              <span className="text-2xl font-black text-primary">{formatPrice(order.totalAmount)}</span>
            </div>

            {order.paymentStatus === "pending" && (
              <button 
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="w-full bg-primary text-on-primary py-4 font-label text-[0.625rem] font-bold tracking-[0.3em] uppercase hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isRetrying ? "OPENING SECURE POPUP..." : "PAY NOW"}
              </button>
            )}
            
            {order.paymentStatus === "paid" && (
              <div className="w-full bg-primary/10 text-primary border border-primary/20 py-4 font-label text-[0.625rem] font-black tracking-[0.3em] uppercase text-center">
                PAYMENT COMPLETED
              </div>
            )}

            <p className="mt-8 text-center text-[0.625rem] tracking-widest text-outline uppercase leading-relaxed">
              Order ID: <span className="text-secondary select-all font-bold">{order.orderId}</span>
            </p>
          </section>

          <section className="p-6 border border-surface-container-highest text-center">
            <p className="font-label text-[0.625rem] tracking-[0.15em] text-outline uppercase mb-4 leading-relaxed">Need assistance with your order?</p>
            <Link href="mailto:support@uppermoon.co" className="text-[0.625rem] font-bold tracking-[0.25em] uppercase border-b border-primary hover:opacity-70 transition-opacity">CONTACT SUPPORT</Link>
          </section>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link href="/products" className="font-label text-[0.625rem] font-bold tracking-[0.4em] uppercase text-secondary hover:text-primary transition-colors py-4 px-8 border-[0.5px] border-surface-container-highest hover:bg-surface-container-low">
          ← CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
