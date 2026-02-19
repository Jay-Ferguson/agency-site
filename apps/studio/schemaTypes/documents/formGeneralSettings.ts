// schemaTypes/formGeneralSettings.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "formGeneralSettings",
  title: "Form General Settings",
  type: "document",
  // This makes it feel like a singleton by hiding the "Duplicate" and "Delete" options
  liveEdit: false,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      description: "The email address where form submissions should be sent.",
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "text",
      rows: 3,
      initialValue: "Thank you for your message. We will get back to you soon!",
    }),
  ],
});
