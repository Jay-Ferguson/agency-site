import { PlayIcon } from "@sanity/icons";
import { defineArrayMember, defineField } from "sanity";

import { YouTubePreview } from "../../components/youtubePreview";

defineArrayMember({
  name: "youtubeEmbed",
  title: "YouTube Embed",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      description:
        "Enter a YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ["http", "https"],
          })
          .custom((url) => {
            if (!url) return "YouTube URL is required";
            const isYouTube =
              /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(url);
            return isYouTube || "Please enter a valid YouTube URL";
          }),
    }),
  ],
  preview: {
    select: { title: "url" },
  },
  components: {
    preview: YouTubePreview,
  },
});
