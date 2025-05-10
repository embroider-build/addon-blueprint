import path from 'node:path';

import { execa } from 'execa';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  AddonHelper,
  assertGeneratedCorrectly,
  dirContents,
  SUPPORTED_PACKAGE_MANAGERS,
} from '../helpers.js';

for (let packageManager of SUPPORTED_PACKAGE_MANAGERS) {
  describe(`--typescript with ${packageManager}`, () => {
    let distDir = '';
    let declarationsDir = '';
    let helper = new AddonHelper({
      packageManager,
      args: ['--typescript'],
      scenario: 'typescript',
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

    it('was generated correctly', async () => {
      await helper.build();

      assertGeneratedCorrectly({
        projectRoot: helper.projectRoot,
        packageManager,
        typeScript: true,
      });
    });

    // Tests are additive, so when running them in order, we want to check linting
    // before we add files from fixtures
    it('lints all pass', async () => {
      let { exitCode } = await helper.run('lint');

      expect(exitCode).toEqual(0);
    });

    it('build and test', async () => {
      // Copy over fixtures
      await helper.fixtures.use('./my-addon/src');
      await helper.fixtures.use('./test-app/tests');
      // Sync fixture with project's lint / formatting configuration
      // (controlled by ember-cli)
      //
      // Ensure that we have no lint errors.
      // It's important to keep this along with the tests,
      // so that we can have confidence that the lints aren't destructively changing
      // the files in a way that would break consumers
      await helper.run('lint:fix');

      /**
       * In order to use build with components, we need to add more dependencies
       * We may want to consider making these default
       */
      await execa('pnpm', ['add', '--save-peer', '@glimmer/component'], {
        cwd: helper.addonFolder,
      });

      let buildResult = await helper.build();

      expect(buildResult.exitCode).toEqual(0);

      let distContents = await dirContents(distDir);
      let declarationsContents = await dirContents(declarationsDir);

      expect(distContents).toMatchInlineSnapshot(`
        [
          "_app_",
          "components",
          "index.js",
          "index.js.map",
          "services",
          "template-registry.js",
          "template-registry.js.map",
        ]
      `);

      expect(declarationsContents).toMatchInlineSnapshot(`
        [
          "components",
          "index.d.ts",
          "index.d.ts.map",
          "services",
          "template-registry.d.ts",
          "template-registry.d.ts.map",
        ]
      `);

      let testResult = await helper.run('test');

      expect(testResult.exitCode).toEqual(0);
      expect(testResult.stdout).to.include('# tests 5');
      expect(testResult.stdout).to.include('# pass  5');
      expect(testResult.stdout).to.include('# fail  0');
    });
  });
}
