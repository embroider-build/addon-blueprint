import debug from 'debug';
import { type Options, execa } from 'execa';
import fse from 'fs-extra';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const debugLog = debug('addon-blueprint:utils');

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
    try {
      let installOptions = [];

      if (packageManager === 'pnpm') {
        installOptions.push('--no-frozen-lockfile');
      }

      await execa(packageManager, ['install', '--ignore-scripts', ...installOptions], { cwd });
    } catch (e) {
      if (e instanceof Error) {
        // ignore the `@babel/core` peer issue.
        // this is dependent on ember-cli-babel doing a v8 release
        // where it declares `@babel/core` as a peer, and removes it from
        // dependencies
        let isPeerError = e.message.includes('Peer dependencies that should be installed:');
        let isExpectedPeer = e.message.includes('@babel/core@">=7.0.0 <8.0.0"');

        if (packageManager === 'pnpm' && isPeerError && isExpectedPeer) {
          console.info('An error occurred. Are there still upstream issues to resolve?');
          console.error(e);

          return;
        }
      }

      throw e;
    }
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
    const result = await promise;

    debugLog(`Finished running script ${script}`);
    debugLog(result.stdout);
    debugLog(result.stderr);

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

  debugLog(`Running ember-cli in ${options.cwd}`);
  debugLog(`\tember ${emberCliArgs.join(' ')}`);

  let result = await execa('ember', emberCliArgs, {
    ...options,
    env: { ...options.env, EMBER_CLI_PNPM: 'true' },
    preferLocal: true,
  });

  // Light work-around for an upstream `@babel/core` peer issue
  if (typeof options.cwd === 'string') {
    await fs.writeFile(
      fse.existsSync(path.join(options.cwd, name))
        ? path.join(options.cwd, name, '.npmrc')
        : path.join(options.cwd, '.npmrc'),
      'auto-install-peers=true'
    );
  }

  return { result, name };
}
