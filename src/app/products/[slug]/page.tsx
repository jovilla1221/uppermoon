import { client } from "@/sanity/lib/client";
import { productBySlugQuery, allProductsQuery } from "@/sanity/lib/queries";
import { allProducts as staticProducts } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product = null;
  let relatedProducts: any[] = [];

  try {
    product = await client.fetch(productBySlugQuery, { slug });
    
    if (!product) {
      // Fallback to static data
      product = staticProducts.find((p) => p.slug === slug) || null;
      relatedProducts = staticProducts.filter((p) => p.slug !== slug).slice(0, 4);
    } else {
      const allSanity = await client.fetch(allProductsQuery);
      relatedProducts = (allSanity || []).filter((p: any) => p.slug !== slug).slice(0, 4);
    }
  } catch {
    product = staticProducts.find((p) => p.slug === slug) || null;
    relatedProducts = staticProducts.filter((p) => p.slug !== slug).slice(0, 4);
  }

  if (!product) {
    return notFound();
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
