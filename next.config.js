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
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'bka.hcmut.edu.vn',
      'encrypted-tbn0.gstatic.com',
      'firebasestorage.googleapis.com',
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
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
      {
        source: '/api/update_tenant_transaction',
        destination: '/api/transaction_ipn',
      },
    ];
  },
};

module.exports = nextConfig;
