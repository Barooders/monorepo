module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
