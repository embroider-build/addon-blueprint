import fse from 'fs-extra';
import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { assertGeneratedCorrectly } from '../assertions.js';
import {
  createAddon,
  createTmp,
  dirContents,
  install,
  runScript,
  SUPPORTED_PACKAGE_MANAGERS,
} from '../utils.js';

for (let packageManager of SUPPORTED_PACKAGE_MANAGERS) {
  describe(`defaults with ${packageManager}`, () => {
    let cwd = '';
    let tmpDir = '';
    let distDir = '';
    let addonName = '';

    beforeAll(async () => {
      tmpDir = await createTmp();

      console.debug(`Debug test repo at ${tmpDir}`);

      let { name } = await createAddon({
        args: [`--${packageManager}=true`],
        options: { cwd: tmpDir },
      });

      addonName = name;

      cwd = path.join(tmpDir, name);
      distDir = path.join(cwd, name, 'dist');

      await install({ cwd, packageManager });
    });

    afterAll(async () => {
      fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('is using the correct packager', async () => {
      let npm = path.join(cwd, 'package-lock.json');
      let yarn = path.join(cwd, 'yarn.lock');
      let pnpm = path.join(cwd, 'pnpm-lock.yaml');

      switch (packageManager) {
        case 'npm': {
          expect(await fse.pathExists(npm), 'for NPM: package-lock.json exists').toBe(true);
          expect(await fse.pathExists(yarn), 'yarn.lock does not exist').toBe(false);
          expect(await fse.pathExists(pnpm), 'pnpm-lock.yaml does not exist').toBe(false);

          break;
        }
        case 'yarn': {
          expect(await fse.pathExists(yarn), 'for Yarn: yarn.lock exists').toBe(true);
          expect(await fse.pathExists(npm), 'package-lock.json does not exist').toBe(false);
          expect(await fse.pathExists(pnpm), 'pnpm-lock.yaml does not exist').toBe(false);

          break;
        }
        case 'pnpm': {
          expect(await fse.pathExists(pnpm), 'for pnpm: pnpm-lock.yaml exists').toBe(true);
          expect(await fse.pathExists(npm), 'package-lock.json does not exist').toBe(false);
          expect(await fse.pathExists(yarn), 'yarn.lock does not exist').toBe(false);

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
      assertGeneratedCorrectly({ projectRoot: cwd });
    });

    it('builds the empty addon and runs tests', async () => {
      let { exitCode } = await runScript({ cwd, script: 'build', packageManager });

      expect(exitCode).toEqual(0);

      let contents = await dirContents(distDir);

      expect(contents).to.deep.equal(['index.js', 'index.js.map']);

      let { exitCode: testExitCode } = await runScript({ cwd, script: 'test', packageManager });

      expect(testExitCode).toEqual(0);
    });

    it('builds the addon with fixtures and runs tests', async () => {
      await fs.cp('./fixtures/components', path.join(cwd, addonName, 'src', 'components'), {
        recursive: true,
      });
      await fs.cp('./fixtures/tests/', path.join(cwd, 'test-app', 'tests'), { recursive: true });

      let { exitCode } = await runScript({ cwd, script: 'build', packageManager });

      expect(exitCode).toEqual(0);

      let contents = await dirContents(distDir);

      expect(contents).to.deep.equal(['_app_', 'components', 'index.js', 'index.js.map']);

      let { exitCode: testExitCode } = await runScript({ cwd, script: 'test', packageManager });

      expect(testExitCode).toEqual(0);
    });

    it('lints all pass', async () => {
      let { exitCode } = await runScript({ cwd, script: 'lint', packageManager });

      expect(exitCode).toEqual(0);
    });
  });
}
