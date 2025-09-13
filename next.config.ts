import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  output: "standalone",
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
