import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (IDR)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Outerwear", value: "OUTERWEAR" },
          { title: "Tops", value: "TOPS" },
          { title: "Bottoms", value: "BOTTOMS" },
          { title: "Footwear", value: "FOOTWEAR" },
          { title: "Accessories", value: "ACCESSORIES" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "XS", value: "XS" },
          { title: "S", value: "S" },
          { title: "M", value: "M" },
          { title: "L", value: "L" },
          { title: "XL", value: "XL" },
        ],
      },
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "variants",
      title: "Inventory per Size",
      type: "array",
      of: [
        {
          type: "object",
          name: "variant",
          fields: [
            { name: "size", type: "string", title: "Size" },
            { name: "stock", type: "number", title: "Stock", initialValue: 0 }
          ],
          preview: {
            select: {
              title: "size",
              stock: "stock"
            },
            prepare(selection) {
              const { title, stock } = selection;
              return {
                title: `Size: ${title}`,
                subtitle: `Stock: ${stock}`
              }
            }
          }
        }
      ],
      description: "Manage inventory for each size variant"
    }),
    defineField({
      name: "weight",
      title: "Weight (Grams)",
      type: "number",
      description: "Weight of the product in grams (for shipping calculation)",
      initialValue: 500,
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0",
    },
  },
});
