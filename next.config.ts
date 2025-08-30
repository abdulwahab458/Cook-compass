import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com","images.unsplash.com"],
     // allow Cloudinary images
  },
};

export default nextConfig;
