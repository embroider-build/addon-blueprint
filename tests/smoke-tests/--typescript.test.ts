import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  assertGeneratedCorrectly,
  createAddon,
  createTmp,
  dirContents,
  install,
  runScript,
  SUPPORTED_PACKAGE_MANAGERS,
} from '../helpers.js';

for (let packageManager of SUPPORTED_PACKAGE_MANAGERS) {
  describe(`--typescript with ${packageManager}`, () => {
    let cwd = '';
    let tmpDir = '';
    let distDir = '';
    let declarationsDir = '';

    beforeAll(async () => {
      tmpDir = await createTmp();

      let { name } = await createAddon({
        args: ['--typescript', `--${packageManager}=true`, '--skip-npm'],
        options: { cwd: tmpDir },
      });

      cwd = path.join(tmpDir, name);
      distDir = path.join(cwd, name, 'dist');
      declarationsDir = path.join(cwd, name, 'declarations');

      await install({ cwd, packageManager, skipPrepare: true });
    });

    afterAll(async () => {
      await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('was generated correctly', async () => {
      await runScript({ cwd, script: 'build', packageManager: 'pnpm' });

      assertGeneratedCorrectly({ projectRoot: cwd });
    });

    it('builds the addon', async () => {
      let { exitCode } = await runScript({ cwd, script: 'build', packageManager: 'pnpm' });

      expect(exitCode).toEqual(0);

      let distContents = await dirContents(distDir);
      let declarationsContents = await dirContents(declarationsDir);

      expect(distContents).to.deep.equal([
        'index.js',
        'index.js.map',
        'template-registry.js',
        'template-registry.js.map',
      ]);

      expect(declarationsContents).to.deep.equal([
        'index.d.ts',
        'index.d.ts.map',
        'template-registry.d.ts',
        'template-registry.d.ts.map',
      ]);
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
}
