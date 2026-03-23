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

    {
      name: "post",
      type: "reference",
      to: [{ type: "blog" }, { type: "page" }],
    },
  ],

  preview: {
    select: {
      name: "name",
      comment: "comment",
      post: "post.title",
    },
    prepare({
      name,
      comment,
      post,
    }: {
      name: string;
      comment: string;
      post: string;
    }) {
      return {
        title: `${name} on ${post}`,
        subtitle: comment,
      };
    },
  },
};
