import { defineField } from "sanity";
import { defineType } from "sanity";

import { customRichText } from "../definitions/rich-text";

const featureCardIcon = defineField({
  name: "featureCardIcon",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    customRichText(["block"]),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => {
      return {
        title: `${title ?? "Untitled"}`,
      };
    },
  },
});

export const featureCardsIcon = defineType({
  name: "featureCardsIcon",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    customRichText(["block"]),
    defineField({
      name: "cards",
      type: "array",
      of: [featureCardIcon],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Feature Cards with Icon",
    }),
  },
});
