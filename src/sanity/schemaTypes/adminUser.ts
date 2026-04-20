import { defineField, defineType } from "sanity";

export const adminUserType = defineType({
  name: "adminUser",
  title: "Admin User",
  type: "document",
  fields: [
    defineField({
      name: "username",
      title: "Username",
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
      initialValue: "admin",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "Super Admin", value: "superadmin" },
        ],
      },
    }),
  ],
});
