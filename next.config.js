/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  experimental: {
    // Required:
    appDir: true,
    esmExternals: false,
  },
  compiler: {
    styledComponents: true,
  },
  eslint: {
    dirs: ['src'],
  },
};

module.exports = nextConfig;
