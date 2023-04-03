/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  experimental: {
    // Required:
    appDir: true,
    esmExternals: false,
    swcMinify: true,
  },
  compiler: {
    styledComponents: true,
  },
  eslint: {
    dirs: ['src'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async rewrites() {
    const mailHost = process.env.NEXT_PUBLIC_MAIL_HOST;
    return [
      {
        source: '/mailHost/:path*',
        destination: `${mailHost}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
