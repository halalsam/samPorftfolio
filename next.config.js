/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Pin the workspace root so Turbopack doesn't infer a parent dir that
  // happens to contain a stray lockfile.
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.rawpixel.com',
      },
    ],
  },
};

module.exports = nextConfig;
