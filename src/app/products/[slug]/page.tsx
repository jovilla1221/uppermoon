"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { allProducts } from "@/data/products";
import { notFound } from "next/navigation";

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { addToCart, formatPrice } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>("M");
  const [quantity, setQuantity] = useState(1);

  const product = allProducts.find((p) => p.slug === slug);

  const [mainImage, setMainImage] = useState(product?.image || "");

  // Update main image if product changes
  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  if (!product) {
    return notFound();
  }

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select a size");
    addToCart({
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.image,
      collection: product.collection
    });
  };

  return (
    <main className="max-w-[1440px] mx-auto min-h-screen px-6 py-12 md:py-24 animate-[fade-up-slide_0.5s_forwards]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
        {/* Left: Product Image Gallery */}
        <section className="md:col-span-7 flex flex-col gap-4">
          <div className="aspect-[4/5] bg-surface-container overflow-hidden">
            <img 
              alt="Oversized Boxy Hoodie Main" 
              className="w-full h-full object-cover transition-opacity duration-300" 
              src={mainImage} 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.gallery.map((imgUrl, idx) => (
              <div 
                key={idx}
                onClick={() => setMainImage(imgUrl)}
                className={`aspect-square bg-surface-container overflow-hidden cursor-pointer transition-all duration-300 ${mainImage === imgUrl ? 'opacity-100 ring-2 ring-primary' : 'opacity-50 hover:opacity-100'}`}
              >
                <img alt={`Hoodie view ${idx + 1}`} className="w-full h-full object-cover" src={imgUrl}/>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Product Information */}
        <section className="md:col-span-5 flex flex-col justify-start pt-4">
          <nav className="flex items-center gap-2 mb-8">
            <Link href="/" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors">HOME</Link>
            <span className="text-secondary text-[0.6875rem]">/</span>
            <Link href="#" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors">TOPS</Link>
            <span className="text-secondary text-[0.6875rem]">/</span>
            <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">{product.name}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 tracking-tight leading-tight">
            {product.name}
          </h1>
          <p className="text-xl font-body font-normal mb-10 text-on-surface">{formatPrice(product.price)}</p>
          
          {/* Selectors */}
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-label text-[0.6875rem] uppercase tracking-widest">SIZE</span>
                <span onClick={() => alert("Size Guide Modal will open here. Measurements available: Chest, Length, Shoulders.")} className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary underline cursor-pointer hover:text-primary transition-colors">SIZE GUIDE</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`aspect-square border flex items-center justify-center font-label text-sm transition-colors ${selectedSize === size ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant hover:border-primary'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <span className="font-label text-[0.6875rem] uppercase tracking-widest block mb-4">QUANTITY</span>
              <div className="flex items-center border border-outline-variant w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
                <span className="px-6 py-3 font-label text-sm w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors"
            >
              ADD TO CART
            </button>
          </div>
          
          {/* Description */}
          <div className="mt-16 pt-10 border-t border-surface-container">
            <p className="font-body text-sm leading-[1.6] text-on-surface-variant max-w-lg mb-6">
              Crafted from premium 500GSM heavyweight French Terry cotton, the Oversized Boxy Hoodie features a structural drape that maintains its silhouette. Designed with dropped shoulders, an architectural hood without drawstrings, and a kangaroo pocket. 
            </p>
            <ul className="space-y-3 font-body text-xs text-secondary tracking-wide list-disc pl-4">
              <li>100% ORGANIC COTTON</li>
              <li>MADE IN PORTUGAL</li>
              <li>PRE-SHRUNK AND GARMENT DYED</li>
              <li>BOX OVERSIZED FIT</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Related Products Section */}
      <section className="mt-32">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-3xl font-headline italic">YOU MAY ALSO LIKE</h2>
          <div className="h-[1px] flex-grow mx-8 bg-surface-container"></div>
          <Link href="#" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors">VIEW ALL</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/products/archetype-shell-jacket" className="group cursor-pointer">
            <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
              <img alt="Raw Denim" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIC20oD3rcRZ-AEogjwmpX6eO9l97ocAeZv4RLOdzqT0Xy23tadyjgXPUkkE47ZZW1cUqGeo5Vu2cZagfl9UAxKoLQ9iNkHVasWepOp9zwkr34oAAUdcSmIkdNsB_cWlHbBfe6n6XiNyA23XYjX9ytOLMtP8g66xQw2W-2Xa_1KliRIaT9DINOH3wrGudITp-LjgIeZUrQ8lAu5TYsNU2cqugh-w9BpD_ofjPaMtOpvjJWT_qCTREhHd0g9mF0aIiIjSj4Sfxx8JsC"/>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">RAW SELVEDGE DENIM</span>
              <span className="font-label text-[0.6875rem] text-secondary">{formatPrice(180)}</span>
            </div>
          </Link>
          
          <Link href="/products/essential-box-tee" className="group cursor-pointer">
            <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
              <img alt="White Tee" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8S2FT66s_J4xM4m8aSXXaXCqtTluP83i_AGUcLGCrSNwvlzCD33wSgQ_gIZRVextiDuUr7y1nR653Bh6c_EMUcq19-qhR75LMbV2dWrAeGdsuJaXnNmZJkheiiJaFpHj_Y504GmHYHrakarrYNk57rCTr6exF8bwv19wfTt27BEVc6VYV5xKSrcI5W9IMw6gYnSu2IUqEulbz81urN8NuS8LmGPN0-s8i_B6GWgaTKwQ3uAGU1YtaF2ymQb3JQL_XE0yL52VtT57x"/>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">HEAVYWEIGHT TEE</span>
              <span className="font-label text-[0.6875rem] text-secondary">{formatPrice(65)}</span>
            </div>
          </Link>
          
          <Link href="/products/obsidian-overcoat" className="group cursor-pointer">
            <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
              <img alt="Wool Coat" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVq5eC6E965eUIiLE5ftPwIcWKH_rFoPuvIjX_wyYR61gLMhjCJF5ICEp1e6sP3UU2lnR5k249RD51AftIUjimQamkdST_DoPih05-69G83M3O3oQJYJzpYvkYuxD4caBJxVVbheai8ob5CK1uLCoZq2M7ci7QxKJQmiEdfJpPIwoGJ9VPDzNrn9gSC_abGemd2EhaUr37yv1TcYWX-gOmf6RDH7nlEq9hdjPzxI3VsCiKp2VwMWLuh38whgUz2J2ymu7JbuB24wLE"/>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">STRUCTURED WOOL COAT</span>
              <span className="font-label text-[0.6875rem] text-secondary">{formatPrice(350)}</span>
            </div>
          </Link>
          
          <Link href="/products/utility-cargo-system" className="group cursor-pointer">
            <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
              <img alt="Cargo Pants" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7KvM5GaAwHtg39OoBbHYohuzSKuvvKSrD3cZQtOsyWWL79Y0NSdrFt7LdUVlduVHLf3e8MFWhs_3JUrsdZKGnL3Sgl2R5qMbxbpWfYVov9cGh0rgazQT3ex0dq0EfEADpvX6-WfmJjP7s9DUwNS0qX29noMcJcv6XOCBzQC4TW8W5uKSpzvY66yu7CnEAvMjNSdh0cE1q3VEpuLaSFHpcMfGzxtUnlhPNwP9PphPnbN5GBRkWhTrZoSe9DDs3xtEEOsnBtJ0MToR9"/>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">TECHNICAL CARGO PANT</span>
              <span className="font-label text-[0.6875rem] text-secondary">{formatPrice(145)}</span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
