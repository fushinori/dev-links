import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "2.5mb",
    },
  },
  images: {
    remotePatterns: [new URL(`${process.env.IMAGE_DOMAIN!}/**`)],
  },
};

export default nextConfig;
