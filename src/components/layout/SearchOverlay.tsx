"use client";

import { useState } from "react";
import Link from "next/link";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockProducts = [
  { name: "ARCHITECTURAL HOODIE / CHARCOAL", price: "$185.00", url: "/products/oversized-boxy-hoodie" },
  { name: "ESSENTIAL BOX TEE / OPTIC WHITE", price: "$85.00", url: "/products/oversized-boxy-hoodie" },
  { name: "STRUCTURAL CARGO PANTS / NOIR", price: "$240.00", url: "/products/oversized-boxy-hoodie" },
  { name: "SCULPTED SWEATSHIRT / SAND", price: "$160.00", url: "/products/oversized-boxy-hoodie" },
  { name: "RAW SELVEDGE DENIM", price: "$180.00", url: "/products/oversized-boxy-hoodie" },
  { name: "HEAVYWEIGHT TEE", price: "$65.00", url: "/products/oversized-boxy-hoodie" },
  { name: "STRUCTURED WOOL COAT", price: "$350.00", url: "/products/oversized-boxy-hoodie" },
  { name: "TECHNICAL CARGO PANT", price: "$145.00", url: "/products/oversized-boxy-hoodie" },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filteredProducts = query === "" 
    ? [] 
    : mockProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-surface z-[100] flex flex-col p-8 md:p-16 animate-[fade-up-slide_0.3s_forwards]">
      <div className="flex justify-end">
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center hover:bg-surface-container transition-colors duration-150 rounded-full"
        >
          <span className="material-symbols-outlined text-4xl text-on-surface">close</span>
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-8 md:mt-24">
        <div className="flex items-center border-b-2 border-on-surface pb-4">
          <span className="material-symbols-outlined text-4xl text-on-surface mr-4">search</span>
          <input 
            type="text" 
            autoFocus
            placeholder="Search products..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-3xl md:text-5xl font-headline italic outline-none placeholder:text-outline"
          />
        </div>

        {/* Results */}
        <div className="mt-12">
          {query.length > 0 && (
            <p className="font-label text-xs tracking-widest uppercase text-outline mb-6">
              {filteredProducts.length} RESULTS FOR "{query}"
            </p>
          )}

          <div className="flex flex-col gap-4">
            {filteredProducts.map((product, idx) => (
              <Link 
                key={idx} 
                href={product.url}
                onClick={onClose}
                className="flex items-center justify-between py-4 border-b border-surface-container hover:px-4 hover:bg-surface-container-low transition-all duration-300 group"
              >
                <span className="font-headline text-xl group-hover:italic">{product.name}</span>
                <span className="font-label text-sm text-secondary">{product.price}</span>
              </Link>
            ))}
          </div>

          {query.length > 0 && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <span className="font-headline text-2xl text-on-surface-variant">No products found.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
