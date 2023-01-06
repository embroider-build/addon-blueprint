import { type Options, execa } from 'execa';
import fixturify from 'fixturify';
import fse from 'fs-extra';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { assertGeneratedCorrectly } from './assertions.js';
import { createTmp, dirContents, install, runScript } from './utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const blueprintPath = path.join(__dirname, '..');

describe('ember addon <the addon> -b <this blueprint>', () => {
  async function createAddon({
    name = 'my-addon',
    args = [],
    options = {},
  }: {
    name?: string;
    args?: string[];
    options?: Options;
  }) {
    let result = await execa(
      'ember',
      ['addon', name, '-b', blueprintPath, '--skip-npm', '--skip-git', ...args],
      options
    );

    // Light work-around for an upstream `@babel/core` peer issue
    if (typeof options.cwd === 'string') {
      await fs.writeFile(path.join(options.cwd, name, '.npmrc'), 'auto-install-peers=true');
    }

    return { result, name };
  }

  ['npm', 'yarn', 'pnpm'].map((packageManager) => {
    describe(`defaults with ${packageManager}`, () => {
      let cwd = '';
      let tmpDir = '';
      let distDir = '';

      beforeAll(async () => {
        tmpDir = await createTmp();

        console.debug(`Debug test repo at ${tmpDir}`);

        let { name } = await createAddon({
          args: [`--${packageManager}=true`],
          options: { cwd: tmpDir },
        });

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

      it('builds the addon', async () => {
        let { exitCode } = await runScript({ cwd, script: 'build', packageManager });

        expect(exitCode).toEqual(0);

        let contents = await dirContents(distDir);

        expect(contents).to.deep.equal(['index.js', 'index.js.map']);
      });

      it('runs tests', async () => {
        let { exitCode } = await runScript({ cwd, script: 'test', packageManager });

        expect(exitCode).toEqual(0);
      });

      it('lints all pass', async () => {
        let { exitCode } = await runScript({ cwd, script: 'lint', packageManager });

        expect(exitCode).toEqual(0);
      });
    });
  });

  describe('--typescript', () => {
    let cwd = '';
    let tmpDir = '';
    let distDir = '';

    beforeAll(async () => {
      tmpDir = await createTmp();

      let { name } = await createAddon({
        args: ['--typescript', '--yarn=true'],
        options: { cwd: tmpDir },
      });

      cwd = path.join(tmpDir, name);
      distDir = path.join(cwd, name, 'dist');

      await install({ cwd, packageManager: 'yarn' });
    });

    afterAll(async () => {
      await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('was generated correctly', async () => {
      assertGeneratedCorrectly({ projectRoot: cwd });
    });

    it('builds the addon', async () => {
      let { exitCode } = await runScript({ cwd, script: 'build', packageManager: 'yarn' });

      expect(exitCode).toEqual(0);

      let contents = await dirContents(distDir);

      expect(contents).to.deep.equal([
        'index.d.ts',
        'index.d.ts.map',
        'index.js',
        'index.js.map',
        'template-registry.d.ts',
        'template-registry.js',
        'template-registry.js.map',
      ]);
    });

    it('runs tests', async () => {
      let { exitCode } = await runScript({ cwd, script: 'test', packageManager: 'yarn' });

      expect(exitCode).toEqual(0);
    });

    it('lints all pass', async () => {
      let { exitCode } = await runScript({ cwd, script: 'lint', packageManager: 'yarn' });

      expect(exitCode).toEqual(0);
    });
  });

  describe('--addon-location', () => {
    let cwd = '';
    let tmpDir = '';
    let location = '';

    beforeAll(async () => {
      tmpDir = await createTmp();
      location = 'packages/my-custom-location';

      let { name } = await createAddon({
        args: [`--addon-location=${location}`, '--pnpm=true'],
        options: { cwd: tmpDir },
      });

      cwd = path.join(tmpDir, name);

      await install({ cwd, packageManager: 'pnpm' });
    });

    afterAll(async () => {
      fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('was generated correctly', async () => {
      assertGeneratedCorrectly({ projectRoot: cwd, addonLocation: location });
    });

    it('runs tests', async () => {
      let { exitCode } = await runScript({ cwd, script: 'test', packageManager: 'pnpm' });

      expect(exitCode).toEqual(0);
    });

    it('lints all pass', async () => {
      let { exitCode } = await runScript({ cwd, script: 'lint', packageManager: 'pnpm' });

      expect(exitCode).toEqual(0);
    });
  });

  describe('--test-app-location', () => {
    let cwd = '';
    let tmpDir = '';
    let location = '';

    beforeAll(async () => {
      tmpDir = await createTmp();
      location = 'packages/my-custom-location';

      let { name } = await createAddon({
        args: [`--test-app-location=${location}`, '--pnpm=true'],
        options: { cwd: tmpDir },
      });

      cwd = path.join(tmpDir, name);

      await install({ cwd, packageManager: 'pnpm' });
    });

    afterAll(async () => {
      fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('was generated correctly', async () => {
      assertGeneratedCorrectly({ projectRoot: cwd, testAppLocation: location });
    });

    it('runs tests', async () => {
      let { exitCode } = await runScript({ cwd, script: 'test', packageManager: 'pnpm' });

      expect(exitCode).toEqual(0);
    });

    it('lints all pass', async () => {
      let { exitCode } = await runScript({ cwd, script: 'lint', packageManager: 'pnpm' });

      expect(exitCode).toEqual(0);
    });
  });

  describe('existing monorepo', () => {
    ['npm', 'yarn', 'pnpm'].map((packageManager) =>
      describe(`with ${packageManager}`, () => {
        let cwd = '';
        let tmpDir = '';
        let location = '';
        let testAppLocation = '';
        let rootPackageJson;
        let rootFiles = {};
        let lockFile =
          packageManager === 'yarn'
            ? 'yarn.lock'
            : packageManager === 'pnpm'
            ? 'pnpm-lock.yaml'
            : 'package-lock.json';

        beforeAll(async () => {
          tmpDir = await createTmp();

          let commonFixtures = {
            '.prettierrc.js':
              // prettier-ignore
              'module.exports = {' + 
              '  singleQuote: true,' + 
              '};',
          };

          switch (packageManager) {
            case 'npm':
            case 'yarn':
              rootPackageJson = {
                name: 'existing-monorepo',
                private: true,
                workspaces: ['*'],
                devDependencies: {
                  prettier: '^2.5.0',
                },
              };
              rootFiles = {
                ...commonFixtures,
                'package.json': JSON.stringify(rootPackageJson),
              };
              fixturify.writeSync(tmpDir, rootFiles);

              break;
            case 'pnpm':
              rootPackageJson = {
                name: 'existing-monorepo',
                private: true,
                devDependencies: {
                  prettier: '^2.5.0',
                },
              };
              rootFiles = {
                ...commonFixtures,
                'package.json': JSON.stringify(rootPackageJson),
                'pnpm-workspace.yaml': "packages:\n  - '*'",
              };
              fixturify.writeSync(tmpDir, rootFiles);

              break;
          }

          let { name } = await createAddon({
            options: { cwd: tmpDir },
          });

          cwd = tmpDir;
          location = path.join(cwd, name);
          testAppLocation = path.join(cwd, 'test-app');

          await install({ cwd, packageManager });
        });

        afterAll(async () => {
          fs.rm(tmpDir, { recursive: true, force: true });
        });

        it('ignores root files', async () => {
          expect(
            fixturify.readSync(cwd, {
              ignore: ['my-addon', 'test-app', 'node_modules', lockFile],
            }),
            'root files have not been touched'
          ).toEqual(rootFiles);
        });

        it('was generated correctly', async () => {
          await assertGeneratedCorrectly({ projectRoot: cwd });
        });

        it('runs tests', async () => {
          let { exitCode } = await runScript({
            cwd: testAppLocation,
            script: 'test',
            packageManager,
          });

          expect(exitCode).toEqual(0);
        });

        it('addon lints all pass', async () => {
          let { exitCode } = await runScript({ cwd: location, script: 'lint', packageManager });

          expect(exitCode).toEqual(0);
        });

        it('test-app lints all pass', async () => {
          let { exitCode } = await runScript({
            cwd: testAppLocation,
            script: 'lint',
            packageManager,
          });

          expect(exitCode).toEqual(0);
        });
      })
    );
  });
});
