import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Next.js dev indicators and overlay
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: "bottom-right",
  },
  // Disable React error overlay in development
  reactStrictMode: true,
  // Production optimizations
  swcMinify: true,
};

export default nextConfig;
