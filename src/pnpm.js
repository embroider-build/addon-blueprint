'use strict';

const fs = require('fs/promises');
const path = require('path');

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

module.exports = {
  createWorkspacesFile,
};
