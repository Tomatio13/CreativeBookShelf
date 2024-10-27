/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'], // 開発環境用
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 本番環境のドメインを設定
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: 'http://localhost:8100/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
