"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "uppermoon-studio",
  title: "UPPERMOON Admin",
  projectId: "bf20iv8w",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Ini memastikan aksi "Delete" tetap diproses oleh Sanity Studio
    actions: (prev) => prev,
  },
  basePath: "/studio",
});
