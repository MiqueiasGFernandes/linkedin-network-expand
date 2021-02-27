module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-param-reassing': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-continue': 'off',
  },
};
