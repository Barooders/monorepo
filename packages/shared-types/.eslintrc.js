module.exports = {
  extends: [
    '../../.eslintrc.common.js',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    files: ['**/*.ts', '**/*.tsx'],
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
