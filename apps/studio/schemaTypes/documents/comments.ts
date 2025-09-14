import { richTextField } from "../common";
import { text } from "node:stream/consumers";

export default {
  name: "comments",
  type: "document",
  title: "Comments",
  description: "Manage comments on your content",
  fields: [{
      name: "name",
      type: "string", 
  }, {
     name:'commentBody',
      type:"text"

  },
{
name:'canBePublished',
type:'reference',
to: [{ type: "blog" }, { type: "page" }],
}
]
}