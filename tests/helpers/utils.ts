import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execa, type Options } from 'execa';

const DEBUG = process.env.DEBUG === 'true';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// repo-root
const blueprintPath = path.join(__dirname, '../..');

export const SUPPORTED_PACKAGE_MANAGERS = ['npm', 'yarn', 'pnpm'] as const;

export async function createTmp() {
  let prefix = 'v2-addon-blueprint--';
  let prefixPath = path.join(os.tmpdir(), prefix);

  let tmpDirPath = await fs.mkdtemp(prefixPath);

  return tmpDirPath;
}

const ROLLUP_HASH = /[a-f0-9]{8}/

/**
* Filters out rollup-hashes from a list of files.
*
* When there are private files, rollup will add some
* hash to the emitted file path, 
* such as:
*   template-only-ab2e7769.js.map
*
* These hashes have predictable length, so we can have
* a fairly narrow matcher to remove them.
*/
export function withoutHashes(names: string[]) {
  return names.filter(name => !ROLLUP_HASH.test(name));
}

/**
* Filters out a list of files, keeping only the rollup-emitted hashed files
*
* When there are private files, rollup will add some
* hash to the emitted file path, 
* such as:
*   template-only-ab2e7769.js.map
*
* These hashes have predictable length, so we can have
* a fairly narrow matcher to remove them.
* This a
*/
export function hashesOnly(names: string[]) {
  return names.filter(name => ROLLUP_HASH.test(name));
}

export function splitHashedFiles(names: string[]) {
  return {
    hashed: hashesOnly(names),
    unhashed: withoutHashes(names),
  };
}

/**
 * Abstraction for install, as the blueprint supports multiple package managers
 */
export async function install({
  cwd,
  packageManager,
  skipPrepare,
}: {
  cwd: string;
  packageManager: string;
  skipPrepare?: boolean;
}) {
  if (packageManager === 'yarn') {
    await execa('yarn', ['install', '--non-interactive'], { cwd });
  } else {
    let installOptions = [];

    if (packageManager === 'pnpm') {
      installOptions.push('--no-frozen-lockfile');
    }

    await execa(packageManager, ['install', '--ignore-scripts', ...installOptions], { cwd });
  }

  const pkg = await packageJsonAt(cwd);

  // in order to test prepare, we need to have ignore-scripts=false
  // which is a security risk so we'll manually invoke install + prepare
  if (pkg.scripts?.prepare && !skipPrepare) {
    await execa(packageManager, ['run', 'prepare'], { cwd });
  }
}

/**
 * Abstraction for install, as the blueprint supports multiple package managers
 */
export async function runScript({
  cwd,
  script,
  packageManager,
}: {
  cwd: string;
  script: string;
  packageManager: string;
}) {
  // all package managers allow a more verbose <packageManager> run <script> way of running scripts
  let promise = execa(packageManager, ['run', script], { cwd });

  try {
    await promise;

    return promise;
  } catch (e) {
    console.error(e);

    return promise;
  }
}

export async function dirContents(dirPath: string) {
  try {
    let files = await fs.readdir(dirPath);

    return files;
  } catch (e) {
    console.error('error', e);

    return [];
  }
}

export async function packageJsonAt(dirPath: string) {
  let buffer = await fs.readFile(path.join(dirPath, 'package.json'));
  let str = buffer.toString();

  return JSON.parse(str);
}

export async function createAddon({
  name = 'my-addon',
  args = [],
  options = {},
}: {
  name?: string;
  args?: string[];
  options?: Options;
}) {
  let emberCliArgs = ['addon', name, '-b', blueprintPath, '--skip-npm', '--skip-git', ...args];

  if (DEBUG) {
    console.debug(`Running ember-cli in ${options.cwd}`);
    console.debug(`\tember ${emberCliArgs.join(' ')}`);
  }

  let result = await execa('ember', emberCliArgs, {
    ...options,
    env: { ...options.env, EMBER_CLI_PNPM: 'true' },
    preferLocal: true,
  });

  return { result, name };
}
