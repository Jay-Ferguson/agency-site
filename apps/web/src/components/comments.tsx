"use client";

import React from "react";
import { useEffect } from "react";

import { client } from "@/lib/sanity/client";

export default function Comments() {
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await client.fetch('*[_type == "comments"]');
        console.log(comments);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching comments:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
    };

    fetchComments();
  }, []);
  return <div>comments</div>;
}
