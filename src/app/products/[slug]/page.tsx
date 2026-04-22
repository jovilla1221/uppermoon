import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { productBySlugQuery, allProductsQuery } from "@/sanity/lib/queries";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { ProductJsonLd } from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch(productBySlugQuery, { slug });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const title = product.name;
  const description = product.description
    || `${product.name} — ${product.category} by ${SITE_NAME}. Premium minimalist streetwear. Rp ${product.price?.toLocaleString("id-ID")}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/products/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/products/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
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

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
