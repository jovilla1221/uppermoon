"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import CartDrawer from "@/components/cart/CartDrawer";

export interface CartItem {
  id: string; // unique for product+size
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  collection: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  cartTotal: number;
  currency: "USD" | "IDR";
  setCurrency: (c: "USD" | "IDR") => void;
  formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "IDR">("USD");

  const formatPrice = (price: number) => {
    if (currency === "USD") {
      // Assuming 1 USD = 15,500 IDR
      return `$${(price / 15500).toFixed(2)}`;
    }
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: Omit<CartItem, "id">) => {
    setCartItems((prev) => {
      const existingId = `${item.name}-${item.size}`;
      const existingItem = prev.find((i) => i.id === existingId);
      
      if (existingItem) {
        return prev.map((i) => 
          i.id === existingId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [{ ...item, id: existingId }, ...prev];
    });
    openCart();
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
    );
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, cartTotal, currency, setCurrency, formatPrice }}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
