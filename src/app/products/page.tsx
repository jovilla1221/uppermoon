import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allProductsQuery } from "@/sanity/lib/queries";
import ProductsClient from "./ProductsClient";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the complete UPPERMOON collection. Premium minimalist streetwear — tops, outerwear, bottoms, and accessories. Free shipping across Indonesia.",
  openGraph: {
    title: `Shop All Products | ${SITE_NAME}`,
    description: "Browse the complete UPPERMOON collection. Premium minimalist streetwear.",
  },
};

export default async function ProductsPage() {
  let products = [];

  try {
    const sanityProducts = await client.fetch(allProductsQuery);
    if (sanityProducts && sanityProducts.length > 0) {
      products = sanityProducts;
    }
  } catch (e) {
    console.error("Failed to fetch products:", e);
  }

  return <ProductsClient products={products} />;
}
