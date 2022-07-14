import fse from 'fs-extra';
import path from 'node:path';
import { expect } from 'vitest';

import { packageJsonAt } from './utils.js';

interface AssertGeneratedOptions {
  projectRoot: string;
  addonLocation?: string;
  addonName?: string;
  testAppLocation?: string;
  testAppName?: string;
}

/**
 * Asserts that the names / paths of the test-app and addon
 * exist and are corrected via dependencies.
 */
export async function assertGeneratedCorrectly({
  projectRoot,
  addonLocation = 'my-addon',
  addonName = 'my-addon',
  testAppLocation = 'test-app',
  testAppName = 'test-app',
}: AssertGeneratedOptions) {
  let addonPath = path.join(projectRoot, addonLocation);
  let testAppPath = path.join(projectRoot, testAppLocation);

  expect(await fse.pathExists(addonPath), `${addonPath} exists`).toBe(true);
  expect(await fse.pathExists(testAppPath), `${testAppPath} exists`).toBe(true);

  let addonPackageJson = await packageJsonAt(addonPath);
  let testAppPackageJson = await packageJsonAt(testAppPath);

  expect(addonPackageJson.name, `addon has correct name: ${addonName}`).toEqual(addonName);
  expect(testAppPackageJson.name, `testApp has correct name: ${testAppName}`).toEqual(testAppName);

  expect(
    [
      ...Object.keys(testAppPackageJson.dependencies || {}),
      ...Object.keys(testAppPackageJson.devDependencies || {}),
    ],
    `The test app has a (dev)dependency on the addon`
  ).to.include(addonName);
}
