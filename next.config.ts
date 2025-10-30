import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "file.hstatic.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.adidas.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
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
