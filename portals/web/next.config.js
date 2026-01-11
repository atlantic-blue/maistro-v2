/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@maistro/ui", "@maistro/validate-frontend"],
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
