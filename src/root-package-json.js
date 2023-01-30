// @ts-check
const assert = require('assert');

/**
 * @typedef {import('./types').Options} Options
 *
 * @typedef {object} Info
 * @property {import('./types').AddonInfo} addon
 * @property {import('./types').TestAppInfo} testApp
 *
 */
const { addonInfoFromOptions, testAppInfoFromOptions } = require('./info');

module.exports = {
  /**
   * @param {Options} options
   */
  scripts(options) {
    let { packageManager, yarn, pnpm } = options;

    let info = {
      addon: addonInfoFromOptions(options),
      testApp: testAppInfoFromOptions(options),
    };

    if (packageManager === 'pnpm' || pnpm) {
      return scripts.pnpm(options, info);
    }

    if (packageManager === 'yarn' || yarn) {
      return scripts.yarn(options, info);
    }

    return scripts.npm(options, info);
  },
};

let scripts = {
  /**
   * @param {Options} options
   * @param {Info} info
   */
  npm: (options, info) => {
    let {
      addon: { packageName: addonName },
      testApp: { packageName: testAppName },
    } = info;

    return {
      prepare: 'npm run build',
      build: `npm run build --workspace ${addonName}`,

      start: "concurrently 'npm:start:*' --restart-after 5000 --prefix-colors cyan,white,yellow",
      'start:tests': `npm start --workspace ${testAppName}`,
      'start:addon': `npm start --workspace ${addonName} -- --no-watch.clearScreen`,

      test: `npm test --workspace ${testAppName}`,

      lint: 'npm run lint --workspaces --if-present',
      'lint:fix': 'npm run lint:fix --workspaces --if-present',
    };
  },

  /**
   * @param {Options} options
   * @param {Info} info
   */
  yarn: (options, info) => {
    let {
      addon: { packageName: addonName },
      testApp: { packageName: testAppName },
    } = info;

    return {
      prepare: `yarn build`,
      build: `yarn workspace ${addonName} run build`,

      start: `concurrently 'npm:start:*' --restart-after 5000 --prefix-colors cyan,white,yellow`,
      'start:addon': `yarn workspace ${addonName} run start`,
      'start:test': `yarn workspace ${testAppName} run start`,

      test: 'yarn workspaces run test',

      lint: 'yarn workspaces run lint',
      'lint:fix': 'yarn workspaces run lint:fix',
    };
  },

  /**
   * @param {Options} options
   * @param {Info} info
   */
  pnpm: (options, info) => {
    let {
      addon: { packageName: addonName },
      testApp: { packageName: testAppName },
    } = info;

    return {
      /**
       * For most optimized C.I., this will likely want to be removed, but
       * the prepare scripts helps folks get going quicker without having to understand
       * that every step in C.I. that needs the addon also needs the addon to be built first.
       */
      prepare: `pnpm build`,
      build: `pnpm --filter ${addonName} build`,
      /**
       * restart-after exists because ember-cli continually crashes
       * when addon code changes from underneath it.
       *
       * See also: https://github.com/ember-cli/ember-cli/issues/9584
       *
       * Colors are customizable
       */
      start: "concurrently 'npm:start:*' --restart-after 5000 --prefix-colors cyan,white,yellow",
      'start:tests': `pnpm --filter ${testAppName} start`,
      'start:addon': `pnpm --filter ${addonName} start --no-watch.clearScreen`,

      /**
       * Note that this test is different from v1 addon's test, which runs all of ember-try as well.
       * ember-try requires some alternate lockfile behaviors that we can't easily abstract into a
       * package.json script -- but will be present in C.I.
       *  (this is a consequence of enforced strict peers)
       */
      test: `pnpm --filter ${testAppName} test`,

      lint: "pnpm --filter '*' lint",
      'lint:fix': "pnpm --filter '*' lint:fix",
    };
  },
};
