import type { NextConfig } from 'next';

// When project content moves to Strapi, allow next/image to load its uploads.
const strapiHost = (() => {
  try {
    return process.env.STRAPI_URL ? new URL(process.env.STRAPI_URL) : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // First-paint year for the header and footer (see src/hooks/useYear.ts),
  // identical on server and client; they switch to the live year on mount.
  env: {
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },

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
      ...(strapiHost
        ? [{ protocol: strapiHost.protocol.replace(':', '') as 'http' | 'https', hostname: strapiHost.hostname, ...(strapiHost.port ? { port: strapiHost.port } : {}) }]
        : []),
    ],
  },
};

export default nextConfig;
