import { ActivityIcon } from "@sanity/icons";

const POSTHOG_EMBED_URL = process.env.SANITY_STUDIO_POSTHOG_EMBED_URL ?? "";

export function PostHogAnalytics() {
  if (!POSTHOG_EMBED_URL) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "1rem",
          color: "#6C727D",
        }}
      >
        <ActivityIcon />
        <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
          PostHog Analytics
        </h2>
        <p style={{ margin: 0, textAlign: "center", maxWidth: "400px" }}>
          Add your PostHog shared dashboard URL to{" "}
          <code
            style={{
              backgroundColor: "#f3f4f6",
              padding: "0.125rem 0.375rem",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
            }}
          >
            SANITY_STUDIO_POSTHOG_EMBED_URL
          </code>{" "}
          environment variable.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={POSTHOG_EMBED_URL}
      title="PostHog Analytics Dashboard"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
      allow="fullscreen"
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}

export const PostHogIcon = ActivityIcon;
