// fallow-ignore-file unused-file
import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const redirectType = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "source",
      type: "string",
    }),
    defineField({
      name: "destination",
      type: "string",
    }),
    defineField({
      name: "permanent",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isEnabled",
      description: "Toggle this redirect on or off",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
