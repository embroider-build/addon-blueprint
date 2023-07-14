import fse from 'fs-extra';
import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createAddon, createTmp, install, runScript } from '../utils.js';

describe('--addon-only', () => {
  let cwd = '';
  let tmpDir = '';

  beforeAll(async () => {
    tmpDir = await createTmp();

    let { name } = await createAddon({
      args: ['--addon-only', '--pnpm=true'],
      options: { cwd: tmpDir },
    });

    cwd = path.join(tmpDir, name);

    await install({ cwd, packageManager: 'pnpm' });
  });

  afterAll(async () => {
    fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('is not a monorepo', async () => {
    let hasPnpmWorkspace = await fse.pathExists(path.join(cwd, 'pnpm-workspace.yaml'));
    let packageJson = await fse.readJson(path.join(cwd, 'package.json'));

    expect(hasPnpmWorkspace).toBe(false);
    // Pnpm doesn't use this field, but it's good that it doesn't exist.
    expect(packageJson.workspaces).toBeFalsy();
  });

  it('can build', async () => {
    let { exitCode } = await runScript({ cwd, script: 'build', packageManager: 'pnpm' });

    expect(exitCode).toEqual(0);
  });

  it('has passing lints', async () => {
    let { exitCode } = await runScript({ cwd, script: 'lint', packageManager: 'pnpm' });

    expect(exitCode).toEqual(0);
  });
});
