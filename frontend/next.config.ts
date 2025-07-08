import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@nestjs/common', '@nestjs/core'],
};

export default nextConfig;
