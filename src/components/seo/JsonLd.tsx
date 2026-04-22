import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

// Organization schema for homepage
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    sameAs: [
      "https://www.instagram.com/uppermoon.supply/",
      "https://www.tokopedia.com/uppermoonsupply",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@uppermoon.co",
      contactType: "customer service",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product schema for product detail pages
export function ProductJsonLd({ product }: { product: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} by ${SITE_NAME}`,
    image: product.gallery || [product.image],
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "IDR",
      price: product.price,
      availability: product.variants?.some((v: any) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    category: product.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
