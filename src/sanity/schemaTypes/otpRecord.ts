import { defineField, defineType } from "sanity";

export const otpRecordType = defineType({
  name: "otpRecord",
  title: "OTP Record",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "otpHash",
      title: "OTP Hash",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "attempts",
      title: "Attempts",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "purpose",
      title: "Purpose",
      type: "string",
      initialValue: "registration",
      options: {
        list: [
          { title: "Registration", value: "registration" },
          { title: "Password Reset", value: "password-reset" },
        ],
      },
    }),
  ],
});
