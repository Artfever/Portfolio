/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js / drei ship untranspiled ESM in places; let Next transpile them.
  transpilePackages: ["three"],
};

module.exports = nextConfig;
