import { execa } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { AddonFixtureHelper } from '../fixture-helper.js';
import { createAddon, createTmp, install } from '../utils.js';

let packageManager = 'pnpm';

describe('components (build)', () => {
  describe('co-located JS', () => {
    let cwd = '';
    let tmpDir = '';
    let addonOnlyJS: AddonFixtureHelper;

    beforeEach(async () => {
      tmpDir = await createTmp();

      console.debug(`Debug test repo at ${tmpDir}`);

      let { name } = await createAddon({
        args: [`--pnpm=true`, '--addon-only'],
        options: { cwd: tmpDir },
      });

      cwd = path.join(tmpDir, name);

      addonOnlyJS = new AddonFixtureHelper({
        cwd,
        packageManager: 'pnpm',
        scenario: 'addon-only-js',
      });

      await install({ cwd, packageManager, skipPrepare: true });

      // NOTE: This isn't needed to make the tests pass atm, but it would be
      // required when consumers try to use these compiled components
      await execa('pnpm', ['add', '--save-peer', '@glimmer/component'], { cwd });
    });

    afterEach(async () => {
      fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('generates correct files with no template', async () => {
      await addonOnlyJS.use('src/components/no-template.js');
      await addonOnlyJS.build();
      await addonOnlyJS.matches('dist/components/no-template.js');
    });

    it('generates correct files with a template', async () => {
      await addonOnlyJS.use('src/components/co-located.js');
      await addonOnlyJS.use('src/components/co-located.hbs');
      await addonOnlyJS.build();
      await addonOnlyJS.matches('dist/components/co-located.js');
    });
  });

  describe('co-located TS', () => {
    let cwd = '';
    let tmpDir = '';
    let addonOnlyTS: AddonFixtureHelper;

    beforeEach(async () => {
      tmpDir = await createTmp();

      console.debug(`Debug test repo at ${tmpDir}`);

      let { name } = await createAddon({
        args: [`--pnpm=true`, '--addon-only', '--typescript'],
        options: { cwd: tmpDir },
      });

      cwd = path.join(tmpDir, name);

      addonOnlyTS = new AddonFixtureHelper({
        cwd,
        packageManager: 'pnpm',
        scenario: 'addon-only-ts',
      });

      await install({ cwd, packageManager, skipPrepare: true });
      await execa('pnpm', ['add', '--save-peer', '@glimmer/component'], { cwd });
    });

    afterEach(async () => {
      fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('generates correct files with no template', async () => {
      await addonOnlyTS.use('src/components/no-template.ts');
      await addonOnlyTS.build();
      await addonOnlyTS.matches('dist/components/no-template.js');
      await addonOnlyTS.matches('declarations/components/no-template.d.ts');
    });

    it('generates correct files with a template', async () => {
      await addonOnlyTS.use('src/components/co-located.ts');
      await addonOnlyTS.use('src/components/co-located.hbs');
      await addonOnlyTS.build();
      await addonOnlyTS.matches('dist/components/co-located.js');
      await addonOnlyTS.matches('declarations/components/co-located.d.ts');
    });
  });
});
