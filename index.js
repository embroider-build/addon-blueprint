'use strict';

const fs = require('fs-extra');
const path = require('path');
// const walkSync = require('walk-sync');
// const chalk = require('chalk');
const stringUtil = require('ember-cli-string-utils');
// const uniq = require('ember-cli-lodash-subset').uniq;
const SilentError = require('silent-error');
const sortPackageJson = require('sort-package-json');

let date = new Date();

const normalizeEntityName = require('ember-cli-normalize-entity-name');

const TEST_APP_NAME = 'test-app';

const description = 'The default blueprint for Embroider v2 addons.';
module.exports = {
  description,

  async afterInstall(options) {
    const appBlueprint = this.lookupBlueprint('app');
    if (!appBlueprint) {
      throw new SilentError(
        'Cannot find app blueprint for generating test-app!'
      );
    }
    const testAppPath = path.join(options.target, 'packages', TEST_APP_NAME);
    const appOptions = {
      ...options,
      target: testAppPath,
      skipNpm: true,
      skipGit: true,
      entity: { name: TEST_APP_NAME },
      name: TEST_APP_NAME,
      rawName: TEST_APP_NAME,
      ciProvider: 'travis', // we will delete this anyway below, as the CI config goes into the root folder
      welcome: false,
    };

    await appBlueprint.install(appOptions);
    await Promise.all([
      this.updateTestAppPackageJson(path.join(testAppPath, 'package.json')),
      this.overrideTestAppFiles(
        testAppPath,
        path.join(options.target, 'test-app-overrides')
      ),
      fs.unlink(path.join(testAppPath, '.travis.yml')),
    ]);
  },

  async updateTestAppPackageJson(packageJsonPath) {
    const pkg = require(packageJsonPath);

    pkg.devDependencies[this.locals(this.options).addonName] = '^0.0.0';
    pkg.devDependencies['@embroider/test-setup'] = '^1.0.0';
    pkg.devDependencies['ember-source-channel-url'] = '^3.0.0';
    pkg.devDependencies['ember-try'] = '^2.0.0';

    pkg.scripts['test:watch'] = 'ember test --server';
    pkg.scripts['test'] = 'npm-run-all lint \\"test:!(watch)\\"';

    pkg.private = true;

    return fs.writeFile(
      packageJsonPath,
      JSON.stringify(sortPackageJson(pkg), undefined, 2)
    );
  },

  async overrideTestAppFiles(testAppPath, overridesPath) {
    // we cannot us fs.move, as it will replace the directory, removing the other files of the app blueprint
    // but fs.copy works as we need it. Just have to remove the overrides directory afterwards.
    await fs.copy(overridesPath, testAppPath, {
      overwrite: true,
    });
    await fs.remove(overridesPath);
  },

  locals(options) {
    let entity = { name: 'dummy' };
    let rawName = entity.name;
    let name = stringUtil.dasherize(rawName);
    let namespace = stringUtil.classify(rawName);

    let addonEntity = options.entity;
    let addonRawName = addonEntity.name;
    let addonName = stringUtil.dasherize(addonRawName);
    let addonNamespace = stringUtil.classify(addonRawName);

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
          options.ciProvider && `"--ci-provider=${options.ciProvider}"`,
        ]
          .filter(Boolean)
          .join(',\n            ') +
        outdent;
    }

    return {
      name,
      modulePrefix: name,
      namespace,
      addonName,
      addonNamespace,
      // emberCLIVersion: require('../../package').version,
      year: date.getFullYear(),
      yarn: options.yarn,
      welcome: options.welcome,
      blueprint: 'addon',
      blueprintOptions,
      ciProvider: options.ciProvider,
    };
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
