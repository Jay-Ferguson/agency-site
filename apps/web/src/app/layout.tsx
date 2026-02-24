import "@workspace/ui/globals.css";

import { Geist, Geist_Mono, Quicksand } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import type { JSX } from "react";
import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { NavbarServer, NavbarSkeleton } from "@/components/navbar";
import PageWrapper from "@/components/PageWrapper";
import { PreviewBar } from "@/components/preview-bar";
import { SanityLive } from "@/lib/sanity/live";

import { Providers } from "../components/providers";

const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["400", "500", "600", "700"],
  display: "optional",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "optional",
});

const fontquicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "optional",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontGeist.variable} ${fontMono.variable} ${fontquicksand.variable} font-geist antialiased`}
      >
        <Providers>
          <Suspense fallback={<NavbarSkeleton />}>
            <NavbarServer />
          </Suspense>
          <PageWrapper>{children}</PageWrapper>
          <Suspense fallback={<FooterSkeleton />}>
            <FooterServer />
          </Suspense>
          <SanityLive />
          {(await draftMode()).isEnabled && (
            <>
              <PreviewBar />
              <VisualEditing />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
