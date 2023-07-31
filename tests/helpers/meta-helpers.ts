import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';

import { matchesFixture } from './assertions.js';
import { copyFixture } from './fixtures.js';
import { createAddon, createTmp, install, runScript } from './utils.js';

const DEBUG = process.env.DEBUG === 'true';

/**
 * Helps with common addon testing concerns.
 * tl;dr:
 *   it's a wrapper around ember addon -b (so we can pass our flags with less duplication)
 *   it lets us set compare against a fixture set / scenario
 *
 * To DEBUG the intermediate output (in tmp),
 * re-start your tests with `DEBUG=true`, and the tmpdir will be printed
 * as well as the `clean` function will not run so that if a test finishes,
 * you can still inspect the folder contents
 *
 */
export class AddonHelper {
  #projectRoot?: string;
  #tmpDir?: string;
  #scenario: string;
  #packageManager: 'npm' | 'pnpm' | 'yarn';
  #addonFolder?: string;
  #args: string[];
  #fixtures: AddonFixtureHelper | undefined;

  constructor(options: {
    args?: string[];
    scenario?: string;
    packageManager: 'pnpm' | 'npm' | 'yarn';
  }) {
    this.#args = options.args || [];
    this.#scenario = options.scenario || 'default';
    this.#packageManager = options.packageManager;
  }

  async setup() {
    this.#tmpDir = await createTmp();

    if (DEBUG) {
      console.debug(`Debug test repo at ${this.#tmpDir}`);
    }

    let args = [...this.#args];
    let needsPackageManagerSet =
      !args.includes(`--${this.#packageManager}`) &&
      !args.some((arg) => arg.startsWith('--packageManager')) &&
      !args.some((arg) => arg.startsWith('--npm')) &&
      !args.some((arg) => arg.startsWith('--yarn')) &&
      !args.some((arg) => arg.startsWith('--pnpm'));

    if (needsPackageManagerSet) {
      args.push(`--${this.#packageManager}`);
    }

    let { name } = await createAddon({
      args,
      options: { cwd: this.#tmpDir },
    });

    // this is the project root
    this.#projectRoot = path.join(this.#tmpDir, name);
    this.#addonFolder = path.join(this.#projectRoot, name);

    this.#fixtures = new AddonFixtureHelper({ cwd: this.#projectRoot, scenario: this.#scenario });
  }

  async run(scriptName: string) {
    return await runScript({
      cwd: this.projectRoot,
      script: scriptName,
      packageManager: this.#packageManager,
    });
  }

  async build() {
    return this.run('build');
  }

  async clean() {
    if (DEBUG) return;

    assert(
      this.#tmpDir,
      "Cannot clean without a tmpDir. Was the Addon Helper's `setup` method called to generate the addon?"
    );

    await fs.rm(this.#tmpDir, { recursive: true, force: true });
  }

  async installDeps(options?: { skipPrepare: boolean }) {
    let skipPrepare = options?.skipPrepare ?? true;

    await install({
      cwd: this.projectRoot,
      packageManager: this.#packageManager,
      skipPrepare,
    });
  }

  get projectRoot() {
    assert(this.#projectRoot, "Cannot get cwd. Was the Addon Helper's `setup` method called?");

    return this.#projectRoot;
  }

  get fixtures() {
    assert(this.#fixtures, 'Cannot get fixtures-helper. Was the Addon Helper `setup`?');

    return this.#fixtures;
  }

  get addonFolder() {
    assert(this.#addonFolder, 'Cannot get addon folder. Was the Addon Helper `setup`?');

    return this.#addonFolder;
  }
}

export class AddonFixtureHelper {
  #cwd: string;
  #scenario: string;

  constructor(options: { cwd: string; scenario?: string }) {
    this.#cwd = options.cwd;
    this.#scenario = options.scenario || 'default';
  }

  /**
   * Copies all files over from the fixture
   */
  async useAll() {
    await this.use('.');
  }

  /**
   * Copies some files over from the fixture
   */
  async use(file: string) {
    await copyFixture(file, { scenario: this.#scenario, cwd: this.#cwd });
  }

  /**
   * Throws an error if the specified outputFile does not
   * have matching contents in the fixture.
   */
  async matches(outputFile: string) {
    await matchesFixture(outputFile, { scenario: this.#scenario, cwd: this.#cwd });
  }
}
