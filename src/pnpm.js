'use strict';

const fs = require('fs/promises');
const path = require('path');
const fse = require('fs-extra');

/**
 * @typedef {import('./types').AddonInfo} AddonInfo
 * @typedef {import('./types').TestAppInfo} TestAppInfo
 */

/**
 * @param {string} targetPath
 * @param {AddonInfo} addonInfo
 * @param {TestAppInfo} testAppInfo
 */
async function createWorkspacesFile(targetPath, addonInfo, testAppInfo) {
  let content = `packages:\n` + `  - '${addonInfo.location}'\n` + `  - '${testAppInfo.location}'\n`;

  await fs.writeFile(path.join(targetPath, 'pnpm-workspace.yaml'), content);
}

/**
 *
 * @param {AddonInfo} addonInfo
 * @param {TestAppInfo} testAppInfo
 */
async function handleImperfections(addonInfo, testAppInfo) {
  /**
   * https://github.com/pnpm/pnpm/issues/4965#issuecomment-1405264290
   *
   * for dependencies in a monorepo, AND when peerDependencies need to be resolved correctly,
   * the dependencies must use `dependenciesMeta.*.injected: true`,
   *
   * more info here:
   *  https://pnpm.io/package_json#dependenciesmetainjected
   */
  let testAppPackageJsonPath = path.join(testAppInfo.location, 'package.json');
  let testAppPackageJson = await fse.readJSON(testAppPackageJsonPath);

  testAppPackageJson.dependenciesMeta = {
    [addonInfo.name.dashed]: {
      injected: true,
    },
  };
}

module.exports = {
  createWorkspacesFile,
  handleImperfections,
};
