'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');
const { baseConfig: CJS } = require('@nullvoxpopuli/eslint-configs/configs/node');
let mts = configs.nodeTS();

module.exports = {
  ...mts,
  overrides: [
    ...mts.overrides,
    {
      // Top-level JS files are CJS
      files: ['*.js'],
      ...CJS,
    },
  ],
};
