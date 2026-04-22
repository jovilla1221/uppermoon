import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allProductsQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await client.fetch(allProductsQuery);

  const productEntries: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tracking`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...productEntries,
  ];
}
