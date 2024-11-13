/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/vocab',
  experimental: {
    serverActions: true,
    runtime: "edge",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' newsletter.envisioning.io;",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // This will allow production builds to complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Optionally, enable logging for development
  // reactStrictMode: true,
};

module.exports = nextConfig;
