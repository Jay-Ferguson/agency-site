// fallow-ignore-file unused-file
import { Flex, Text } from "@sanity/ui";
import ReactPlayer from "react-player";
import type { PreviewProps } from "sanity";

// fallow-ignore-next-line unused-export
export function YouTubePreview(props: PreviewProps) {
  const { title: url } = props;

  return (
    <Flex padding={3} align="center" justify="center">
      {typeof url === "string" ? (
        <ReactPlayer src={url} />
      ) : (
        <Text>Add a YouTube URL</Text>
      )}
    </Flex>
  );
}
