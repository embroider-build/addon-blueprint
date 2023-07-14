import fse from 'fs-extra';
import fs from 'node:fs/promises';
import path from 'node:path';
import { expect } from 'vitest';

import { fixture, packageJsonAt } from './utils.js';

interface AssertGeneratedOptions {
  projectRoot: string;
  addonLocation?: string;
  addonName?: string;
  testAppLocation?: string;
  testAppName?: string;
  expectedStaticFiles?: string[];
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
  expectedStaticFiles = ['README.md', 'LICENSE.md'],
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

  for (let expectedFile of expectedStaticFiles) {
    let pathToFile = path.join(addonPath, expectedFile);

    expect(await fse.pathExists(pathToFile), `${pathToFile} exists`).toBe(true);
  }

  await matchesFixture('.prettierrc.js', { cwd: projectRoot });
}

export async function matchesFixture(
  /**
   * Project-relative file to test against
   */
  testFilePath: string,
  options?: {
    /**
     * Which fixture set to use
     */
    scenario?: string;
    /**
     * By default, the file used will be the same as the testFilePath, but
     * in the fixtures directory under the (maybe) specified scenario.
     * this can be overridden, if needed.
     * (like if you're testFilePath is deep with in an existing monorepo, and wouldn't
     *   inherently match our default-project structure used in the fixtures)
     */
    file?: string;

    /**
     * The working directory to use for the relative paths. Defaults to process.cwd() (node default)
     */
    cwd?: string;
  }
) {
  let scenario = options?.scenario ?? 'default';
  let fixtureFile = options?.file ?? testFilePath;

  if (options?.cwd) {
    testFilePath = path.join(options.cwd, testFilePath);
    fixtureFile = path.join(options.cwd, fixtureFile);
  }

  let sourceContents = await fs.readFile(testFilePath);
  let fixtureContents = await fixture(fixtureFile, { scenario });

  expect(sourceContents).to.equal(fixtureContents, `${testFilePath} matches ${fixtureFile}`);
}
