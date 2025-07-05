"use client";

import { ApiError } from "next-sanity";
import { SanityClient } from "next-sanity";
import React from "react";
import { useEffect } from "react";

import { client } from "@/lib/sanity/client";

export default function comments() {
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await client.fetch('*[_type == "comments"]');
        console.log(comments);
      } catch (error) {
        if (error instanceof ApiError) {
          console.error("API Error:", error.message);
        } else {
          console.error("Unexpected Error:", error);
        }
      }
    };

    fetchComments();
  }, []);
  return <div>comments</div>;
}
