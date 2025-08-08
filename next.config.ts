/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true }, // 🔥 last resort
};

module.exports = nextConfig;