import fixturify from 'fixturify';
import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { assertGeneratedCorrectly } from '../../assertions.js';
import { createAddon, createTmp, install, runScript } from '../../utils.js';

let commonFixtures = {
  '.prettierrc.js':
    // prettier-ignore
    'module.exports = {' + 
        '  singleQuote: true,' + 
        '};',
};

describe('custom locations', () => {
  let cwd = '';
  let tmpDir = '';
  let addonLocation = 'addons/my-fancy-addon';
  let testAppLocation = 'tests/my-fancy-addon';
  let rootFiles = {};

  beforeAll(async () => {
    tmpDir = await createTmp();

    let rootPackageJson = {
      name: 'existing-monorepo',
      private: true,
      devDependencies: {
        prettier: '^2.5.0',
      },
    };

    rootFiles = {
      ...commonFixtures,
      'package.json': JSON.stringify(rootPackageJson),
      'pnpm-workspace.yaml': "packages:\n  - 'addons/*'\n  - 'tests/*'",
    };
    fixturify.writeSync(tmpDir, rootFiles);

    await createAddon({
      args: [
        `--addon-location=${addonLocation}`,
        `--test-app-location=${testAppLocation}`,
        '--pnpm=true',
      ],
      options: { cwd: tmpDir },
    });

    cwd = tmpDir;

    await install({ cwd, packageManager: 'pnpm' });
  });

  afterAll(async () => {
    fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('ignores root files', async () => {
    expect(
      fixturify.readSync(cwd, {
        ignore: ['addons', 'tests', 'node_modules', 'pnpm-lock.yaml', '.npmrc'],
      }),
      'root files have not been touched'
    ).toEqual(rootFiles);
  });

  it('was generated correctly', async () => {
    assertGeneratedCorrectly({
      projectRoot: cwd,
      addonLocation,
      testAppLocation,
      expectedStaticFiles: ['README.md', 'CONTRIBUTING.md'],
    });
  });

  it('runs tests', async () => {
    let { exitCode } = await runScript({
      cwd: path.join(cwd, testAppLocation),
      script: 'test',
      packageManager: 'pnpm',
    });

    expect(exitCode).toEqual(0);
  });

  it('addon lints all pass', async () => {
    let { exitCode } = await runScript({
      cwd: path.join(cwd, addonLocation),
      script: 'lint',
      packageManager: 'pnpm',
    });

    expect(exitCode).toEqual(0);
  });

  it('test-app lints all pass', async () => {
    let { exitCode } = await runScript({
      cwd: path.join(cwd, testAppLocation),
      script: 'lint',
      packageManager: 'pnpm',
    });

    expect(exitCode).toEqual(0);
  });
});
