/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Image Optimization ────────────────────────────────────────────────────
  // Next.js <Image> automatically optimises, resizes, and serves WebP/AVIF.
  // remotePatterns whitelists external image hosts.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
    // Generate multiple size variants for responsive srcsets
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },

  // ─── Strict Mode ───────────────────────────────────────────────────────────
  reactStrictMode: true,
};

module.exports = nextConfig;
