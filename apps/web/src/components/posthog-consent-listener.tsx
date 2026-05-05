"use client";

import { useConsentManager } from "@c15t/nextjs";
import posthog from "posthog-js";
import { useEffect } from "react";

export function PostHogConsentListener() {
  // C15T exposes analytics-style consent as the 'measurement' category.
  const { consents } = useConsentManager();

  useEffect(() => {
    if (consents?.measurement) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }, [consents]);

  return null;
}
