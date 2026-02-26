"use server";

import { getPostHogClient } from "@/lib/posthog-server";

export async function newsletterSubmission(formData: FormData) {
  const email = formData.get("email");
  console.log("🚀 ~ newsletterSubmission ~ email:", email);

  if (email && typeof email === "string") {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: email,
      event: "newsletter_subscribed",
      properties: {
        email,
        source: "newsletter_form",
      },
    });
    await posthog.shutdown();
  }
}
