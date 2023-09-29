import path from 'node:path';

import fse from 'fs-extra';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  AddonHelper,
  assertGeneratedCorrectly,
  dirContents,
  matchesFixture,
  SUPPORTED_PACKAGE_MANAGERS,
} from '../helpers.js';

for (let packageManager of SUPPORTED_PACKAGE_MANAGERS) {
  describe(`defaults with ${packageManager}`, () => {
    let distDir = '';
    let helper = new AddonHelper({ packageManager });

    beforeAll(async () => {
      await helper.setup();
      await helper.installDeps({ skipPrepare: false });

      distDir = path.join(helper.addonFolder, 'dist');
    });

    afterAll(async () => {
      await helper.clean();
    });

    it('is using the correct packager', async () => {
      let npm = path.join(helper.projectRoot, 'package-lock.json');
      let yarn = path.join(helper.projectRoot, 'yarn.lock');
      let pnpm = path.join(helper.projectRoot, 'pnpm-lock.yaml');

      let testManifest = await fse.readJson(
        path.join(helper.projectRoot, 'test-app', 'package.json'),
      );

      switch (packageManager) {
        case 'npm': {
          expect(await fse.pathExists(npm), 'for NPM: package-lock.json exists').toBe(true);
          expect(await fse.pathExists(yarn), 'yarn.lock does not exist').toBe(false);
          expect(await fse.pathExists(pnpm), 'pnpm-lock.yaml does not exist').toBe(false);

          await matchesFixture('.github/workflows/ci.yml', { cwd: helper.projectRoot });
          await matchesFixture('.github/workflows/push-dist.yml', { cwd: helper.projectRoot });
          await matchesFixture('CONTRIBUTING.md', { cwd: helper.projectRoot });

          expect(testManifest.devDependencies['my-addon']).toBe('^0.0.0');

          break;
        }
        case 'yarn': {
          expect(await fse.pathExists(yarn), 'for Yarn: yarn.lock exists').toBe(true);
          expect(await fse.pathExists(npm), 'package-lock.json does not exist').toBe(false);
          expect(await fse.pathExists(pnpm), 'pnpm-lock.yaml does not exist').toBe(false);

          await matchesFixture('.github/workflows/ci.yml', {
            cwd: helper.projectRoot,
            scenario: 'yarn',
          });
          await matchesFixture('.github/workflows/push-dist.yml', {
            cwd: helper.projectRoot,
            scenario: 'yarn',
          });
          await matchesFixture('CONTRIBUTING.md', { cwd: helper.projectRoot, scenario: 'yarn' });

          expect(testManifest.devDependencies['my-addon']).toBe('^0.0.0');

          break;
        }
        case 'pnpm': {
          expect(await fse.pathExists(pnpm), 'for pnpm: pnpm-lock.yaml exists').toBe(true);
          expect(await fse.pathExists(npm), 'package-lock.json does not exist').toBe(false);
          expect(await fse.pathExists(yarn), 'yarn.lock does not exist').toBe(false);

          await matchesFixture('.github/workflows/ci.yml', {
            cwd: helper.projectRoot,
            scenario: 'pnpm',
          });
          await matchesFixture('.github/workflows/push-dist.yml', {
            cwd: helper.projectRoot,
            scenario: 'pnpm',
          });
          await matchesFixture('CONTRIBUTING.md', { cwd: helper.projectRoot, scenario: 'pnpm' });
          await matchesFixture('.npmrc', {
            cwd: helper.projectRoot,
            scenario: 'pnpm',
          });

          expect(testManifest.devDependencies['my-addon']).toBe('workspace:*');

          break;
        }

        default:
          throw new Error(`unknown packageManager: ${packageManager}`);
      }
    });

    it('"prepare" built the addon', async () => {
      let contents = await dirContents(distDir);

      expect(contents).to.deep.equal(['index.js', 'index.js.map']);
    });

    it('was generated correctly', async () => {
      await assertGeneratedCorrectly({ projectRoot: helper.projectRoot, packageManager });
    });

    // Tests are additive, so when running them in order, we want to check linting
    // before we add files from fixtures
    it('lints with no fixtures all pass', async () => {
      let { exitCode } = await helper.run('lint');

      expect(exitCode).toEqual(0);
    });

    it('build and test ', async () => {
      // Copy over fixtures
      await helper.fixtures.use('./my-addon/src/components');
      await helper.fixtures.use('./test-app/tests');

      // Ensure that we have no lint errors.
      // It's important to keep this along with the tests,
      // so that we can have confidence that the lints aren't destructively changing
      // the files in a way that would break consumers
      let { exitCode } = await helper.run('lint:fix');

      expect(exitCode).toEqual(0);

      let buildResult = await helper.build();

      expect(buildResult.exitCode).toEqual(0);

      let contents = await dirContents(distDir);

      expect(contents).to.deep.equal(['_app_', 'components', 'index.js', 'index.js.map']);

      let testResult = await helper.run('test:ember');

      expect(testResult.exitCode).toEqual(0);

      expect(testResult.stdout).to.include('# tests 4');
      expect(testResult.stdout).to.include('# pass  4');
      expect(testResult.stdout).to.include('# fail  0');
    });
  });
}
