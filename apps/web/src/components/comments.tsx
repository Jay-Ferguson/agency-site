// fallow-ignore-file unused-file
"use client";

import React, { useEffect, useState } from "react";

import Date from "./date";
import { client } from "@/lib/sanity/client";

export default function Comments() {
  const [comments, setComments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await client.fetch('*[_type == "comments"]');
        setComments(comments);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchComments();
  }, []);

  if (error) {
    return <div>Error fetching comments: {error}</div>;
  }

  return (
    <div>
      {comments.length === 0 ? (
        <div className="text-gray-500 p-1.5 flex justify-center opacity-55">No comments yet.</div>
      ) : (
        <ul>
          {comments.map((comment, idx) => (
            <li key={comment._id || idx}>{JSON.stringify(comment)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
