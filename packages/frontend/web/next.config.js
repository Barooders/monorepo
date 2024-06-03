/* eslint-disable @typescript-eslint/no-var-requires */
const bundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  productionBrowserSourceMaps: true,
  experimental: {
    externalDir: true,
  },
  env: {
    NEXT_PUBLIC_BUILD_NAME: 'web',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'barooders-medusa-staging.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'barooders-medusa-production.s3.amazonaws.com',
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:resourceType/:resourceHandle/.json',
          destination: `${process.env.NEXT_PUBLIC_SHOP_BASE_URL}/:resourceType/:resourceHandle/.json`,
        },
        {
          source: '/admin/:path*',
          destination: `${process.env.NEXT_PUBLIC_SHOP_BASE_URL}/admin/:path*`,
        },
      ],
    };
  },
  sentry: {
    disableClientWebpackPlugin: true,
    disableServerWebpackPlugin: true,
  },
};

module.exports = bundleAnalyzer(nextConfig);

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);
