const nextConfig = {
  output: 'export',
  experimental: {
    appDir: true,
    externalDir: true,
  },
  env: {
    NEXT_PUBLIC_BUILD_NAME: 'pwa',
  },
  sentry: {
    disableClientWebpackPlugin: true,
    disableServerWebpackPlugin: true,
  },
};

module.exports = nextConfig;
