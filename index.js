'use strict';

const path = require('path');
const assert = require('assert');
const os = require('os');
const fs = require('fs-extra');
const SilentError = require('silent-error');
const sortPackageJson = require('sort-package-json');
const normalizeEntityName = require('ember-cli-normalize-entity-name');
const { merge } = require('lodash');
const { lt } = require('semver');

const Blueprint = require('ember-cli/lib/models/blueprint');

let date = new Date();

const { addonInfoFromOptions, testAppInfoFromOptions, withoutAddonOptions } = require('./src/info');
const { scripts } = require('./src/root-package-json');
const pnpm = require('./src/pnpm');
const directoryForPackageName = require('./src/directory-for-package-name');

const description = 'The default blueprint for Embroider v2 addons.';

async function createTmp() {
  let prefix = 'v2-addon-blueprint--';
  let prefixPath = path.join(os.tmpdir(), prefix);

  let tmpDirPath = await fs.mkdtemp(prefixPath);

  return tmpDirPath;
}

const filesToCopyFromRootToAddonDuringBuild = ['README.md', 'LICENSE.md'];
const filesToCopyFromRootToAddonInExistingMonorepo = ['README.md', 'CONTRIBUTING.md'];
const filesToCopyFromRootToAddonInAddonOnlyMode = [
  'config/ember-cli-update.json',
  '.editorconfig',
  '.prettierignore',
  '.prettierrc.cjs',
  'CONTRIBUTING.md',
  'LICENSE.md',
  'README.md',
];

module.exports = {
  description,

  install(options) {
    if (!options.addonOnly) {
      if (fs.existsSync(path.join('..', 'package.json'))) {
        options.ui.writeInfoLine(
          "Existing monorepo detected! The blueprint will only create the addon and test-app folders, and omit any other files in the repo's root folder.",
        );

        this.isExistingMonorepo = true;
      }
    }

    return this._super.install.apply(this, arguments);
  },

  async afterInstall(options) {
    let tasks = [];

    let addonInfo = addonInfoFromOptions(options);
    let testAppInfo = testAppInfoFromOptions(options);

    if (!options.addonOnly) {
      tasks.push(this.createTestApp(options));

      /**
       * Setup root package.json scripts based on the packager
       */
      tasks.push(
        (async () => {
          let packageJson = path.join(options.target, 'package.json');
          let json = await fs.readJSON(packageJson);

          json.scripts = scripts(options);

          if (options.packageManager === 'pnpm' || options.pnpm) {
            delete json.workspaces;

            json.pnpm = {
              // TODO: update the blueprint's output to ESLint 8
              overrides: {
                '@types/eslint': '^7.0.0',
              },
            };
          }

          await fs.writeFile(packageJson, JSON.stringify(json, null, 2));
        })(),
      );

      if (isPnpm(options)) {
        tasks.push(pnpm.createWorkspacesFile(options.target, addonInfo, testAppInfo));
      }
    }

    await Promise.all(tasks);

    if (this.isExistingMonorepo && !options.addonOnly) {
      await this.moveFilesForExistingMonorepo(options);

      this.ui.writeWarnLine(
        `Make sure your workspaces are configured correctly to cover the newly created ${addonInfo.location} and ${testAppInfo.location} packages!`,
      );
    }

    await this.sortAddonPackageJson(addonInfo);
  },

  async sortAddonPackageJson(addonInfo) {
    let addonPackageJsonPath = path.join(addonInfo.location, 'package.json');
    let addonPackageJson = await fs.readJSON(addonPackageJsonPath);

    await fs.writeJSON(addonPackageJsonPath, sortPackageJson(addonPackageJson), { spaces: 2 });
  },

  // EmberCLI will always create a <addon-name> root folder for us, which makes no sense in an existing repo
  // Until we have a better solution for this use case upstream, we are fixing this here by moving the generated
  // files outside of this folder and deleting it
  async moveFilesForExistingMonorepo(options) {
    assert(
      !options.addonOnly,
      `When in --addon-only mode, we don't need to move files within an existing monorepo. ` +
        `If you see this error, please open an issue at: https://github.com/embroider-build/addon-blueprint/issues`,
    );

    let addonInfo = addonInfoFromOptions(options);
    let testAppInfo = testAppInfoFromOptions(options);

    let tmpDir = await createTmp();
    let tmpAddonDir = path.join(tmpDir, 'addon');
    let tmpTestAppDir = path.join(tmpDir, 'test-app');
    let originalAddonDir = path.resolve(addonInfo.location);
    let originalTestAppDir = path.resolve(testAppInfo.location);
    let finalAddonDir = path.resolve('..', addonInfo.location);
    let finalTestAppDir = path.resolve('..', testAppInfo.location);
    let extraneousDir = process.cwd();

    await fs.move(originalAddonDir, tmpAddonDir);
    await fs.move(originalTestAppDir, tmpTestAppDir);

    for (let fileToCopy of filesToCopyFromRootToAddonInExistingMonorepo) {
      await fs.move(fileToCopy, path.join(tmpAddonDir, fileToCopy));
    }

    process.chdir('..');
    await fs.remove(extraneousDir);

    await fs.move(tmpAddonDir, finalAddonDir);
    await fs.move(tmpTestAppDir, finalTestAppDir);
  },

  async createTestApp(options) {
    assert(
      !options.addonOnly,
      `When in --addon-only mode, we don't create a test-app. ` +
        `If you see this error, please open an issue at: https://github.com/embroider-build/addon-blueprint/issues`,
    );

    const appBlueprint = Blueprint.lookup('app');

    if (!appBlueprint) {
      throw new SilentError('Cannot find app blueprint for generating test-app!');
    }

    let testAppInfo = testAppInfoFromOptions(options);
    let testAppPath = path.join(options.target, testAppInfo.location);

    const appOptions = {
      ...withoutAddonOptions(options),
      target: testAppPath,
      skipNpm: true,
      skipGit: true,
      entity: { name: testAppInfo.name.raw },
      name: testAppInfo.name.raw,
      rawName: testAppInfo.name.raw,
      welcome: false,
    };

    await appBlueprint.install(appOptions);

    await Promise.all([
      this.updateTestAppPackageJson(path.join(testAppPath, 'package.json'), isPnpm(options)),
      this.overrideTestAppFiles(testAppPath, path.join(options.target, 'test-app-overrides')),
    ]);

    if (options.typescript) {
      const needsVersion = '4.9.0-beta.0';
      const recommendedVersion = '5.2.0-beta.0';
      const hasVersion = this.project.emberCLIVersion();

      if (lt(hasVersion, needsVersion)) {
        this.ui.writeWarnLine(
          `Your version ${hasVersion} of Ember CLI does not support the --typescript flag yet. Please run \`ember install ember-cli-typescript\` in the ${testAppInfo.location} folder manually!`,
        );
      } else if (lt(hasVersion, recommendedVersion)) {
        this.ui.writeWarnLine(
          `We recommend using Ember CLI >= ${recommendedVersion} for the best blueprint support when using TypeScript!`,
        );
      }
    }
  },

  async updateTestAppPackageJson(packageJsonPath, useWorkspaceProtocol) {
    const pkg = await fs.readJSON(packageJsonPath);
    const additions = require('./additional-test-app-package.json');

    merge(pkg, additions);

    pkg.description = `Test app for ${this.locals(this.options).addonName} addon`;

    // we must explicitly add our own v2 addon here, the implicit magic of the legacy dummy app does not work
    if (useWorkspaceProtocol) {
      // https://pnpm.io/workspaces#workspace-protocol-workspace
      // For an app, `*` is fine, but if we were wiring this up to multiple packages, we'd want `^`
      pkg.devDependencies[this.locals(this.options).addonName] = 'workspace:*';
    } else {
      pkg.devDependencies[this.locals(this.options).addonName] = '^0.0.0';
    }

    return fs.writeFile(packageJsonPath, JSON.stringify(sortPackageJson(pkg), undefined, 2));
  },

  async overrideTestAppFiles(testAppPath, overridesPath) {
    // we cannot us fs.move, as it will replace the directory, removing the other files of the app blueprint
    // but fs.copy works as we need it. Just have to remove the overrides directory afterwards.
    await fs.copy(overridesPath, testAppPath, {
      overwrite: true,
    });
    await fs.remove(overridesPath);
  },

  fileMapTokens(options) {
    let { addonInfo, testAppInfo, ext } = options.locals;

    return {
      __addonLocation__: () => addonInfo.location,
      __testAppLocation__: () => testAppInfo.location,
      __ext__: () => ext,
    };
  },

  mapFile(file, locals) {
    // EmberCLI has builtin support for converting gitignore to .gitignore: https://github.com/ember-cli/ember-cli/blob/24ef75b2e28cadee4a69472c6ae9c0e4845d512e/lib/models/blueprint.js#L1633
    // But this only works at the root folder, for the addon subfolder we have to do this ourselves here
    file = file.replace(/\/gitignore/, '/.gitignore');

    return this._super.mapFile.call(this, file, locals);
  },

  locals(options) {
    let addonInfo = addonInfoFromOptions(options);
    let testAppInfo = testAppInfoFromOptions(options);
    let pathFromAddonToRoot = addonInfo.location
      .split('/')
      .map(() => '..')
      .join('/');

    if (isYarn(options)) {
      throw new Error(
        `Please do not generate this project with --yarn. Omit '--yarn' when generating this blueprint'`,
      );
    }

    return {
      rootDirectory: directoryForPackageName(addonInfo.name.raw),
      addonInfo,
      testAppInfo,
      addonName: addonInfo.name.dashed,
      addonNamespace: addonInfo.name.classified,
      blueprintVersion: require('./package.json').version,
      year: date.getFullYear(),
      packageManager: options.packageManager,
      yarn: false,
      pnpm: isPnpm(options),
      npm: isNpm(options),
      typescript: options.typescript,
      ext: options.typescript ? 'ts' : 'js',
      blueprint: 'addon',
      blueprintOptions: buildBlueprintOptions({
        [`--addon-location=${options.addonLocation}`]: options.addonLocation,
        [`--ci-provider=${options.ciProvider}`]: options.ciProvider,
        '--pnpm': isPnpm(options),
        '--npm': isNpm(options),
        [`--test-app-location=${options.testAppLocation}`]: options.testAppLocation,
        [`--test-app-name=${options.testAppName}`]: options.testAppName,
        '--typescript': options.typescript,
      }),
      ciProvider: options.ciProvider,
      pathFromAddonToRoot,
      filesToCopyFromRootToAddon: filesToCopyFromRootToAddonDuringBuild,
      isExistingMonorepo: this.isExistingMonorepo,
    };
  },

  files(options) {
    let files = this._super.files.apply(this, arguments);

    if (options.addonOnly) {
      files = files.filter(
        (filename) =>
          filename.includes('__addonLocation__') ||
          filesToCopyFromRootToAddonInAddonOnlyMode.includes(filename),
      );
    } else {
      // filter out the addon-specific npmrc, as it
      // is only applicable during --addon-only
      files = files.filter((filename) => !filename.includes('__addonLocation__/.npmrc'));
    }

    if (!options.typescript) {
      let ignoredFiles = ['__addonLocation__/tsconfig.json'];

      files = files.filter(
        (filename) => !filename.match(/.*\.ts$/) && !ignoredFiles.includes(filename),
      );
    }

    if (this.isExistingMonorepo) {
      // The .gitignore is used for ignoring files that are moved to the addon from the root folder at build time
      // But this setup does not apply for an existing monorepo (all root files are ignored), so we don't need the .gitignore
      files = files.filter((filename) => filename !== '__addonLocation__/gitignore');
      // In an existing monorepo, we typically have a single .npmrc for the whole repo.
      // We don't want to generate an .npmrc for those situations.
      files = files.filter((filename) => !filename.endsWith('.npmrc'));
    }

    if (!isYarn(options)) {
      let ignoredFiles = ['.yarnrc.yml'];

      files = files.filter((filename) => !ignoredFiles.includes(filename));
    }

    return files;
  },

  normalizeEntityName(entityName) {
    entityName = normalizeEntityName(entityName);

    if (this.project.isEmberCLIProject() && !this.project.isEmberCLIAddon()) {
      throw new SilentError(
        'Generating an addon in an existing ember-cli project is not supported.',
      );
    }

    return entityName;
  },

  /**
   * @override
   *
   * This modification of buildFileInfo allows our differing
   * input files to output to a single file, depending on the options.
   * For example:
   *
   *   for javascript,
   *     _ts_eslint.config.mjs is deleted
   *     _js_eslint.config.mjs is renamed to eslint.config.mjs
   *
   *   for typescript,
   *     _js_eslint.config.mjs is deleted
   *     _ts_eslint.config.mjs is renamed to eslint.config.mjs
   */
  buildFileInfo(intoDir, templateVariables, file, options) {
    let fileInfo = this._super.buildFileInfo.apply(this, arguments);

    if (file.includes('_js_')) {
      if (options.typescript) {
        return null;
      }

      fileInfo.outputBasePath = fileInfo.outputPath.replace('_js_', '');
      fileInfo.outputPath = fileInfo.outputPath.replace('_js_', '');
      fileInfo.displayPath = fileInfo.outputPath.replace('_js_', '');

      return fileInfo;
    }

    if (file.includes('_ts_')) {
      if (!options.typescript) {
        return null;
      }

      fileInfo.outputBasePath = fileInfo.outputPath.replace('_ts_', '');
      fileInfo.outputPath = fileInfo.outputPath.replace('_ts_', '');
      fileInfo.displayPath = fileInfo.outputPath.replace('_ts_', '');

      return fileInfo;
    }

    return fileInfo;
  },
};

function buildBlueprintOptions(blueprintOptions) {
  let blueprintOptionsFiltered = Object.keys(blueprintOptions).filter((option) => {
    return Boolean(blueprintOptions[option]);
  });

  if (blueprintOptionsFiltered.length > 0) {
    return (
      `\n            ` +
      blueprintOptionsFiltered.map((option) => `"${option}"`).join(',\n            ') +
      `\n          `
    );
  }

  return '';
}

// These methods exist because in ember-cli 5.4, package manager handling
// had changed to solely use the packageManager key, however
// prior to ember-cli 5.4, pnpm, yarn, and npm, had their own booleans on
// the options object.
function isPnpm(options) {
  return options.packageManager === 'pnpm' || options.pnpm;
}

function isYarn(options) {
  return options.packageManager === 'yarn' || options.yarn;
}

function isNpm(options) {
  return options.packageManager === 'npm' || options.npm;
}
