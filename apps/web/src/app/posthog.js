// fallow-ignore-file unused-file
// eslint-env node
// fallow-ignore-next-line unlisted-dependencies
import "dotenv/config";
import "server-only";

// app/posthog.js
import { PostHog } from "posthog-node";

export default function PostHogClient() {
  // eslint-disable-next-line no-undef
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_TOKEN, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}
