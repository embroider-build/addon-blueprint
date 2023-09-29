import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fse from 'fs-extra';
import { expect } from 'vitest';

import { readFixture } from './fixtures.js';
import { packageJsonAt } from './utils.js';

interface AssertGeneratedOptions {
  projectRoot: string;
  addonLocation?: string;
  addonName?: string;
  testAppLocation?: string;
  testAppName?: string;
  expectedStaticFiles?: string[];
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  typeScript?: boolean;
  existingMonorepo?: boolean;
}

/**
 * Asserts that the names / paths of the test-app and addon
 * exist and are corrected via dependencies.
 */
export async function assertGeneratedCorrectly({
  projectRoot,
  addonLocation,
  addonName = 'my-addon',
  testAppLocation,
  testAppName,
  expectedStaticFiles = ['README.md', 'LICENSE.md'],
  packageManager = 'npm',
  typeScript = false,
  existingMonorepo = false,
}: AssertGeneratedOptions) {
  let addonPath = path.join(projectRoot, addonLocation ?? 'my-addon');
  let testAppPath = path.join(projectRoot, testAppLocation ?? 'test-app');

  expect(await fse.pathExists(addonPath), `${addonPath} exists`).toBe(true);
  expect(await fse.pathExists(testAppPath), `${testAppPath} exists`).toBe(true);

  let addonPackageJson = await packageJsonAt(addonPath);
  let testAppPackageJson = await packageJsonAt(testAppPath);

  expect(addonPackageJson.name, `addon has correct name: ${addonName}`).toEqual(addonName);
  expect(testAppPackageJson.name, `testApp has correct name: ${testAppName ?? 'test-app'}`).toEqual(
    testAppName ?? 'test-app',
  );

  expect(
    [
      ...Object.keys(testAppPackageJson.dependencies || {}),
      ...Object.keys(testAppPackageJson.devDependencies || {}),
    ],
    `The test app has a (dev)dependency on the addon`,
  ).to.include(addonName);

  for (let expectedFile of expectedStaticFiles) {
    let pathToFile = path.join(addonPath, expectedFile);

    expect(await fse.pathExists(pathToFile), `${pathToFile} exists`).toBe(true);
  }

  if (!existingMonorepo) {
    await matchesFixture('.prettierrc.cjs', { cwd: projectRoot });

    await assertCorrectECUJson({
      projectRoot,
      addonName,
      addonLocation,
      testAppLocation,
      testAppName,
      packageManager,
      typeScript,
    });
  }
}

interface AssertECUOptions {
  projectRoot: string;
  addonName: string;
  addonLocation?: string;
  testAppLocation?: string;
  testAppName?: string;
  packageManager: 'npm' | 'yarn' | 'pnpm';
  typeScript: boolean;
}

export async function assertCorrectECUJson({
  projectRoot,
  addonName,
  addonLocation,
  testAppLocation,
  testAppName,
  packageManager,
  typeScript,
}: AssertECUOptions) {
  let configPath = path.join(projectRoot, 'config/ember-cli-update.json');
  let json = await fse.readJSON(configPath);

  let ownPkg = await packageJsonAt(fileURLToPath(new URL('../..', import.meta.url)));

  expect(json.projectName).toEqual(addonName);
  expect(json.packages).toHaveLength(1);

  expect(json.packages[0].name).toEqual('@embroider/addon-blueprint');
  expect(json.packages[0].version).toEqual(ownPkg.version);

  expect(json.packages[0].blueprints).toHaveLength(1);
  expect(json.packages[0].blueprints[0].name).toEqual('@embroider/addon-blueprint');

  if (packageManager !== 'npm') {
    expect(json.packages[0].blueprints[0].options).toContain(`--${packageManager}`);
  }

  if (typeScript) {
    expect(json.packages[0].blueprints[0].options).toContain(`--typescript`);
  } else {
    expect(json.packages[0].blueprints[0].options).not.toContain(`--typescript`);
  }

  if (addonLocation) {
    expect(json.packages[0].blueprints[0].options).toContain(`--addon-location=${addonLocation}`);
  } else {
    expect(json.packages[0].blueprints[0].options).not.toContain(
      `--addon-location=${addonLocation}`,
    );
  }

  if (testAppLocation) {
    expect(json.packages[0].blueprints[0].options).toContain(
      `--test-app-location=${testAppLocation}`,
    );
  } else {
    expect(json.packages[0].blueprints[0].options).not.toContain(
      `--test-app-location=${testAppLocation}`,
    );
  }

  if (testAppName) {
    expect(json.packages[0].blueprints[0].options).toContain(`--test-app-name=${testAppName}`);
  } else {
    expect(json.packages[0].blueprints[0].options).not.toContain(`--test-app-name=${testAppName}`);
  }
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
  },
) {
  let scenario = options?.scenario ?? 'default';
  let fixtureFile = options?.file ?? testFilePath;

  if (options?.cwd) {
    testFilePath = path.join(options.cwd, testFilePath);
  }

  let sourceContents = (await fs.readFile(testFilePath)).toString();
  let fixtureContents = await readFixture(fixtureFile, { scenario });

  /**
   * We trim because whether or not the source or fixture has
   * leading / trailing invisible characters is of no significance
   * and is mostly a bother to get correct in testing
   */
  expect(sourceContents.trim()).to.equal(
    fixtureContents.trim(),
    `${testFilePath} matches ${fixtureFile}`,
  );
}
