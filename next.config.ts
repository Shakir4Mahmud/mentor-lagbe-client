import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic security headers for every page/API response. CSP is intentionally
  // limited to framing/base/forms so fonts, images and payment redirects keep
  // working exactly as before.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },

  experimental: {
    // Dev server auto-generates AGENTS.md feedback blocks; not needed here.
    agentFeedback: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
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
