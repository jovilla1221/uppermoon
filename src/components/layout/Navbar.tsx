"use client";

import { useState } from "react";
import Header from "./Header";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart } = useCart();

  return (
    <>
      <Header 
        onOpenCart={openCart} 
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
