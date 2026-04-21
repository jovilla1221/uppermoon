"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

export default function CheckoutClient() {
  const { cartItems, cartTotal, formatPrice, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shipping cost constant match API
  const shippingCost = 25000;
  const grandTotal = cartTotal + shippingCost;

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?callbackUrl=/checkout`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="font-headline italic text-4xl mb-6 uppercase">YOUR BAG IS EMPTY</h1>
        <button 
          onClick={() => router.push("/products")}
          className="border-b border-on-surface pb-1 font-label text-[0.6875rem] tracking-[0.2em] font-bold uppercase transition-opacity hover:opacity-70"
        >
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !shippingInfo.street || !shippingInfo.city || !shippingInfo.province || !shippingInfo.postalCode) {
      setError("Please fill in all shipping details.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          shippingAddress: shippingInfo,
          customerPhone: phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const { snapToken, orderId, _id } = data;

      window.snap.pay(snapToken, {
        onSuccess: async (result: any) => {
          setIsProcessing(true);
          try {
             await fetch("/api/admin/orders", {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ id: _id, paymentStatus: "paid" })
             });
          } catch(e) {}
          
          clearCart?.(); // We'll add this to context
          router.push(`/orders/${orderId}`);
        },
        onPending: async (result: any) => {
          clearCart?.();
          router.push(`/orders/${orderId}`);
        },
        onError: (result: any) => {
          console.error("Error", result);
          setError("Payment failed. Please try again.");
          setIsProcessing(false);
        },
        onClose: () => {
          console.log("User closed popup");
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setError(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <h1 className="font-headline italic text-4xl md:text-5xl mb-12 uppercase tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handlePay} className="space-y-10">
            <section>
              <h2 className="font-label text-[0.75rem] font-bold tracking-[0.2em] uppercase text-outline mb-8 border-b border-surface-container pb-2">1. SHIPPING INFORMATION</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-[0.625rem] text-outline tracking-widest uppercase">Full Name</label>
                  <input type="text" value={user.username} disabled className="w-full bg-surface-container text-secondary px-4 py-3 text-sm focus:outline-none cursor-not-allowed border-none" />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[0.625rem] text-outline tracking-widest uppercase">Email Address</label>
                  <input type="email" value={user.email} disabled className="w-full bg-surface-container text-secondary px-4 py-3 text-sm focus:outline-none cursor-not-allowed border-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label text-[0.625rem] text-outline tracking-widest uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 8xx xxxx xxxx"
                    className="w-full bg-surface px-4 py-3 text-sm border border-outline-variant/30 focus:border-primary transition-colors focus:ring-0" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label text-[0.625rem] text-outline tracking-widest uppercase">Street Address</label>
                  <textarea 
                    required 
                    rows={2}
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                    placeholder="Street Name, Building, House Number"
                    className="w-full bg-surface px-4 py-3 text-sm border border-outline-variant/30 focus:border-primary transition-colors resize-none focus:ring-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[0.625rem] text-outline tracking-widest uppercase">City</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="w-full bg-surface px-4 py-3 text-sm border border-outline-variant/30 focus:border-primary transition-colors focus:ring-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[0.625rem] text-outline tracking-widest uppercase">Province</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingInfo.province}
                    onChange={(e) => setShippingInfo({...shippingInfo, province: e.target.value})}
                    className="w-full bg-surface px-4 py-3 text-sm border border-outline-variant/30 focus:border-primary transition-colors focus:ring-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[0.625rem] text-outline tracking-widest uppercase">Postal Code</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                    className="w-full bg-surface px-4 py-3 text-sm border border-outline-variant/30 focus:border-primary transition-colors focus:ring-0" 
                  />
                </div>
              </div>
            </section>

            {error && (
              <div className="bg-error-container text-on-error-container p-4 text-xs font-label uppercase tracking-widest border border-error/20">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container p-8 sticky top-24">
            <h2 className="font-label text-[0.75rem] font-bold tracking-[0.2em] uppercase text-on-surface mb-8 border-b border-surface-container-highest pb-2">ORDER SUMMARY</h2>
            
            <div className="max-h-96 overflow-y-auto space-y-6 pr-4 hide-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-surface-container-highest shrink-0 relative overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <h3 className="font-label text-[0.6875rem] font-bold uppercase truncate max-w-[200px]">{item.name}</h3>
                    <div className="flex justify-between items-center text-[0.625rem] text-secondary tracking-widest uppercase">
                      <span>Size: {item.size} • Qty: {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[1px] w-full bg-surface-container-highest my-8"></div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-label text-[0.6875rem] tracking-widest uppercase text-secondary">Subtotal</span>
                <span className="font-body text-sm font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label text-[0.6875rem] tracking-widest uppercase text-secondary">Shipping Cost</span>
                <span className="font-body text-sm font-medium">{formatPrice(shippingCost)}</span>
              </div>
              <div className="h-[1px] w-full bg-surface-container-highest mt-4"></div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-label text-[0.75rem] font-bold tracking-[0.2em] uppercase text-on-surface">TOTAL</span>
                <span className="text-xl font-body font-black text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={isProcessing}
              className="w-full mt-10 bg-primary text-on-primary py-5 font-label text-[0.75rem] font-bold tracking-[0.3em] uppercase hover:bg-primary-container transition-all disabled:opacity-50 disabled:cursor-wait shadow-xl"
            >
              {isProcessing ? "PROCESSING..." : "PAY NOW"}
            </button>
            <p className="text-center mt-6 font-label text-[0.625rem] text-outline tracking-widest uppercase">Powered by Midtrans • Secure 256-bit SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
