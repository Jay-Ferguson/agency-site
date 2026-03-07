import { text } from "node:stream/consumers";

import { richTextField } from "../common";

export default {
  name: "comments",
  type: "document",
  title: "Comments",
  description: "Manage comments on your content",
  fields: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "commentBody",
      type: "text",
    },
    {
      name: "canBePublished",
      type: "reference",
      to: [{ type: "blog" }, { type: "page" }],
    },
  ],
};
