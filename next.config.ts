/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    runtime: "edge",
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
