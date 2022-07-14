import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { execa } from 'execa';

export async function createTmp() {
  let prefix = 'v2-addon-blueprint--';
  let prefixPath = path.join(os.tmpdir(), prefix);

  let tmpDirPath = await fs.mkdtemp(prefixPath);

  return tmpDirPath;
}

/**
  * Abstraction for install, as the blueprint supports multiple package managers
  */
export async function install({ cwd }: { cwd: string }) {
  await execa('yarn', ['install', '--non-interactive'], { cwd });
  // in order to test prepare, we need to have ignore-scripts=false
  // this is a security risk so we'll manually invoke install + prepare
  await execa('yarn', ['prepare'], { cwd });
}

/**
  * Abstraction for install, as the blueprint supports multiple package managers
  */
export async function runScript({ cwd, script }: { cwd: string, script: string }) {
  let packageManager = `yarn`;
  let promise = execa(packageManager, [script], { cwd });

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

