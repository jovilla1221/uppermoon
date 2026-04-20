"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal, formatPrice, currency } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleCheckout = () => {
    if (!user) {
      closeCart();
      // Redirect to login with callbackUrl back to current page
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    
    // Proceed to checkout (existing logic or next step)
    console.log("Proceeding to checkout for user:", user.userId);
    // window.location.href = "/checkout"; // Example
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-[#000000]/30 backdrop-blur-sm z-[70] transition-opacity duration-300"
        onClick={closeCart}
      />
      
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface z-[80] flex flex-col shadow-light transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between px-8 pt-10 pb-6">
          <div className="flex flex-col">
            <h2 className="font-headline italic text-2xl text-on-surface">YOUR BAG</h2>
            <span className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-outline mt-1">
              ESTIMATED TOTAL: {currency} {formatPrice(cartTotal)}
            </span>
          </div>
          <button 
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors duration-150 rounded-full"
          >
            <span className="material-symbols-outlined text-on-surface">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 hide-scrollbar">
          <div className="h-[1px] w-full bg-surface-container mb-10"></div>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <span className="font-headline text-xl text-on-surface-variant">Your bag is empty</span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 mb-12">
                <div className="w-24 h-32 bg-surface-container shrink-0">
                  <img alt={item.name} className="w-full h-full object-cover" src={item.image}/>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline text-lg text-on-surface leading-tight">{item.name} ({item.size})</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-outline hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                    <p className="font-label text-[0.6875rem] uppercase tracking-widest text-outline mt-1">{item.collection}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border-[1px] border-outline-variant/30">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">remove</span>
                      </button>
                      <span className="font-label text-[0.75rem] w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">add</span>
                      </button>
                    </div>
                    <span className="font-label text-sm text-on-surface">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="mt-16 bg-surface-container p-6">
            <p className="font-label text-[0.6875rem] tracking-[0.1em] text-outline leading-relaxed">
              UPPERMOON PIECES ARE CRAFTED IN LIMITED QUANTITIES. ITEMS IN YOUR BAG ARE NOT RESERVED UNTIL CHECKOUT IS COMPLETE.
            </p>
          </div>
        </div>

        <div className="bg-surface-container p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-label text-[0.6875rem] tracking-widest uppercase text-outline">SUBTOTAL</span>
              <span className="font-body font-bold text-on-surface">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label text-[0.6875rem] tracking-widest uppercase text-outline">SHIPPING</span>
              <span className="font-label text-[0.6875rem] tracking-widest uppercase text-on-surface">CALCULATED AT NEXT STEP</span>
            </div>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="w-full bg-primary text-on-primary font-label text-[0.75rem] tracking-[0.2em] font-bold py-5 hover:bg-primary-container disabled:opacity-50 disabled:hover:bg-primary transition-all duration-150 uppercase"
          >
            CHECKOUT
          </button>
          <div className="flex justify-center pt-2">
            <p className="font-label text-[0.625rem] text-outline tracking-widest uppercase">SECURE PAYMENT • WORLDWIDE SHIPPING</p>
          </div>
        </div>
      </aside>
    </>
  );
}
