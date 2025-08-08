/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Configuration des images
  images: {
    // Autoriser toutes les sources d'images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Désactiver l'optimisation d'images (utile pour les images uploadées)
    unoptimized: true,
  },

  // 2. Configuration de l'ESLint
  eslint: {
    // Ignorer les erreurs ESLint pendant le build
    ignoreDuringBuilds: true,
  },

  // 3. Configuration TypeScript
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },

  // 4. Mode Strict (peut causer des doubles rendus en développement)
  reactStrictMode: true,

  // 5. Headers personnalisés pour les images
  async headers() {
    return [
      {
        source: '/api/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 6. Configuration de l'output (important pour Vercel)
  output: 'standalone',
};

module.exports = nextConfig;