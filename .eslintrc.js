module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: false,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:jest/recommended', // eslint-plugin-jest
    'plugin:jest/style', //  eslint-plugin-jest - syntax styles
    'plugin:jest-formatting/recommended', // eslint-plugin-jest-formatting
    'plugin:prettier/recommended', // enables eslint-plugin-prettier and eslint-config-prettier, this will display prettier errors as ESLint errors, make sure this is always the last configuration in the extends array
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-warning-comments': ['warn', { terms: ['todo', 'fixme'], location: 'anywhere' }],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'jest/no-export': 'off',
  },
};
