import { assist } from "@sanity/assist";
import { codeInput } from "@sanity/code-input";
import { dashboardTool } from "@sanity/dashboard";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { vercelWidget } from "sanity-plugin-dashboard-widget-vercel";
import { IconManager } from "sanity-plugin-icon-manager";
import { media } from "sanity-plugin-media";
import { plausibleWidget } from "sanity-plugin-plausible-analytics";

import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { createPageTemplate } from "./utils/helper";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;
const presentationOriginUrl = process.env.SANITY_STUDIO_PRESENTATION_URL;

export default defineConfig({
  name: "default",
  title: title ?? "Agency Studio",
  projectId: projectId,
  icon: Logo,
  dataset: dataset ?? "production",
  mediaLibrary: {
    enabled: true,
  },
  plugins: [
    dashboardTool({
      widgets: [
        plausibleWidget({
          url: "https://plausible.io/share/your-project?auth=xxxx",
        }),
        vercelWidget({
          layout: { width: "full" /* default and reccomended */ },
        }),
      ],
    }),
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: {
        origin: presentationOriginUrl ?? "http://localhost:3000",
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
    }),
    assist(),
    structureTool({
      structure,
    }),
    visionTool(),
    media(),
    codeInput(),
    IconManager({
      keepItSimpleFor: "all",
    }),
    presentationUrl(),
  ],

  form: {
    image: {
      assetSources: (sources) =>
        sources.filter((source) => source.name !== "sanity-default"),
    },
    // Disable the default for file assets
    file: {
      assetSources: (sources) =>
        sources.filter((source) => source.name !== "sanity-default"),
    },
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      const { type } = creationContext;
      if (type === "global") return [];
      return prev;
    },
  },
  schema: {
    types: schemaTypes,
    templates: createPageTemplate(),
  },
});
