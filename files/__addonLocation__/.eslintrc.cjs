'use strict';

module.exports = {
  root: true,
  parser: '<%= typescript ? '@typescript-eslint/parser' : '@babel/eslint-parser' %>',
  parserOptions: {
    ecmaVersion: 'latest',<% if (!typescript) { %>
    sourceType: 'module',
    babelOptions: {
      root: __dirname,
    },<% } %>
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {},
  overrides: [
<% if (typescript) { %>    // ts files
    {
      files: ['**/*.ts', '**/*.gts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        // Add any custom rules here
      },
    },
<% } %>    // node files
    {
      files: [
        './.eslintrc.cjs',
        './.prettierrc.js',
        './.template-lintrc.cjs',
        './addon-main.cjs',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['n'],
      extends: ['plugin:n/recommended'],
    },
  ],
};
