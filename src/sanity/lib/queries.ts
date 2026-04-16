import { groq } from "next-sanity";

// Get site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    "logo": logo.asset->url,
    "hero1": heroSlide1.asset->url,
    "hero2": heroSlide2.asset->url,
    "community1": community1.asset->url,
    "community2": community2.asset->url,
    "community3": community3.asset->url
  }
`;

// Get all products
export const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    category,
    collection,
    description,
    sizes,
    featured,
    "image": images[0].asset->url,
    "gallery": images[].asset->url,
    "rawImages": images[]{
      _key,
      _type,
      "assetRef": asset->_id,
      "url": asset->url
    }
  }
`;

// Get single product by slug
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    price,
    category,
    collection,
    description,
    sizes,
    featured,
    "image": images[0].asset->url,
    "gallery": images[].asset->url,
    "rawImages": images[]{
      _key,
      _type,
      "assetRef": asset->_id,
      "url": asset->url
    }
  }
`;

// Get products by category
export const productsByCategoryQuery = groq`
  *[_type == "product" && category == $category] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    category,
    collection,
    "image": images[0].asset->url,
    "gallery": images[].asset->url,
    "rawImages": images[]{
      _key,
      _type,
      "assetRef": asset->_id,
      "url": asset->url
    }
  }
`;
