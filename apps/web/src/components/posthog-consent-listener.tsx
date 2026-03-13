"use client";

import { useConsent } from "@c15t/react";
import posthog from "posthog-js";
import { useEffect } from "react";

export function PostHogConsentListener() {
  const { consent } = useConsent();

  useEffect(() => {
    if (consent?.analytics) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }, [consent]);

  return null;
}
