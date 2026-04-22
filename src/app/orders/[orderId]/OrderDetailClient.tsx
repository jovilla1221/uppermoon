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
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const router = useRouter();

  // Sync state if server component passes new initialOrder (due to router.refresh)
  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

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
      }, 2000); // Poll every 2s for faster update if page just loaded
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
          setOrder((prev: any) => ({ ...prev, paymentStatus: "paid" }));
          
          fetch(`/api/admin/orders`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: order._id, paymentStatus: "paid" })
          }).catch(() => {});
          
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

  const handleTrackPackage = async () => {
    if (!order.waybill) return;
    
    setIsTrackingOpen(true);
    setIsTrackingLoading(true);
    setTrackingError(null);
    
    try {
      const res = await fetch("/api/shipping/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          awb: order.waybill,
          courier: order.courierName?.toLowerCase() || "sicepat"
        })
      });
      const result = await res.json();
      if (result.success) {
        setTrackingData(result.data);
      } else {
        setTrackingError(result.error || "Failed to fetch tracking information.");
      }
    } catch (err) {
      setTrackingError("Check your internet connection and try again.");
    } finally {
      setIsTrackingLoading(false);
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

          <section className="bg-surface-container p-6 md:p-10 relative overflow-hidden">
            <h2 className="font-label text-[0.6875rem] font-bold tracking-[0.2em] text-on-surface mb-8 border-b border-surface-container-highest pb-2 uppercase text-center md:text-left">Shipping & Delivery</h2>
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

            {/* Waybill / Tracking Section if available */}
            {order.waybill && (
              <div className="mt-10 pt-8 border-t border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="font-label uppercase">
                  <p className="text-outline text-[0.625rem] tracking-[0.2em] mb-1">AIR WAYBILL (RESI)</p>
                  <p className="text-on-surface font-black text-sm tracking-widest">{order.waybill}</p>
                  <p className="text-primary text-[0.5625rem] font-bold tracking-[0.1em]">{order.courierName} / {order.courierService}</p>
                </div>
                <button 
                  onClick={handleTrackPackage}
                  className="bg-secondary text-on-secondary px-6 py-3 font-label text-[0.625rem] font-black tracking-[0.2em] uppercase hover:bg-on-surface transition-all shadow-sm"
                >
                  TRACK PACKAGE
                </button>
              </div>
            )}
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

      {/* --- TRACKING DRAWER (Slide-over) --- */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-500 bg-surface-dim/80 backdrop-blur-sm ${isTrackingOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsTrackingOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-surface-container shadow-2xl transition-transform duration-500 flex flex-col ${isTrackingOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 border-b border-surface-container-highest flex items-center justify-between">
            <div>
              <h2 className="font-headline italic text-2xl tracking-tight">Track Package</h2>
              <p className="font-label text-[0.5625rem] tracking-[0.3em] text-outline uppercase mt-1">NO. RESI: {order.waybill}</p>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {isTrackingLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-label text-[0.625rem] tracking-widest text-outline uppercase animate-pulse">Retrieving live status...</p>
              </div>
            ) : trackingError ? (
              <div className="h-full flex flex-col items-center justify-center gap-6 text-center">
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase mb-2">Tracking Not Found</p>
                  <p className="text-[0.625rem] text-outline leading-relaxed uppercase">{trackingError}</p>
                </div>
                <button 
                  onClick={handleTrackPackage}
                  className="bg-primary text-on-primary px-8 py-3 font-label text-[0.625rem] font-bold tracking-widest uppercase"
                >
                  RETRY
                </button>
              </div>
            ) : trackingData ? (
              <div className="space-y-12">
                {/* Summary Card */}
                <div className="bg-surface-container-low p-6 border-l-4 border-primary shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-label text-[0.625rem] font-bold text-primary tracking-[0.2em] uppercase">{trackingData.summary.status}</p>
                    <p className="font-label text-[0.5625rem] text-outline uppercase">{trackingData.summary.date}</p>
                  </div>
                  <p className="text-sm font-bold text-on-surface uppercase leading-tight mb-2">{trackingData.summary.desc}</p>
                  <div className="flex gap-4 text-[0.5625rem] text-outline uppercase tracking-widest mt-4 pt-4 border-t border-surface-container-highest/30">
                    <span>FROM: {trackingData.detail.shipper}</span>
                    <span>TO: {trackingData.detail.receiver}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-0 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-surface-container-highest"></div>
                  {trackingData.history.map((h: any, i: number) => (
                    <div key={i} className="pl-8 pb-10 relative group">
                      {/* Dot */}
                      <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-surface-container transition-all ${i === 0 ? "bg-primary scale-125 z-10" : "bg-outline z-0"}`}></div>
                      
                      <p className={`font-label text-[0.5625rem] tracking-widest uppercase mb-2 ${i === 0 ? "text-primary font-bold" : "text-outline"}`}>
                        {h.date}
                      </p>
                      <p className={`text-[0.6875rem] font-bold uppercase leading-relaxed ${i === 0 ? "text-on-surface" : "text-secondary"}`}>
                        {h.desc}
                      </p>
                      {h.location && (
                        <p className="text-[0.625rem] text-outline mt-1 font-medium bg-surface-container-low inline-block px-2 py-0.5 rounded uppercase tracking-tighter">
                          📍 {h.location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-surface-container-highest bg-surface-container-low">
            <p className="text-[0.5625rem] tracking-[0.1em] text-outline uppercase leading-relaxed text-center">
              Tracking data is provided by Binderbyte via {order.courierName}. Status updates may be delayed by up to 15 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
