import { defineField, defineType } from "sanity";

export const siteUserType = defineType({
  name: "siteUser",
  title: "Site User",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "passwordHash",
      title: "Password Hash",
      type: "string",
      description: "Hashed password for authentication",
    }),
    defineField({
      name: "isVerified",
      title: "Is Verified",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      initialValue: "user",
      options: {
        list: [
          { title: "User", value: "user" },
          { title: "Member", value: "member" },
        ],
      },
    }),
    defineField({
      name: "lastLoginAt",
      title: "Last Login At",
      type: "datetime",
    }),
  ],
});
