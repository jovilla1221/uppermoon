"use client";

import { useState } from "react";
import Header from "./Header";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "@/context/CartContext";

export default function Navbar({ logoUrl, products = [] }: { logoUrl?: string, products?: any[] }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart } = useCart();

  return (
    <>
      <Header 
        logoUrl={logoUrl}
        onOpenCart={openCart} 
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={products} />
    </>
  );
}
