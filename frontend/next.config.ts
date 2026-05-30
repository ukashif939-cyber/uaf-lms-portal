import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_FOR_FIREBASE === "1" ? "export" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
