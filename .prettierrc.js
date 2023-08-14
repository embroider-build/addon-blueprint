"use strict";

module.exports = {
  overrides: [
    {
      files: [
        "src/**/*",
        "tests/helpers/**/*",
        "tests/rollup-build-tests/**/*",
        "tests/smoke-tests/**/*",
        "tests/*.{js,ts}",
        ".*",
      ],
      singleQuote: true,
      printWidth: 100,
    },
    // An approximation of what would be
    // each workspace is allowed to have its own config
    // this is primarily to help us, as maintainers of tests,
    // not fail the "lint" exit code check in tests so easily.
    {
      files: ["tests/fixtures/**/*.{js,ts,gjs,gts,hbs}"],

  plugins: ['prettier-plugin-ember-template-tag'],
  singleQuote: true,
    },
  ],
};
