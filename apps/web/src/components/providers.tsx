"use client";

import type * as React from "react";

import {
  type Theme,
  ConsentManagerProvider,
  ConsentBanner,
  ConsentDialog,
} from "@c15t/nextjs";

import { PostHogConsentListener } from "./posthog-consent-listener";
import { ThemeProvider } from "./theme-provider";
import { baseTranslations } from "@c15t/translations/all";

const theme = {
  colors: {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
  },
  radius: {
    md: "0.75rem",
    lg: "1rem",
  },
  slots: {
    consentBannerTitle: "text-xl font-semibold",
    buttonPrimary: "rounded-full",
  },
} satisfies Theme;





const translations = {
  en: baseTranslations.en,
  de: baseTranslations.de,
  fr: baseTranslations.fr,
};


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConsentManagerProvider
      options={{
        mode: 'hosted',
        backendURL: '/api/c15t',
        theme,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ConsentBanner />
        <ConsentDialog />
        <PostHogConsentListener />
      </ThemeProvider>
    </ConsentManagerProvider>
  );
}
