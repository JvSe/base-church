/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/db", "@repo/icons"],
  experimental: {
    // Enable server components optimization
    serverComponentsExternalPackages: ["@prisma/client"],
    // Optimize bundle for production
    optimizePackageImports: ["@repo/ui", "@repo/db", "@repo/icons"],
  },
  // Optimize for production builds
  swcMinify: true,
  compress: true,
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        port: "",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Prisma client from client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  // Enable static optimization where possible
  output: "standalone",
  // Optimize for Vercel deployment
  trailingSlash: false,
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
