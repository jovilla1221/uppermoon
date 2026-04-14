"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Reveal from "@/components/ui/Reveal";

interface Product {
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
}

export default function BestSellersClient({ products }: { products: Product[] }) {
  const { formatPrice } = useCart();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 bg-outline/10">
      {products.map((product, index) => (
        <Reveal key={product.slug} delay={0.1 * (index + 1)} className="bg-surface-container-lowest group cursor-pointer p-6 h-full flex flex-col">
          <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
            <div className="aspect-[4/5] overflow-hidden mb-6 bg-surface-container">
              <img 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src={product.image}
              />
            </div>
            <div className="space-y-2 mt-auto">
              <p className="text-[0.6875rem] tracking-widest uppercase text-outline">{product.category}</p>
              <h3 className="font-bold text-sm tracking-tight uppercase line-clamp-1">{product.name}</h3>
              <p className="text-xs font-medium text-on-surface-variant">{formatPrice(product.price)}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
