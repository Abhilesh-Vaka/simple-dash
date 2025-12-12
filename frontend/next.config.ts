import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev indicator position (cannot fully disable overlay via config)
  devIndicators: {
    position: "bottom-right",
  },
  // Production optimizations
  reactStrictMode: true,
};

export default nextConfig;
