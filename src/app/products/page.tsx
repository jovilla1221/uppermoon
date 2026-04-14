import { client } from "@/sanity/lib/client";
import { allProductsQuery } from "@/sanity/lib/queries";
import { allProducts as staticProducts } from "@/data/products";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  let products = [];

  try {
    const sanityProducts = await client.fetch(allProductsQuery);
    if (sanityProducts && sanityProducts.length > 0) {
      products = sanityProducts;
    } else {
      // Fallback to static data if Sanity is empty
      products = staticProducts;
    }
  } catch {
    // Fallback to static data if Sanity fetch fails
    products = staticProducts;
  }

  return <ProductsClient products={products} />;
}
