import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fse from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fixturesPath = path.join(__dirname, '../fixtures');

/**
 * Returns the contents of a file from the "tests/fixtures" directory.
 * The "tests/fixtures" directory contains sub-directories, "scenarios".
 * This is we can have different sets of fixtures, depending on what we're testing.
 *
 * The default scenario is "default", and represents the the file contents when we provide
 * no arguments to the blueprint
 */
export async function readFixture(
  /**
   * Which file within in the fixture-set / scenario to read
   */
  file: string,
  options?: {
    /**
     * Which fixture set to use
     */
    scenario?: string;
  }
) {
  let scenario = options?.scenario ?? 'default';
  let fixtureFilePath = path.isAbsolute(file) ? file : path.join(fixturesPath, scenario, file);

  let exists = await fse.pathExists(fixtureFilePath);

  assert(
    exists,
    `Fixture file '${file}' does not exist. To make this work, place a new file '${file}' in the 'tests/fixtures/${scenario}' directory. Checked the absolute path: '${fixtureFilePath}'.`
  );

  let contents = await fs.readFile(fixtureFilePath);

  return contents.toString();
}

export async function copyFixture(
  /**
   * Which file within the fixture-set / scenario to copy
   */
  newFile: string,
  options?: {
    /**
     * Which fixture set to use
     */
    scenario?: string;
    /**
     * By default, the file used will be the same as the testFilePath, but
     * in the fixtures directory under the (maybe) specified scenario.
     * this can be overridden, if needed.
     * (like if you're testFilePath is deep with in an existing monorepo, and wouldn't
     *   inherently match our default-project structure used in the fixtures)
     */
    file?: string;
    /**
     * The working directory to use for the relative paths. Defaults to process.cwd() (node default)
     */
    cwd?: string;
  }
) {
  let scenario = options?.scenario ?? 'default';
  let fixtureFile = options?.file ?? newFile;

  if (options?.cwd) {
    newFile = path.join(options.cwd, newFile);
  }

  let fullFixturePath = path.join(fixturesPath, scenario, fixtureFile);
  let exists = await fse.pathExists(fullFixturePath);

  assert(
    exists,
    `Fixture path '${fixtureFile}' does not exist. To make this work, place a new file/folder '${fixtureFile}' in the 'tests/fixtures/${scenario}' directory. Checked the absolute path: '${fullFixturePath}'.`
  );

  if (await isDirectory(fullFixturePath)) {
    await fse.copy(fullFixturePath, newFile);

    return;
  }

  let fixtureContents = await readFixture(fixtureFile, { scenario });

  await fse.mkdir(path.dirname(newFile), { recursive: true });
  await fs.writeFile(newFile, fixtureContents);
}

async function isDirectory(maybePath: string) {
  try {
    const stats = await fs.stat(maybePath);

    return stats.isDirectory();
  } catch {
    return false;
  }
}
