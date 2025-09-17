import { defineField } from "sanity";
defineField({
  type: "code",
  name: "myCodeField",
  title: "Code with all options",

  options: {
    language: "javascript",
    languageAlternatives: [
      { title: "Javascript", value: "javascript" },
      { title: "typescript", value: "typescript" },
      { title: "HTML", value: "html" },
      { title: "CSS", value: "css" },
    ],
    withFilename: true,
  },
});
