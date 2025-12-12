import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Next.js dev indicators (position only, buildActivity is always shown in dev)
  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
