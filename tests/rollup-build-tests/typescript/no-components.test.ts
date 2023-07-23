import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AddonHelper, dirContents } from '../../helpers.js';

describe(`rollup-build | typescript-utils`, () => {
  let distDir = '';
  let declarationsDir = '';
  let helper = new AddonHelper({
    packageManager: 'pnpm',
    args: ['--typescript'],
    scenario: 'typescript-utils',
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

    let buildResult = await helper.build();

    expect(buildResult.exitCode).toEqual(0);

    let distContents = (await dirContents(distDir)).filter(
      // these files have a hash that changes based on file contents
      (distFile) => !distFile.startsWith('_rollupPluginBabelHelpers')
    );
    let declarationsContents = await dirContents(declarationsDir);

    expect(distContents).to.deep.equal(['index.js', 'index.js.map']);

    expect(declarationsContents).to.deep.equal([
      'index.d.ts',
      'index.d.ts.map',
      'template-registry.d.ts',
      'template-registry.d.ts.map',
    ]);
  });
});
