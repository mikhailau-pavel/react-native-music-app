module.exports = {
  extends: ['expo', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  ignorePatterns: ['build/', 'dist/'],
  rules: {
    'no-console': 'warn',
  },
};
