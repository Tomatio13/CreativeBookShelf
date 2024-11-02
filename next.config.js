/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'pocketbase', '127.0.0.1'], // 127.0.0.1を追加
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
        destination: `${process.env.NEXT_PUBLIC_AI_API_URL || 'http://host.docker.internal:8100'}/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090',
    NEXT_PUBLIC_AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL || 'http://host.docker.internal:8100'
  },
};

module.exports = nextConfig;
