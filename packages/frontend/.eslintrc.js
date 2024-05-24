module.exports = {
  extends: [
    '../../.eslintrc.common.js',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    files: ['**/*.ts', '**/*.tsx'],
    project: 'tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@apollo/client',
            importNames: ['gql'],
            message:
              'Please use role-specific graphql from "@/__generated/gql/{role}"',
          },
        ],
      },
    ],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useWrappedAsyncFn|useAsync)',
      },
    ],
  },
};
