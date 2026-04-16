import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Navigation Logo",
      type: "image",
      description: "Upload the logo for the navigation bar",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroSlide1",
      title: "Hero Slide 1",
      type: "image",
      description: "First slide image in the hero section",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroSlide2",
      title: "Hero Slide 2",
      type: "image",
      description: "Second slide image in the hero section",
      options: { hotspot: true },
    }),
    defineField({
      name: "community1",
      title: "Community Image 1",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "community2",
      title: "Community Image 2",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "community3",
      title: "Community Image 3",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroSlide3",
      title: "Hero Slide 3",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare() {
      return { title: "Global Site Settings" };
    },
  },
});
