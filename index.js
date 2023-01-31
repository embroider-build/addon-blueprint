'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const SilentError = require('silent-error');
const sortPackageJson = require('sort-package-json');
const normalizeEntityName = require('ember-cli-normalize-entity-name');
const execa = require('execa');
const { merge } = require('lodash');
const { lt } = require('semver');

let date = new Date();

const { addonInfoFromOptions, testAppInfoFromOptions, withoutAddonOptions } = require('./src/info');
const { scripts } = require('./src/root-package-json');
const pnpm = require('./src/pnpm');

const description = 'The default blueprint for Embroider v2 addons.';

async function createTmp() {
  let prefix = 'v2-addon-blueprint--';
  let prefixPath = path.join(os.tmpdir(), prefix);

  let tmpDirPath = await fs.mkdtemp(prefixPath);

  return tmpDirPath;
}

const filesToCopyFromRootToAddonDuringBuild = ['README.md', 'LICENSE.md'];
const filesToCopyFromRootToAddonInExistingMonorepo = ['README.md', 'CONTRIBUTING.md'];

module.exports = {
  description,

  install(options) {
    if (fs.existsSync(path.join('..', 'package.json'))) {
      options.ui.writeInfoLine(
        "Existing monorepo detected! The blueprint will only create the addon and test-app folders, and omit any other files in the repo's root folder."
      );

      this.isExistingMonorepo = true;
    }

    return this._super.install.apply(this, arguments);
  },

  async afterInstall(options) {
    let tasks = [this.createTestApp(options)];
    let addonInfo = addonInfoFromOptions(options);
    let testAppInfo = testAppInfoFromOptions(options);

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
      })()
    );

    if (options.pnpm) {
      tasks.push(pnpm.createWorkspacesFile(options.target, addonInfo, testAppInfo));
      tasks.push(pnpm.handleImperfections(addonInfo, testAppInfo));
    }

    if (options.releaseIt) {
      tasks.push(this.setupReleaseIt(options.target));
    }

    await Promise.all(tasks);

    if (this.isExistingMonorepo) {
      await this.moveFilesForExistingMonorepo(options);

      this.ui.writeWarnLine(
        `Make sure your workspaces are configured correctly to cover the newly created ${addonInfo.location} and ${testAppInfo.location} packages!`
      );
    }
  },

  // EmberCLI will always create a <addon-name> root folder for us, which makes no sense in an existing repo
  // Until we have a better solution for this use case upstream, we are fixing this here by moving the generated
  // files outside of this folder and deleting it
  async moveFilesForExistingMonorepo(options) {
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
    const appBlueprint = this.lookupBlueprint('app');

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
      ciProvider: 'travis', // we will delete this anyway below, as the CI config goes into the root folder
      welcome: false,
    };

    await appBlueprint.install(appOptions);

    await Promise.all([
      this.updateTestAppPackageJson(path.join(testAppPath, 'package.json')),
      this.overrideTestAppFiles(testAppPath, path.join(options.target, 'test-app-overrides')),
      fs.unlink(path.join(testAppPath, '.travis.yml')),
    ]);

    if (options.typescript) {
      const needsVersion = '4.9.0-beta.0';
      const hasVersion = this.project.emberCLIVersion();

      if (lt(hasVersion, needsVersion)) {
        this.ui.writeWarnLine(
          `Your version ${hasVersion} of Ember CLI does not support the --typescript flag yet. Please run \`ember install ember-cli-typescript\` in the ${testAppInfo.location} folder manually!`
        );
      }
    }
  },

  async updateTestAppPackageJson(packageJsonPath) {
    const pkg = await fs.readJSON(packageJsonPath);
    const additions = require('./additional-test-app-package.json');

    merge(pkg, additions);

    pkg.description = `Test app for ${this.locals(this.options).addonName} addon`;

    // we must explicitly add our own v2 addon here, the implicit magic of the legacy dummy app does not work
    pkg.devDependencies[this.locals(this.options).addonName] = '^0.0.0';

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

  async setupReleaseIt(rootPath) {
    await execa('create-rwjblue-release-it-setup', ['--no-install'], {
      cwd: rootPath,
      preferLocal: true,
      localDir: __dirname,
    });
  },

  fileMapTokens(options) {
    let { addonInfo, testAppInfo, ext, typescript } = options.locals;

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

    let hasOptions = options.welcome || options.yarn || options.ciProvider;

    let blueprintOptions = '';

    if (hasOptions) {
      let indent = `\n            `;
      let outdent = `\n          `;

      blueprintOptions =
        indent +
        [
          options.welcome && '"--welcome"',
          options.yarn && '"--yarn"',
          options.pnpm && '"--pnpm"',
          options.ciProvider && `"--ci-provider=${options.ciProvider}"`,
          options.addonLocation && `"--addon-location=${options.addonLocation}"`,
          options.testAppLocation && `"--test-app-location=${options.testAppLocation}"`,
          options.testAppName && `"--test-app-name=${options.testAppName}"`,
          options.releaseIt && `"--release-it"`,
          options.typescript && `"--typescript"`,
        ]
          .filter(Boolean)
          .join(',\n            ') +
        outdent;
    }

    let pathFromAddonToRoot = addonInfo.location
      .split('/')
      .map(() => '..')
      .join('/');

    return {
      addonInfo,
      testAppInfo,
      addonName: addonInfo.name.dashed,
      addonNamespace: addonInfo.name.classified,
      blueprintVersion: require('./package.json').version,
      year: date.getFullYear(),
      yarn: options.yarn,
      pnpm: options.pnpm,
      npm: options.npm,
      welcome: options.welcome,
      typescript: options.typescript,
      ext: options.typescript ? 'ts' : 'js',
      blueprint: 'addon',
      blueprintOptions,
      ciProvider: options.ciProvider,
      pathFromAddonToRoot,
      filesToCopyFromRootToAddon: filesToCopyFromRootToAddonDuringBuild,
      isExistingMonorepo: this.isExistingMonorepo,
    };
  },

  files(options) {
    let files = this._super.files.apply(this, arguments);

    if (options.typescript) {
      return files;
    } else {
      let ignoredFiles = ['__addonLocation__/tsconfig.json'];

      return files.filter(
        (filename) => !filename.match(/.*\.ts$/) && !ignoredFiles.includes(filename)
      );
    }
  },

  normalizeEntityName(entityName) {
    entityName = normalizeEntityName(entityName);

    if (this.project.isEmberCLIProject() && !this.project.isEmberCLIAddon()) {
      throw new SilentError(
        'Generating an addon in an existing ember-cli project is not supported.'
      );
    }

    return entityName;
  },
};
