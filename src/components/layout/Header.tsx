"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from "@/context/CartContext";

export default function Header({ onOpenCart, onOpenSearch }: { onOpenCart: () => void, onOpenSearch: () => void }) {
  const { currency, setCurrency } = useCart();
  return (
    <header className="sticky top-0 flex justify-between items-center px-6 py-4 w-full bg-white z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/">
          <img 
            alt="UPPERMOON" 
            className="w-auto object-contain h-16 cursor-pointer" 
            src="https://lh3.googleusercontent.com/aida/ADBb0uhF5kIfV9gzcMRvQPhk50wiBWkXNPRlAYIrnW4rZlbQ-bLba2OC-Qr-6_AzWpzoJ2qfMJJ_CfmwUKxWcNbE0DQO9CCeWf1MNRwMiFrVHqnlIkWeTTUmv5rCdNJyMG5S4APK3zONIe-wRVZ-UDWDlun8yPIYRxrNoHufUq1FZcRcJAqWGu3o7vdtqZUeM6gHnP4LaTig3mK55IkDzP33OpQ8wVjw36DXmohEb4A0Mb9i_lv60g2pUhe8rB7cbmoWhcRRSOCh0vQwpg" 
          />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8 items-center mr-4">
          <Link href="/products" className="text-[#000000] font-bold text-[0.6875rem] tracking-widest uppercase hover:opacity-70 transition-opacity duration-150">SHOP</Link>
          <Link href="#" className="text-[#747878] text-[0.6875rem] tracking-widest uppercase hover:opacity-70 transition-opacity duration-150">ARCHIVE</Link>
          <Link href="#" className="text-[#747878] text-[0.6875rem] tracking-widest uppercase hover:opacity-70 transition-opacity duration-150">EDITORIAL</Link>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setCurrency(currency === "USD" ? "IDR" : "USD")}
            className="text-[10px] font-bold tracking-widest uppercase text-outline hover:text-primary transition-colors border px-2 py-1"
          >
            {currency}
          </button>
          <button onClick={onOpenSearch} className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150" style={{fontSize: '32px'}}>search</button>
          <Link href="/login" className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150 flex items-center justify-center" style={{fontSize: '32px'}}>person</Link>
          <button onClick={onOpenCart} className="material-symbols-outlined text-[#000000] hover:opacity-70 transition-opacity duration-150" style={{fontSize: '32px'}}>shopping_bag</button>
        </div>
      </div>
    </header>
  );
}
