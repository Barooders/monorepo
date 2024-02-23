const nextConfig = {
  output: 'export',
  experimental: {
    externalDir: true,
  },
  env: {
    NEXT_PUBLIC_BUILD_NAME: 'native',
  },
  sentry: {
    disableClientWebpackPlugin: true,
    disableServerWebpackPlugin: true,
  },
};

module.exports = nextConfig;
