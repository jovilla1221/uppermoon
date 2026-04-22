import { groq } from "next-sanity";

// Get site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    "logo": logo.asset->url,
    "hero1": heroSlide1.asset->url,
    "hero2": heroSlide2.asset->url,
    "hero3": heroSlide3.asset->url,
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
    variants,
    weight,
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
    variants,
    weight,
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

// Get orders by user
export const ordersByUserQuery = groq`
  *[_type == "order" && user._ref == $userId] | order(createdAt desc) {
    _id,
    orderId,
    customerName,
    items,
    totalAmount,
    paymentStatus,
    createdAt
  }
`;

// Get single order by orderId
export const orderByIdQuery = groq`
  *[_type == "order" && orderId == $orderId][0] {
    ...,
    user {
      _ref
    }
  }
`;

// Get all orders (admin)
export const allOrdersQuery = groq`
  *[_type == "order"] | order(createdAt desc) {
    _id,
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    totalAmount,
    paymentStatus,
    createdAt
  }
`;
