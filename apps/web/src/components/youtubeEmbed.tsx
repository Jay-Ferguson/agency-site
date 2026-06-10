// fallow-ignore-file unused-file
// @ts-nocheck
// src/components/Body.tsx
import { PortableText } from "next-sanity";
import React from "react";
import ReactPlayer from "react-player";

const serializers = {
  types: {
    youtube: ({ node }: { node: { url: string } }) => {
      const { url } = node;
      return <ReactPlayer url={url} />;
    },
  },
};

export default function Body({ blocks }) {
  return <PortableText value={blocks} types={serializers} />;
}
