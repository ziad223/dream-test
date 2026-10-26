import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-839d4c077f8d4907ba3d07717b4ab34c.r2.dev",
      },
      {
        protocol: "https",
        hostname: "marketetrolly.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "new.etrolley.net",
      },
      {
        protocol: "https",
        hostname: "themes.pixelstrap.com",
      },
      {
        protocol: "https",
        hostname: "code.pixelstrap.net",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
