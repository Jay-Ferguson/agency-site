import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /* config options here */
  transpilePackages: ["@workspace/ui"],
  turbopack: {
    root: "/Users/Jay/Desktop/personal-site/agency_site/agency-site",
  },
  experimental: {
    // ppr: true,
    inlineCss: true,
  },
  logging: {
    fetches: {},
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
    ],
  },
};

export default nextConfig;
