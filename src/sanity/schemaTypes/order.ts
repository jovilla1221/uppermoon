import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "siteUser" }],
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "customerPhone",
      title: "Customer Phone",
      type: "string",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "street", type: "string", title: "Street Address" },
        { name: "city", type: "string", title: "City" },
        { name: "province", type: "string", title: "Province" },
        { name: "postalCode", type: "string", title: "Postal Code" },
        { name: "cityId", type: "string", title: "City ID" },
        { name: "provinceId", type: "string", title: "Province ID" },
        { name: "districtId", type: "string", title: "District ID" },
      ],
    }),
    defineField({
      name: "courierName",
      title: "Courier Name",
      type: "string",
    }),
    defineField({
      name: "courierService",
      title: "Courier Service",
      type: "string",
    }),
    defineField({
      name: "waybill",
      title: "Waybill / Resi",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productName", type: "string", title: "Product Name" },
            { name: "productSlug", type: "string", title: "Product Slug" },
            { name: "size", type: "string", title: "Size" },
            { name: "quantity", type: "number", title: "Quantity" },
            { name: "price", type: "number", title: "Price" },
            { name: "image", type: "string", title: "Image URL" },
            { name: "collection", type: "string", title: "Collection" },
          ],
        },
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
    }),
    defineField({
      name: "shippingCost",
      title: "Shipping Cost",
      type: "number",
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Expired", value: "expired" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "midtransTransactionId",
      title: "Midtrans Transaction ID",
      type: "string",
    }),
    defineField({
      name: "midtransPaymentType",
      title: "Payment Type",
      type: "string",
    }),
    defineField({
      name: "snapToken",
      title: "Snap Token",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "orderId",
      subtitle: "customerName",
    },
  },
});
