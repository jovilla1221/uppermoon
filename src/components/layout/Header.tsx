"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from "@/context/CartContext";

export default function Header({ onOpenCart, onOpenSearch }: { onOpenCart: () => void, onOpenSearch: () => void }) {
  const { currency, setCurrency } = useCart();
  return (
    <header className="sticky top-0 flex justify-between items-center px-4 md:px-8 py-2 md:py-3 w-full bg-white z-50 shadow-sm border-b border-surface-container">
      <div className="flex items-center gap-4">
        <Link href="/">
          <img 
            alt="UPPERMOON" 
            className="w-auto object-contain h-8 md:h-10 cursor-pointer" 
            src="https://lh3.googleusercontent.com/aida/ADBb0uhF5kIfV9gzcMRvQPhk50wiBWkXNPRlAYIrnW4rZlbQ-bLba2OC-Qr-6_AzWpzoJ2qfMJJ_CfmwUKxWcNbE0DQO9CCeWf1MNRwMiFrVHqnlIkWeTTUmv5rCdNJyMG5S4APK3zONIe-wRVZ-UDWDlun8yPIYRxrNoHufUq1FZcRcJAqWGu3o7vdtqZUeM6gHnP4LaTig3mK55IkDzP33OpQ8wVjw36DXmohEb4A0Mb9i_lv60g2pUhe8rB7cbmoWhcRRSOCh0vQwpg" 
          />
        </Link>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex gap-6 lg:gap-8 items-center mr-2 lg:mr-4">
          <Link href="/products" className="text-[#000000] font-bold text-[0.625rem] lg:text-[0.6875rem] tracking-widest uppercase hover:opacity-70 transition-opacity duration-150">SHOP</Link>
          <Link href="#" className="text-[#747878] text-[0.625rem] lg:text-[0.6875rem] tracking-widest uppercase hover:opacity-70 transition-opacity duration-150">ARCHIVE</Link>
          <Link href="#" className="text-[#747878] text-[0.625rem] lg:text-[0.6875rem] tracking-widest uppercase hover:opacity-70 transition-opacity duration-150">EDITORIAL</Link>
        </div>
        <div className="flex items-center space-x-4 md:space-x-5">
          <button 
            onClick={() => setCurrency(currency === "USD" ? "IDR" : "USD")}
            className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-outline hover:text-primary transition-colors border px-2 py-1 mx-2"
          >
            {currency}
          </button>
          <button onClick={onOpenSearch} className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150 text-2xl md:text-[26px]">search</button>
          <Link href="/login" className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150 flex items-center justify-center text-2xl md:text-[26px]">person</Link>
          <button onClick={onOpenCart} className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150 text-2xl md:text-[26px]">shopping_bag</button>
        </div>
      </div>
    </header>
  );
}
