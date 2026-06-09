import type { NextConfig } from "next";
import path from "path";

const wpHostname = process.env.NEXT_PUBLIC_WP_HOSTNAME ?? "";

const nextConfig: NextConfig = {
  // Silence the "multiple lockfiles" warning by explicitly setting the project root
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      // WordPress media uploads (set NEXT_PUBLIC_WP_HOSTNAME in .env.local)
      ...(wpHostname
        ? [{ protocol: "https" as const, hostname: wpHostname }]
        : []),
      // Allow your placeholder domain for mock products
      { protocol: "https" as const, hostname: "yourwp.com" },
      // Picsum placeholder images used in demo/mock mode
      { protocol: "https" as const, hostname: "picsum.photos" },
      { protocol: "https" as const, hostname: "fastly.picsum.photos" },
    ],
  },
  // Proxy all WordPress REST API requests to your actual SiteGround backend
  async rewrites() {
    return [
      {
        source: "/wp-json/:path*",
        destination: "https://www.campcreekmarket.com/wp-json/:path*",
      },
    ];
  },
};

export default nextConfig;