import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/landing",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
