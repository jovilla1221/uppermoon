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
  description?: string;
  sizes?: string[];
  image: string;
  gallery?: string[];
}

export default function ProductDetailClient({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const { addToCart, formatPrice } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>("M");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);

  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const gallery = product.gallery || [product.image];

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select a size");
    addToCart({
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.image,
      collection: product.collection || product.category
    });
  };

  return (
    <main className="max-w-[1440px] mx-auto min-h-screen px-6 py-12 md:py-24 animate-[fade-up-slide_0.5s_forwards]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
        {/* Left: Product Image Gallery */}
        <section className="md:col-span-7 flex flex-col gap-4">
          <div className="aspect-[4/5] bg-surface-container overflow-hidden">
            <img 
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300" 
              src={mainImage} 
            />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  onClick={() => setMainImage(imgUrl)}
                  className={`aspect-square bg-surface-container overflow-hidden cursor-pointer transition-all duration-300 ${mainImage === imgUrl ? 'opacity-100 ring-2 ring-primary' : 'opacity-50 hover:opacity-100'}`}
                >
                  <img alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" src={imgUrl}/>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right: Product Information */}
        <section className="md:col-span-5 flex flex-col justify-start pt-4">
          <nav className="flex items-center gap-2 mb-8">
            <Link href="/" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors">HOME</Link>
            <span className="text-secondary text-[0.6875rem]">/</span>
            <Link href="/products" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors">{product.category}</Link>
            <span className="text-secondary text-[0.6875rem]">/</span>
            <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">{product.name}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 tracking-tight leading-tight">
            {product.name}
          </h1>
          <p className="text-xl font-body font-normal mb-10 text-on-surface">{formatPrice(product.price)}</p>
          
          {/* Selectors */}
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-label text-[0.6875rem] uppercase tracking-widest">SIZE</span>
                <span onClick={() => alert("Size Guide Modal will open here.")} className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary underline cursor-pointer hover:text-primary transition-colors">SIZE GUIDE</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => (
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
              {product.description || "Crafted from premium materials with meticulous attention to detail. Designed for the modern wardrobe with a focus on quality and longevity."}
            </p>
            <ul className="space-y-3 font-body text-xs text-secondary tracking-wide list-disc pl-4">
              <li>PREMIUM MATERIALS</li>
              <li>ETHICALLY MANUFACTURED</li>
              <li>LIMITED EDITION</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-32">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-3xl font-headline italic">YOU MAY ALSO LIKE</h2>
            <div className="h-[1px] flex-grow mx-8 bg-surface-container"></div>
            <Link href="/products" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <Link key={related.slug} href={`/products/${related.slug}`} className="group cursor-pointer">
                <div className="aspect-square bg-surface-container overflow-hidden mb-4 relative">
                  <img alt={related.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={related.image}/>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label text-[0.6875rem] uppercase tracking-widest text-primary">{related.name}</span>
                  <span className="font-label text-[0.6875rem] text-secondary">{formatPrice(related.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
