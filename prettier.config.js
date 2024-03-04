module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  singleAttributePerLine: true,
  overrides: [
    {
      files: ["packages/frontend/**"],
      options: {
      plugins: ['prettier-plugin-tailwindcss'],
      tailwindConfig: 'packages/frontend/tailwind.config.js',
      }
    }
  ]
};
