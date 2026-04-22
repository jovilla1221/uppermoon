"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { COURIERS } from "@/lib/binderbyte";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

interface Region {
  id: string;
  name: string;
}

interface ShippingOption {
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export default function CheckoutClient() {
  const { cartItems, cartTotal, formatPrice, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Address Selection States
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);

  const [shippingInfo, setShippingInfo] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
    district: "",
    cityId: "",
    provinceId: "",
    districtId: "",
  });

  const [customerName, setCustomerName] = useState(user?.username || "");
  const [phone, setPhone] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedService, setSelectedService] = useState<ShippingOption | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Constants
  const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight || 500) * item.quantity, 0);
  const totalAmount = cartTotal + (selectedService?.cost || 0);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?callbackUrl=/checkout`);
    }
  }, [user, loading, router]);

  // Initial Fetch: Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("/api/shipping/provinces");
        const data = await res.json();
        if (data.data) setProvinces(data.data);
      } catch (err) {
        console.error("Failed to fetch provinces", err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Cities when province changes
  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const provinceName = provinces.find(p => p.id === provinceId)?.name || "";
    
    setShippingInfo(prev => ({ 
      ...prev, 
      provinceId, 
      province: provinceName,
      cityId: "", city: "", 
      districtId: "", district: "" 
    }));
    setCities([]);
    setDistricts([]);
    setShippingOptions([]);
    setSelectedService(null);

    if (!provinceId) return;

    setIsLoadingRegions(true);
    try {
      const res = await fetch(`/api/shipping/cities?provinceId=${provinceId}`);
      const data = await res.json();
      if (data.data) setCities(data.data);
    } catch (err) {
      console.error("Failed to fetch cities", err);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  // Fetch Districts when city changes
  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    const cityName = cities.find(c => c.id === cityId)?.name || "";

    setShippingInfo(prev => ({ 
      ...prev, 
      cityId, 
      city: cityName,
      districtId: "", district: "" 
    }));
    setDistricts([]);
    setShippingOptions([]);
    setSelectedService(null);

    if (!cityId) return;

    setIsLoadingRegions(true);
    try {
      const res = await fetch(`/api/shipping/districts?cityId=${cityId}`);
      const data = await res.json();
      if (data.data) setDistricts(data.data);
    } catch (err) {
      console.error("Failed to fetch districts", err);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const districtName = districts.find(d => d.id === districtId)?.name || "";
    setShippingInfo(prev => ({ ...prev, districtId, district: districtName }));
    setShippingOptions([]);
    setSelectedService(null);
  };

  // Fetch Costs when destination or courier changes
  const fetchCosts = useCallback(async () => {
    if (!shippingInfo.districtId || !selectedCourier) return;

    setIsLoadingShipping(true);
    setError(null);
    try {
      const res = await fetch("/api/shipping/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: shippingInfo.districtId,
          weight: totalWeight,
          courier: selectedCourier
        })
      });
      const data = await res.json();
      if (data.costs) {
        setShippingOptions(data.costs);
      } else {
        setError(data.error || "No shipping services available for this route.");
      }
    } catch (err) {
      console.error("Failed to fetch costs", err);
      setError("Failed to calculate shipping. Please try another courier.");
    } finally {
      setIsLoadingShipping(false);
    }
  }, [shippingInfo.districtId, selectedCourier, totalWeight]);

  useEffect(() => {
    fetchCosts();
  }, [fetchCosts]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !shippingInfo.street || !shippingInfo.districtId || !selectedService) {
      setError("Please complete all shipping and courier selections.");
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
          customerName,
          shippingAddress: shippingInfo,
          customerPhone: phone,
          shippingCost: selectedService.cost,
          courierName: selectedCourier.toUpperCase(),
          courierService: selectedService.service,
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
          
          clearCart?.();
          router.push(`/orders/${orderId}`);
        },
        onPending: async (result: any) => {
          clearCart?.();
          router.push(`/orders/${orderId}`);
        },
        onError: (result: any) => {
          setError("Payment failed. Please try again.");
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-12 gap-4">
        <h1 className="font-headline italic text-4xl md:text-5xl uppercase tracking-tight">Checkout</h1>
        <div className="font-label text-[0.625rem] text-secondary tracking-[0.2em] uppercase">
          Review your order and select shipping
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handlePay} className="space-y-12">
            <section className="space-y-10">
              <h2 className="font-label text-[0.75rem] font-bold tracking-[0.2em] uppercase text-primary border-b border-outline-variant/30 pb-4">1. SHIPPING ADDRESS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-3 md:col-span-2">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Recipient Name"
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 8xx xxxx xxxx"
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none" 
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">Postal Code</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                    placeholder="e.g. 12345"
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none" 
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">Street Address</label>
                  <textarea 
                    required 
                    rows={2}
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                    placeholder="Building, House Number, Floor..."
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none resize-none" 
                  />
                </div>

                {/* Region Selection */}
                <div className="space-y-3">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">Province</label>
                  <select 
                    required 
                    value={shippingInfo.provinceId}
                    onChange={handleProvinceChange}
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Province</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">City</label>
                  <select 
                    required 
                    disabled={!shippingInfo.provinceId || isLoadingRegions}
                    value={shippingInfo.cityId}
                    onChange={handleCityChange}
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">{isLoadingRegions ? "Loading..." : "Select City"}</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">District (Kecamatan)</label>
                  <select 
                    required 
                    disabled={!shippingInfo.cityId || isLoadingRegions}
                    value={shippingInfo.districtId}
                    onChange={handleDistrictChange}
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">{isLoadingRegions ? "Loading..." : "Select District"}</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-10">
              <h2 className="font-label text-[0.75rem] font-bold tracking-[0.2em] uppercase text-primary border-b border-outline-variant/30 pb-4">2. COURIER & SERVICE</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">Select Courier</label>
                  <select 
                    required 
                    disabled={!shippingInfo.districtId}
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Select Courier</option>
                    {COURIERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="font-label text-[0.625rem] text-secondary tracking-widest uppercase block">Shipping Service</label>
                  <select 
                    required 
                    disabled={shippingOptions.length === 0 || isLoadingShipping}
                    value={selectedService?.service || ""}
                    onChange={(e) => {
                      const service = shippingOptions.find(o => o.service === e.target.value);
                      setSelectedService(service || null);
                    }}
                    className="w-full bg-surface-container px-5 py-4 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">{isLoadingShipping ? "Calculating..." : "Select Service"}</option>
                    {shippingOptions.map(o => (
                      <option key={o.service} value={o.service}>
                        {o.service} - {formatPrice(o.cost)} ({o.etd} days)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {isLoadingShipping && (
                <div className="flex items-center gap-3 text-secondary text-[0.625rem] tracking-widest uppercase">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                  Calculating shipping costs...
                </div>
              )}
            </section>

            {error && (
              <div className="bg-error/10 text-error p-4 text-[0.6875rem] font-bold uppercase tracking-widest border border-error/20 flex items-center gap-3 animate-pulse">
                <span className="material-symbols-outlined text-sm">warning</span>
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container p-8 lg:p-12 sticky top-24 border border-outline-variant/10">
            <h2 className="font-label text-[0.75rem] font-bold tracking-[0.2em] uppercase text-on-surface mb-10 pb-2 border-b border-outline-variant/20 italic">Order Review</h2>
            
            <div className="max-h-72 overflow-y-auto space-y-8 mb-12 pr-4 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 group">
                  <div className="w-16 h-20 bg-black shrink-0 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <h3 className="font-label text-[0.625rem] font-bold uppercase tracking-widest truncate">{item.name}</h3>
                    <div className="flex justify-between items-center text-[0.625rem] text-secondary tracking-widest uppercase">
                      <span>{item.size} × {item.quantity}</span>
                      <span className="text-on-surface font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-8 border-t border-outline-variant/20">
              <div className="flex justify-between items-center">
                <span className="font-label text-[0.625rem] tracking-[0.2em] uppercase text-secondary">Summary</span>
                <span className="font-body text-sm font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label text-[0.625rem] tracking-[0.2em] uppercase text-secondary">Weight</span>
                <span className="font-body text-sm font-medium text-primary">{(totalWeight / 1000).toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label text-[0.625rem] tracking-[0.2em] uppercase text-secondary">Shipping</span>
                <span className="font-body text-sm font-medium">
                  {selectedService ? formatPrice(selectedService.cost) : "—"}
                </span>
              </div>
              
              <div className="pt-8 mt-4 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="font-label text-[0.75rem] font-black tracking-[0.3em] uppercase text-on-surface italic">Final Amount</span>
                <span className="text-2xl font-headline font-black text-primary">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={isProcessing || !selectedService}
              className="w-full mt-12 bg-primary text-on-primary py-6 font-label text-[0.75rem] font-bold tracking-[0.4em] uppercase hover:bg-on-primary hover:text-primary transition-all disabled:opacity-30 shadow-2xl relative overflow-hidden group"
            >
              <span className="relative z-10">{isProcessing ? "PROCESSING..." : "PROCESS PAYMENT"}</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-4 opacity-40">
              <div className="h-[1px] flex-1 bg-outline"></div>
              <span className="font-label text-[0.5rem] tracking-[0.3em] uppercase">Secure Transaction</span>
              <div className="h-[1px] flex-1 bg-outline"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
