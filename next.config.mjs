/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Tạm thời ignore type errors để build thành công
    ignoreBuildErrors: false,
  },
  eslint: {
    // Tạm thời ignore ESLint errors
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
    ],
  },
};

export default nextConfig;

