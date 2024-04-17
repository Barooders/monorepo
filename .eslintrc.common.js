module.exports = {
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            importNames: ['merge'],
            message:
              'Lodash merge mutates the first object, please use our merge override from shared-types instead.',
          },
        ],
      },
    ],
  },
};
