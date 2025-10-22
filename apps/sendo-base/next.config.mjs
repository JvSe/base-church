/** @type {import('next').NextConfig} */
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
const nextConfig = {
  transpilePackages: ["@base-church/ui", "@base-church/db", "@repo/icons"],
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
  },
  webpack: (config, { isServer }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    if (isServer) config.plugins = [...config.plugins, new PrismaPlugin()];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
      allowedOrigins: [
        "localhost:3000",
        "localhost:3001",
        "*.vercel.app",
        "*.vercel.com",
      ],
    },
    // Configurações de performance
    optimizeCss: true,
    optimizePackageImports: ["@base-church/ui", "@base-church/db"],
  },
  // Configurações de performance para produção
  ...(process.env.NODE_ENV === "production" && {
    compress: true,
    poweredByHeader: false,
    generateEtags: false,
  }),
};

export default nextConfig;
