module.exports = {
  extends: ['airbnb-base'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/no-unresolved': 0,
    'import/extensions': [2, {
      ts: 'never',
    }],
    'no-unused-vars': 0,
  },
};
