/** @type {import('next').NextConfig} */
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
};

export default nextConfig;
