import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // appDir (thư mục /app) được hỗ trợ chính thức trong Next 13+,
  // nên không cần experimental.appDir = true
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*", // backend dev
      },
    ];
  },
};

export default nextConfig;
