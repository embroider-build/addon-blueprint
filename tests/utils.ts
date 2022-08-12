import { execa } from 'execa';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function createTmp() {
  let prefix = 'v2-addon-blueprint--';
  let prefixPath = path.join(os.tmpdir(), prefix);

  let tmpDirPath = await fs.mkdtemp(prefixPath);

  return tmpDirPath;
}

/**
 * Abstraction for install, as the blueprint supports multiple package managers
 */
export async function install({ cwd, packageManager }: { cwd: string; packageManager: string }) {
  if (packageManager === 'yarn') {
    await execa('yarn', ['install', '--non-interactive'], { cwd });
  } else {
    if (packageManager === 'pnpm') {
      /**
       * This is needed because the app, when generated with pnpm,
       * does not have correct deps - a peer is missing, @babel/core.
       * and because the app blueprint is the second blueprint we invoke
       * in this blueprint,we can't add dependencies to it.
       */
      await fs.writeFile(path.join(cwd, '.npmrc'), 'auto-install-peers=true');
      await execa('pnpm', ['install'], { cwd });
    } else {
      await execa(packageManager, ['install'], { cwd });
    }
  }

  // in order to test prepare, we need to have ignore-scripts=false
  // which is a security risk so we'll manually invoke install + prepare
  await execa(packageManager, ['run', 'prepare'], { cwd });
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
