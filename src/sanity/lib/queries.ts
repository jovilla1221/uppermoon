import { groq } from "next-sanity";

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
