import fs from 'node:fs/promises';
import path from 'node:path';

import fse from 'fs-extra';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AddonHelper, dirContents } from '../helpers.js';

/**
 * These tests are to ensure that for typescript, we've configured the tsconfig.json correctly
 */
describe(`declarations-configuration`, () => {
  let declarationsDir = '';
  let helper = new AddonHelper({
    packageManager: 'pnpm',
    args: ['--typescript'],
    scenario: 'explicit-imports',
  });

  beforeAll(async () => {
    await helper.setup();
    await helper.installDeps();

    declarationsDir = path.join(helper.addonFolder, 'declarations');
  });

  afterAll(async () => {
    await helper.clean();
  });

  describe('rootDir', () => {
    it('there are no top-level files, only nested in folders', async () => {
      await fse.rm(path.join(helper.addonFolder, 'src'), { recursive: true });
      await fse.mkdirp(path.join(helper.addonFolder, 'src/components'));
      await fs.writeFile(path.join(helper.addonFolder, 'src/components/example.ts'), '/* empty file */');

      let buildResult = await helper.build();

      expect(buildResult.exitCode).toEqual(0);

      expect(await dirContents(declarationsDir)).to.deep.equal([
        'components',
      ]);

      expect(await dirContents(path.join(declarationsDir, 'components'))).to.deep.equal([
        'example.d.ts',
        'example.d.ts.map'
      ]);
    });
  });
});
