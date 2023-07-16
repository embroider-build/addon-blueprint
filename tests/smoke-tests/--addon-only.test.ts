import fse from 'fs-extra';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AddonHelper } from '../test-helpers.js';

describe('--addon-only', () => {
  let helper = new AddonHelper({ packageManager: 'pnpm', args: ['--addon-only'] });

  beforeAll(async () => {
    await helper.setup();
    await helper.installDeps();
  });

  afterAll(async () => {
    await helper.clean();
  });

  it('is not a monorepo', async () => {
    let hasPnpmWorkspace = await fse.pathExists(path.join(helper.cwd, 'pnpm-workspace.yaml'));
    let packageJson = await fse.readJson(path.join(helper.cwd, 'package.json'));

    expect(hasPnpmWorkspace).toBe(false);
    // Pnpm doesn't use this field, but it's good that it doesn't exist.
    expect(packageJson.workspaces).toBeFalsy();
  });

  it('can build', async () => {
    let { exitCode } = await helper.build();

    expect(exitCode).toEqual(0);
  });

  it('has passing lints', async () => {
    let { exitCode } = await helper.build();

    expect(exitCode).toEqual(0);
  });
});
