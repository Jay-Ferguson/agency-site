/*************  ✨ Windsurf Command ⭐  *************/
import { CodeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const projects = defineType({
  name: "projects",
  title: "Projects",
  type: "document",
  icon: CodeIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Project Name",
      description: "The name of the project",
      validation: (Rule) => Rule.required().error("Project name is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A brief description of the project",
      rows: 3,
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description:
        "A photo of the author that will appear next to their articles",
      options: {
        hotspot: true,
      },
    }),
  ],
});
