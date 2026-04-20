"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header({ onOpenCart, onOpenSearch, logoUrl }: { onOpenCart: () => void, onOpenSearch: () => void, logoUrl?: string }) {
  const { currency, setCurrency } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 flex justify-between items-center px-4 md:px-8 py-2 md:py-3 w-full bg-white z-50 shadow-sm border-b border-surface-container">
      <div className="flex items-center gap-4">
        {logoUrl ? (
          <Link href="/">
            <img src={logoUrl} alt="UPPERMOON Logo" className="h-8 md:h-10 w-auto object-contain cursor-pointer" />
          </Link>
        ) : (
          <Link 
            href="/" 
            className="font-black text-xl md:text-2xl tracking-[0.2em] text-[#000000] hover:opacity-70 transition-opacity"
          >
            UPPERMOON
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex gap-6 lg:gap-8 items-center mr-2 lg:mr-4">
          <Link href="/products" className="text-[#000000] font-bold text-[0.625rem] lg:text-[0.6875rem] tracking-widest uppercase hover:opacity-70 transition-opacity duration-150">SHOP</Link>
        </div>
        <div className="flex items-center space-x-4 md:space-x-5">
          <button 
            onClick={() => setCurrency(currency === "USD" ? "IDR" : "USD")}
            className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-outline hover:text-primary transition-colors border px-2 py-1 mx-2"
          >
            {currency}
          </button>
          <button onClick={onOpenSearch} className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150 text-2xl md:text-[26px]">search</button>
          
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <span className="font-label text-[0.625rem] uppercase tracking-widest text-[#000000]">
                  Hai, {user.username}
                </span>
                <button 
                  onClick={logout}
                  className="material-symbols-outlined text-[#000000] hover:text-primary transition-colors duration-150 text-xl md:text-[26px]"
                  title="Logout"
                >
                  logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150 flex items-center justify-center text-2xl md:text-[26px]">person</Link>
            )}
          </div>

          <button onClick={onOpenCart} className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150 text-2xl md:text-[26px]">shopping_bag</button>
        </div>
      </div>
    </header>
  );
}
