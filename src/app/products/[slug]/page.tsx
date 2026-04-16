import { client } from "@/sanity/lib/client";
import { productBySlugQuery, allProductsQuery } from "@/sanity/lib/queries";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product = null;
  let relatedProducts: any[] = [];

  try {
    product = await client.fetch(productBySlugQuery, { slug });
    
    if (product) {
      const allSanity = await client.fetch(allProductsQuery);
      relatedProducts = (allSanity || []).filter((p: any) => p.slug !== slug).slice(0, 4);
    }
  } catch (e) {
    console.error("Failed to fetch product:", e);
  }

  if (!product) {
    return notFound();
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
