"use client";

import { ApiError } from "next-sanity";
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
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name?: string }).name === "ApiError"
        ) {
          console.error("API Error:", (error as { message?: string }).message);
        } else {
          console.error("Unexpected Error:", error);
        }
      }
    };

    fetchComments();
  }, []);
  return <div>comments</div>;
}
