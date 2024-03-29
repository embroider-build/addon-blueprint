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
  plugins: ['ember', 'import'],
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
    // require relative imports use full extensions
    {
      files: ['src/**/*.{js,ts,gjs,gts}'],
      rules: {
        'import/extensions': ['error', 'always', { ignorePackages: true }],
      },
    },
<% } else { %>    // require relative imports use full extensions
    {
      files: ['src/**/*.{js,gjs}'],
      rules: {
        'import/extensions': ['error', 'always', { ignorePackages: true }],
      },
    },
<% } %>    // node files
    {
      files: [
        './.eslintrc.cjs',
        './.prettierrc.cjs',
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
