'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

let config = configs.node();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.ts'],
      rules: {
        // Requires passing your tsconfig to eslint, which we can do later
        '@typescript-eslint/prefer-optional-chain': 'off',
      },
    },
  ],
};
