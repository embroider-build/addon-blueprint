'use strict';

// copied from https://github.com/ember-cli/ember-cli/blob/1c2b61920576dfe83dc27e0e55a89fb8b1240676/lib/tasks/create-and-step-into-directory.js

const path = require('path');

/**
 * Derive a directory name from a package name.
 * Takes scoped packages into account.
 *
 * @method directoryForPackageName
 * @param {String} packageName
 * @return {String} Derived directory name.
 */
module.exports = function directoryForPackageName(packageName) {
  let isScoped = packageName[0] === '@' && packageName.includes('/');

  if (isScoped) {
    let slashIndex = packageName.indexOf('/');
    let scopeName = packageName.substring(1, slashIndex);
    let packageNameWithoutScope = packageName.substring(slashIndex + 1);
    let pathParts = process.cwd().split(path.sep);
    let parentDirectoryContainsScopeName = pathParts.includes(scopeName);

    if (parentDirectoryContainsScopeName) {
      return packageNameWithoutScope;
    } else {
      return `${scopeName}-${packageNameWithoutScope}`;
    }
  } else {
    return packageName;
  }
};
