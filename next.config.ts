import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: {
    typedRoutes: true,
  },
  output: "standalone",
};

export default nextConfig;
