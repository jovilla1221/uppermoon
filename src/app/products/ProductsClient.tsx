"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Product {
  name: string;
  slug: string;
  price: number;
  category: string;
  collection?: string;
  image: string;
  gallery?: string[];
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const { formatPrice, currency } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(20000000);
  const [sortBy, setSortBy] = useState("NEWEST");

  // Filter Logic
  let filteredProducts = products.filter(p => p.price <= priceRange);
  
  if (selectedCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }
  
  // Sort Logic
  if (sortBy === "PRICE LOW-HIGH") {
    filteredProducts.sort((a,b) => a.price - b.price);
  } else if (sortBy === "PRICE HIGH-LOW") {
    filteredProducts.sort((a,b) => b.price - a.price);
  }

  const activeCategoryClasses = "text-on-surface border-l-4 border-black pl-4 transition-all duration-150";
  const inactiveCategoryClasses = "text-secondary border-l-4 border-transparent pl-4 hover:border-surface-container-highest transition-all duration-150";

  return (
    <main className="flex min-h-screen bg-surface animate-[fade-up-slide_0.6s_forwards]">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col p-8 w-80 bg-surface border-r border-surface-container sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto">
        <div className="mb-12">
          <h2 className="text-xl font-black text-on-surface font-headline italic mb-1 uppercase">SHOP</h2>
          <p className="text-[10px] tracking-widest text-outline uppercase">CURRENCY: {currency}</p>
        </div>

        <nav className="flex flex-col space-y-6 flex-shrink-0">
          <button onClick={() => setSelectedCategory("ALL")} className={`flex items-center gap-3 font-label tracking-[0.1em] uppercase ${selectedCategory === "ALL" ? activeCategoryClasses : inactiveCategoryClasses}`}>
            <span className="material-symbols-outlined">{selectedCategory === "ALL" ? 'arrow_forward' : 'circle'}</span>
            VIEW ALL
          </button>
          <button onClick={() => setSelectedCategory("OUTERWEAR")} className={`flex items-center gap-3 font-label tracking-[0.1em] uppercase ${selectedCategory === "OUTERWEAR" ? activeCategoryClasses : inactiveCategoryClasses}`}>
            <span className="material-symbols-outlined">layers</span>
            OUTERWEAR
          </button>
          <button onClick={() => setSelectedCategory("TOPS")} className={`flex items-center gap-3 font-label tracking-[0.1em] uppercase ${selectedCategory === "TOPS" ? activeCategoryClasses : inactiveCategoryClasses}`}>
            <span className="material-symbols-outlined">checkroom</span>
            TOPS
          </button>
          <button onClick={() => setSelectedCategory("BOTTOMS")} className={`flex items-center gap-3 font-label tracking-[0.1em] uppercase ${selectedCategory === "BOTTOMS" ? activeCategoryClasses : inactiveCategoryClasses}`}>
            <span className="material-symbols-outlined">straighten</span>
            BOTTOMS
          </button>
          <button onClick={() => setSelectedCategory("ACCESSORIES")} className={`flex items-center gap-3 font-label tracking-[0.1em] uppercase ${selectedCategory === "ACCESSORIES" ? activeCategoryClasses : inactiveCategoryClasses}`}>
            <span className="material-symbols-outlined">watch</span>
            ACCESSORIES
          </button>
        </nav>

        <div className="mt-16 space-y-10">
          <section>
            <h3 className="text-[11px] font-bold tracking-[0.2em] mb-6 uppercase text-on-surface">FILTER BY SIZE</h3>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                  className={`w-10 h-10 border flex items-center justify-center text-[10px] font-bold transition-colors ${size === selectedSize ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant/30 hover:bg-primary hover:text-on-primary'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-on-surface">MAX PRICE</h3>
              <span className="text-[10px] font-bold tracking-tighter text-outline">{formatPrice(priceRange)}</span>
            </div>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="20000000" 
                step="500000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-black h-1 bg-surface-container cursor-pointer" 
              />
              <div className="flex justify-between text-[10px] font-medium tracking-tighter">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(20000000)}</span>
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* Product Grid Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header & Breadcrumbs */}
        <header className="px-8 pt-12 pb-8 border-b border-surface-container sticky top-[56px] bg-surface/90 backdrop-blur-md z-40">
          <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-outline mb-6">
            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-secondary cursor-default">SHOP</span>
            <span>/</span>
            <span className="text-primary font-bold">{selectedCategory}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-headline tracking-tighter leading-none italic capitalize">
              {selectedCategory === "ALL" ? "View All" : selectedCategory.toLowerCase()}<span className="not-italic opacity-20">.</span>
            </h1>
            <div className="flex items-center gap-4 text-[10px] tracking-widest font-bold">
              <span className="text-outline">SORT BY:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none p-0 focus:ring-0 uppercase tracking-widest text-[10px] font-bold cursor-pointer text-on-surface"
              >
                <option value="NEWEST">NEWEST</option>
                <option value="PRICE LOW-HIGH">PRICE LOW-HIGH</option>
                <option value="PRICE HIGH-LOW">PRICE HIGH-LOW</option>
              </select>
            </div>
          </div>
        </header>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-12">
              <span className="material-symbols-outlined text-4xl text-outline mb-4 flex items-center justify-center">inventory_2</span>
              <h3 className="font-headline text-2xl text-on-surface mb-2">No items found</h3>
              <p className="font-label text-xs tracking-widest uppercase text-outline">Try adjusting your filters</p>
              <button 
                onClick={() => {setSelectedCategory("ALL"); setPriceRange(20000000); setSelectedSize(null);}}
                className="mt-6 border-b border-primary text-[10px] font-bold tracking-widest uppercase hover:opacity-70"
              >
                CLEAR FILTERS
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 content-start">
            {filteredProducts.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group relative bg-surface border-r border-b border-surface-container overflow-hidden block">
                <div className="aspect-[4/5] bg-surface-container overflow-hidden relative">
                  <img 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0" 
                    src={product.image}
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 translate-y-16 group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-primary text-on-primary py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors shadow-xl">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-bold tracking-tight uppercase line-clamp-1 pr-4">{product.name}</h3>
                    <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors hover:fill-current">favorite</span>
                  </div>
                  <p className="text-[10px] tracking-[0.1em] text-outline uppercase mb-2">{product.category}</p>
                  <p className="text-sm font-medium text-on-surface">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="py-16 flex justify-center border-t border-surface-container mt-auto">
            <div className="flex items-center gap-8 md:gap-12">
              <button className="material-symbols-outlined text-outline hover:text-primary transition-colors opacity-50 cursor-not-allowed">arrow_back</button>
              <div className="flex items-center gap-4 md:gap-6">
                <span className="text-[10px] font-bold tracking-widest text-primary border-b-2 border-primary pb-1">01</span>
              </div>
              <button className="material-symbols-outlined text-outline hover:text-primary transition-colors opacity-50 cursor-not-allowed">arrow_forward</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
