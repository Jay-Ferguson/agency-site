"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import posthog from "posthog-js";
import type { ComponentProps } from "react";

import type { SanityButtonProps } from "@/types";

type SanityButtonsProps = {
  buttons: SanityButtonProps[] | null;
  className?: string;
  buttonClassName?: string;
  size?: "sm" | "lg" | "default" | "icon" | null | undefined;
};

function SanityButton({
  text,
  href,
  variant = "default",
  openInNewTab,
  className,
  ...props
}: SanityButtonProps & ComponentProps<typeof Button>) {
  if (!href) {
    console.log("Link Broken", { text, href, variant, openInNewTab });
    return <Button>Link Broken</Button>;
  }

  return (
    <Button
      variant={variant}
      {...props}
      asChild
      className={cn("rounded-[10px]", className)}
    >
      <Link
        href={href || "#"}
        target={openInNewTab ? "_blank" : "_self"}
        aria-label={`Navigate to ${text}`}
        title={`Click to visit ${text}`}
        onClick={() =>
          posthog.capture("cta_button_clicked", {
            button_text: text,
            button_href: href,
            opens_in_new_tab: openInNewTab ?? false,
            button_variant: variant,
          })
        }
      >
        {text}
      </Link>
    </Button>
  );
}

export function SanityButtons({
  buttons,
  className,
  buttonClassName,
  size = "default",
}: SanityButtonsProps) {
  if (!buttons?.length) return null;

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      {buttons.map((button) => (
        <SanityButton
          key={`button-${button._key}`}
          size={size}
          {...button}
          className={buttonClassName}
        />
      ))}
    </div>
  );
}
