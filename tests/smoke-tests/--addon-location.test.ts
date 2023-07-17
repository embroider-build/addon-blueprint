import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  assertGeneratedCorrectly,
  createAddon,
  createTmp,
  install,
  runScript,
} from '../helpers.js';

describe('--addon-location', () => {
  let cwd = '';
  let tmpDir = '';
  let addonLocation = 'packages/my-custom-location';

  beforeAll(async () => {
    tmpDir = await createTmp();

    let { name } = await createAddon({
      args: [`--addon-location=${addonLocation}`, '--pnpm=true'],
      options: { cwd: tmpDir },
    });

    cwd = path.join(tmpDir, name);

    await install({ cwd, packageManager: 'pnpm' });
  });

  afterAll(async () => {
    fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('was generated correctly', async () => {
    assertGeneratedCorrectly({ projectRoot: cwd, addonLocation });
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
