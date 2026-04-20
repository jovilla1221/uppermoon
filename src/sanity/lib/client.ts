import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "bf20iv8w",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
