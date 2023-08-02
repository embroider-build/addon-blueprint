import { execa } from 'execa';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AddonHelper, dirContents } from '../helpers.js';

describe(`rollup-build | explicit-imports`, () => {
  let distDir = '';
  let declarationsDir = '';
  let helper = new AddonHelper({
    packageManager: 'pnpm',
    args: ['--typescript'],
    scenario: 'explicit-imports',
  });

  beforeAll(async () => {
    await helper.setup();
    await helper.installDeps();

    distDir = path.join(helper.addonFolder, 'dist');
    declarationsDir = path.join(helper.addonFolder, 'declarations');
  });

  afterAll(async () => {
    await helper.clean();
  });

  it('builds with success', async () => {
    // Copy over fixtures
    await helper.fixtures.useAll();

    /**
     * In order to use build with components, we need to add more dependencies
     * We may want to consider making these default
     */
    await execa('pnpm', ['add', '--save-peer', '@glimmer/component'], {
      cwd: helper.addonFolder,
    });

    let buildResult = await helper.build();

    expect(buildResult.exitCode).toEqual(0);

    // like deep-equal(ish), but allows for files to have extras
    function hasEachOf(files: string[], expected: string[]) {
      for (let file of expected) {
        expect(files).to.include(
          file,
          `expected ${file} to be included in the expected list of files: ${expected.join(
            ' '
          )}, however, only ${files.join(', ')} were found.`
        );
      }
    }

    hasEachOf(await dirContents(distDir), [
      '_app_',
      'components',
      'index.js',
      'index.js.map',
      'template-registry.js',
      'template-registry.js.map',
    ]);

    expect(await dirContents(declarationsDir)).to.deep.equal([
      'components',
      'index.d.ts',
      'index.d.ts.map',
      'services',
      'template-registry.d.ts',
      'template-registry.d.ts.map',
    ]);

    expect(await dirContents(path.join(distDir, 'services'))).to.deep.equal(
      [],
      'my-service.js is not in the app-re-exports'
    );
    expect(await dirContents(path.join(declarationsDir, 'services'))).to.deep.equal([
      'my-service.d.ts',
      'my-service.d.ts.map',
    ]);

    expect(await dirContents(path.join(distDir, 'components'))).to.deep.equal([
      'js-component.js',
      'js-component.js.map',
      'nested',
      'ts-component.js',
      'ts-component.js.map',
    ]);

    expect(await dirContents(path.join(declarationsDir, 'components'))).to.deep.equal([
      'js-component.d.ts',
      'js-component.d.ts.map',
      'nested',
      'template-only.d.ts',
      'template-only.d.ts.map',
      'ts-component.d.ts',
      'ts-component.d.ts.map',
    ]);

    let testResult = await helper.run('test');

    expect(testResult.exitCode).toEqual(0);
    expect(testResult.stdout).to.include('# tests 5');
    expect(testResult.stdout).to.include('# pass  5');
    expect(testResult.stdout).to.include('# fail  0');
  });
});
