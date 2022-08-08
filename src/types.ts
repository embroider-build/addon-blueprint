export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export interface Options {
  packageManager?: PackageManager;
  yarn?: boolean;
  pnpm?: boolean;
}

export interface AddonInfo {
  /**
   * The name of the addon in package.json#name
   * This is also the name of the addon as it would appear on NPM
   */
  packageName: string;
  name: {
    /**
     * The dashed-case version of what was passed to the generator.
     * This is also the `packageName`
     */
    dashed: string;
    /**
     * Classified version of the addon name that was passed to the generator.
     */
    classified: string;
    /**
     * The addon name that was passed to the generator.
     */
    raw: string;
  };
  entity: string;
  location: string;
}

export interface TestAppInfo {
  packageName: string;
  name: {
    dashed: string;
    raw: string;
  };
  location: string;
}

export interface Locals {
  name: string;
  addonInfo: AddonInfo;
  testAppInfo: TestAppInfo;
}
