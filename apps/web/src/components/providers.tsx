"use client";

import { ConsentManagerProvider, CookieBanner, ConsentManagerDialog } from "@c15t/nextjs";
import type * as React from "react";

import { PostHogConsentListener } from "./posthog-consent-listener";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConsentManagerProvider options={{ consentCategories: [] }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <CookieBanner />
        <ConsentManagerDialog />
        <PostHogConsentListener />
      </ThemeProvider>
    </ConsentManagerProvider>
  );
}
