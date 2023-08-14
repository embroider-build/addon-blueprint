'use strict';

module.exports = {
  singleQuote: true,
  printWidth: 100,
  overrides: [
    // An approximation of what would be
    // each workspace is allowed to have its own config
    // this is primarily to help us, as maintainers of tests,
    // not fail the "lint" exit code check in tests so easily.
    {
      files: ['tests/fixtures/**/*.{js,ts,gjs,gts,hbs}'],
      plugins: ['prettier-plugin-ember-template-tag'],
      singleQuote: true,
      // defaults, overriding the top level
      printWidth: 80,
    },
  ],
};
