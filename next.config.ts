import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sexxotudvpbbuvaloued.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/imagens-homenagens/**',
      },
    ]
  }
};

export default nextConfig;
