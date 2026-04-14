"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>("M");
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: "OVERSIZED BOXY HOODIE",
    price: 120.00,
    collection: "BLACK MONOLITH SERIES",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHozJb72McCjTGaj21WdaDQQcMP7PgAeLwWR6uGeKNQtFahGplbh8VpGlPJALOwvEClYSY7WxPS-7c3XdXm66VsQ4yxNjEY4zF7HhYzAoa0xI7zxurJEXcrRQymTvkP-S43u_oDNLw6fonQ9YHh7lBfzEGb8JoPi6J3i5LuzY1ihEme8vpH0Iyaa91WSN1VGElL-r1pfMeDhv-tLPQ3VotXjoGWjT9I6-WIKOCBT8RtR1bdquQUVjy9E4JvjlmNMeNYdHdiU2zj-Kx"
  };

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
              className="w-full h-full object-cover" 
              src={product.image} 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square bg-surface-container overflow-hidden opacity-100 ring-1 ring-primary">
              <img alt="Hoodie view 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrWbC4-NQ5NnMYBl3NgHFdaa0LdIf0RqqH6-dgFFRyG6rdcuHc8PE4bQL2xUSxZ_XaMYTnCSURrHoFC2HjfudG9v5h6Go_LVbxKgIPUD8wjdhg_UXJffTGsW8JtO8FEIo8KZhQsFghLstlgqZr-XV2gRB9VXU02DFMrGlhAUZecMY6HfKXkHs743aD8gSRqxF6T67MObXFuTcXsykDyoY5R4UPfMdJyEeAMFoJub1TgB9u5_nIyW_GUGrSQR5_hdFObp3CW826mfYJ"/>
            </div>
            <div className="aspect-square bg-surface-container overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
              <img alt="Hoodie view 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVslq8tsgj8uts3gs_Tz1Pjo5c0aTtl6DboAUDAy2oT-pwYpe2H5MR1sKC5LyzG7R70r56zsmn1hi5sLMSfO8UJ7z6kGSrTTJiiWp38wmCvGRfcnKxjozoMSWuIuY-s-x_pvx7KfpHzb7u3l5a0IsUWWhYrzfnNnMR7_-Q0aM3VGIU8rAHwZFpHHveEPZYbRqGiCSh0cS8tXgx1UF5xTSuZYECLkGSBOW2OAG--DdvFAnQWEP_w-OeiZuk6KxvGXpG3xoG15xm9DfN"/>
            </div>
            <div className="aspect-square bg-surface-container overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
              <img alt="Hoodie view 3" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQXRybg3DD09pgIkPCfdFmbxAFOe9P-i-HX0wyEYbPywatrRLdA26s4Xy2GpBmCTp2edzpcndADnZnVmIUGOoezeKjetZYalCyboGQ4XhtW7x8FAWePcwGEze7DSTMM9FxL2ZIG_77HtCMscNtfButSohBxpzIkPDst_D0UKfk4GKNrnbz1zq65XBAAMwC0J85gdEblrsVjzs1O02pG1Y6KR3C2ugb4cIt42wUVG6L477l6Tdmc1M4p_Zk2agnC9l9rx3isg0E5yPL"/>
            </div>
            <div className="aspect-square bg-surface-container overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
              <img alt="Hoodie view 4" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6wicC7-3f-AM0IZxFlzJ2dUR8Op-W3SZ5rHI9ByO-qk0vdJ-9l3rcQ-bxM39Zui0XZbQX7GrYKTbqhYBuoUupgKMh2RkmqWyw7s_TPB_sdBEOjZT6GH2Ud2AiVrWoCjAvY5s6l5mhgFjREm1MU0PsEE7Tp0peBK8aNBI5ajFQx1ZjCejdAcbxsBxNWrSV-aVCzk4L5nVA6lP5ayH_z8RyOBpmJLVjkTzivqg-kynxbEczhZIVCz2NCilt5bj5Ss60xNxkciC6vlAL"/>
            </div>
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
          <p className="text-xl font-body font-normal mb-10 text-on-surface">${product.price.toFixed(2)}</p>
          
          {/* Selectors */}
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-label text-[0.6875rem] uppercase tracking-widest">SIZE</span>
                <span className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary underline cursor-pointer hover:text-primary transition-colors">SIZE GUIDE</span>
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
          <div className="group cursor-pointer">
            <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
              <img alt="Raw Denim" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIC20oD3rcRZ-AEogjwmpX6eO9l97ocAeZv4RLOdzqT0Xy23tadyjgXPUkkE47ZZW1cUqGeo5Vu2cZagfl9UAxKoLQ9iNkHVasWepOp9zwkr34oAAUdcSmIkdNsB_cWlHbBfe6n6XiNyA23XYjX9ytOLMtP8g66xQw2W-2Xa_1KliRIaT9DINOH3wrGudITp-LjgIeZUrQ8lAu5TYsNU2cqugh-w9BpD_ofjPaMtOpvjJWT_qCTREhHd0g9mF0aIiIjSj4Sfxx8JsC"/>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">RAW SELVEDGE DENIM</span>
              <span className="font-label text-[0.6875rem] text-secondary">$180.00</span>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
              <img alt="White Tee" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8S2FT66s_J4xM4m8aSXXaXCqtTluP83i_AGUcLGCrSNwvlzCD33wSgQ_gIZRVextiDuUr7y1nR653Bh6c_EMUcq19-qhR75LMbV2dWrAeGdsuJaXnNmZJkheiiJaFpHj_Y504GmHYHrakarrYNk57rCTr6exF8bwv19wfTt27BEVc6VYV5xKSrcI5W9IMw6gYnSu2IUqEulbz81urN8NuS8LmGPN0-s8i_B6GWgaTKwQ3uAGU1YtaF2ymQb3JQL_XE0yL52VtT57x"/>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">HEAVYWEIGHT TEE</span>
              <span className="font-label text-[0.6875rem] text-secondary">$65.00</span>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
              <img alt="Wool Coat" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVq5eC6E965eUIiLE5ftPwIcWKH_rFoPuvIjX_wyYR61gLMhjCJF5ICEp1e6sP3UU2lnR5k249RD51AftIUjimQamkdST_DoPih05-69G83M3O3oQJYJzpYvkYuxD4caBJxVVbheai8ob5CK1uLCoZq2M7ci7QxKJQmiEdfJpPIwoGJ9VPDzNrn9gSC_abGemd2EhaUr37yv1TcYWX-gOmf6RDH7nlEq9hdjPzxI3VsCiKp2VwMWLuh38whgUz2J2ymu7JbuB24wLE"/>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">STRUCTURED WOOL COAT</span>
              <span className="font-label text-[0.6875rem] text-secondary">$350.00</span>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
              <img alt="Cargo Pants" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7KvM5GaAwHtg39OoBbHYohuzSKuvvKSrD3cZQtOsyWWL79Y0NSdrFt7LdUVlduVHLf3e8MFWhs_3JUrsdZKGnL3Sgl2R5qMbxbpWfYVov9cGh0rgazQT3ex0dq0EfEADpvX6-WfmJjP7s9DUwNS0qX29noMcJcv6XOCBzQC4TW8W5uKSpzvY66yu7CnEAvMjNSdh0cE1q3VEpuLaSFHpcMfGzxtUnlhPNwP9PphPnbN5GBRkWhTrZoSe9DDs3xtEEOsnBtJ0MToR9"/>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">TECHNICAL CARGO PANT</span>
              <span className="font-label text-[0.6875rem] text-secondary">$145.00</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
