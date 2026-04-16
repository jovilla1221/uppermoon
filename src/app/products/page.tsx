import { client } from "@/sanity/lib/client";
import { allProductsQuery } from "@/sanity/lib/queries";
import ProductsClient from "./ProductsClient";

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
