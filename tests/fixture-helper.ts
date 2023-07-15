import { matchesFixture } from './assertions.js';
import { copyFixture, runScript } from './utils.js';

export class AddonFixtureHelper {
  #cwd: string;
  #scenario: string;
  #packageManager: 'npm' | 'pnpm' | 'yarn';

  constructor(options: {
    cwd: string;
    scenario?: string;
    packageManager: 'pnpm' | 'npm' | 'yarn';
  }) {
    this.#cwd = options.cwd;
    this.#scenario = options.scenario || 'default';
    this.#packageManager = options.packageManager;
  }

  async use(file: string) {
    await copyFixture(file, { scenario: this.#scenario, cwd: this.#cwd });
  }

  async build() {
    await runScript({ cwd: this.#cwd, script: 'build', packageManager: this.#packageManager });
  }

  async matches(outputFile: string) {
    await matchesFixture(outputFile, { scenario: this.#scenario, cwd: this.#cwd });
  }
}
