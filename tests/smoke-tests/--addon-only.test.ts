import fse from 'fs-extra';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AddonHelper, dirContents } from '../helpers.js';

describe('--addon-only', () => {
  let helper = new AddonHelper({ packageManager: 'pnpm', args: ['--addon-only'] });

  beforeAll(async () => {
    await helper.setup();
    await helper.installDeps();
  });

  afterAll(async () => {
    await helper.clean();
  });

  it('has all the dot files', async () => {
    let contents = await dirContents(helper.projectRoot);

    expect(contents).to.include('.eslintrc.cjs');
    expect(contents).to.include('.eslintignore');
    expect(contents).to.include('.prettierrc.cjs');
    expect(contents).to.include('.prettierignore');
    expect(contents).to.include('.template-lintrc.cjs');
    expect(contents).to.include('.gitignore');
  });

  it('is not a monorepo', async () => {
    let hasPnpmWorkspace = await fse.pathExists(
      path.join(helper.projectRoot, 'pnpm-workspace.yaml')
    );
    let packageJson = await fse.readJson(path.join(helper.projectRoot, 'package.json'));

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
