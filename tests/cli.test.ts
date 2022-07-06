
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execa } from 'execa';

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createTmp, dirContents, install, packageJsonAt, runScript } from './utils.js';
import { assertGeneratedCorrectly } from './assertions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const blueprintPath = path.join(__dirname, '..');

describe('ember addon <the addon> -b <this blueprint>', () => {

  async function createAddon({ name = 'my-addon', args = [], options = {}}) {
    let result = await execa('ember', ['addon', name, '-b', blueprintPath, ...args], options);

    return { result, name };
  }

  describe('defaults', () => {
    let cwd = '';
    let tmpDir = '';
    let distDir = '';

    beforeAll(async () => {
      tmpDir = await createTmp();

      let { name } = await createAddon({ options: { cwd: tmpDir }});

      cwd = path.join(tmpDir, name);
      distDir = path.join(cwd, name, 'dist');

      await install({ cwd });
    });

    afterAll(async () => {
      fs.rm(tmpDir, { recursive: true });
    });

    it('"prepare" built the addon', async () => {
      let contents = await dirContents(distDir);

      expect(contents).to.deep.equal(['index.js']);
    });

    it('was generated correctly', async () => {
      assertGeneratedCorrectly({ projectRoot: cwd });
    });

    it('builds the addon', async () => {
      let { exitCode } = await runScript({ cwd, script: 'build' });

      expect(exitCode).toEqual(0);
    });

    it('runs tests', async () => {
      let { exitCode } = await runScript({ cwd, script: 'test' });

      expect(exitCode).toEqual(0);
    });

    it('lints all pass', async () => {
      let { exitCode } = await runScript({ cwd, script: 'lint' });

      expect(exitCode).toEqual(0);
    });
  });

  describe('--addon-location', () => {
    let cwd = '';
    let tmpDir = '';
    let location = '';

    beforeAll(async () => {
      tmpDir = await createTmp();
      location = 'packages/my-custom-location';

      let { name } = await createAddon({
        args: [`--addon-location=${location}`],
        options: { cwd: tmpDir }
      });

      cwd = path.join(tmpDir, name);

      await install({ cwd });
    });

    afterAll(async () => {
      fs.rm(tmpDir, { recursive: true });
    });

    it('was generated correctly', async () => {
      assertGeneratedCorrectly({ projectRoot: cwd, addonLocation: location });
    });

    it('runs tests', async () => {
      let { exitCode } = await runScript({ cwd, script: 'test' });

      expect(exitCode).toEqual(0);
    });

    it('lints all pass', async () => {
      let { exitCode } = await runScript({ cwd, script: 'lint' });

      expect(exitCode).toEqual(0);
    });
  });

  describe('--test-app-location', () => {
    let cwd = '';
    let tmpDir = '';
    let location = '';

    beforeAll(async () => {
      tmpDir = await createTmp();
      location = 'packages/my-custom-location';

      let { name } = await createAddon({
        args: [`--test-app-location=${location}`],
        options: { cwd: tmpDir }
      });

      cwd = path.join(tmpDir, name);

      await install({ cwd });
    });

    afterAll(async () => {
      fs.rm(tmpDir, { recursive: true });
    });

    it('was generated correctly', async () => {
      assertGeneratedCorrectly({ projectRoot: cwd, testAppLocation: location });
    });

    it('runs tests', async () => {
      let { exitCode } = await runScript({ cwd, script: 'test' });

      expect(exitCode).toEqual(0);
    });

    it('lints all pass', async () => {
      let { exitCode } = await runScript({ cwd, script: 'lint' });

      expect(exitCode).toEqual(0);
    });
  });
});
