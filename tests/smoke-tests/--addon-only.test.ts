import path from 'node:path';

import fse from 'fs-extra';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AddonHelper, dirContents, matchesFixture } from '../helpers.js';

describe('--addon-only', () => {
  let helper = new AddonHelper({ packageManager: 'pnpm', args: ['--addon-only'] });

  beforeAll(async () => {
    await helper.setup();
    await helper.installDeps();
  });

  afterAll(async () => {
    await helper.clean();
  });

  it('has all the files', async () => {
    let rootContents = await dirContents(helper.projectRoot);

    await matchesFixture('.npmrc', { cwd: helper.projectRoot, scenario: 'pnpm-addon-only' });

    expect(rootContents).to.include('.editorconfig');
    expect(rootContents).to.include('.eslintignore');
    expect(rootContents).to.include('.eslintrc.cjs');
    expect(rootContents).to.include('.gitignore'); 
    expect(rootContents).to.include('.npmrc');
    expect(rootContents).to.include('.prettierignore');
    expect(rootContents).to.include('.prettierrc.cjs');
    expect(rootContents).to.include('.template-lintrc.cjs');
    expect(rootContents).to.include('CONTRIBUTING.md');
    expect(rootContents).to.include('LICENSE.md');
    expect(rootContents).to.include('README.md');
    expect(rootContents).to.include('addon-main.cjs');
    expect(rootContents).to.include('babel.config.json');
    expect(rootContents).to.include('package.json');
    expect(rootContents).to.include('rollup.config.mjs');

    let configContents = await dirContents(path.join(helper.projectRoot, 'config'));
    
    expect(configContents).to.include('ember-cli-update.json');

    let srcContents = await dirContents(path.join(helper.projectRoot, 'src'));
    
    expect(srcContents).to.include('index.js');
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
