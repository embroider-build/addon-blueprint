// @ts-check;
const stringUtil = require('ember-cli-string-utils');

const ADDON_OPTIONS = ['addonLocation', 'testAppLocation', 'testAppName'];

/**
 * Custom info derived from CLI options for use within this blueprint.
 * Nothing in this object is expected from the blueprint system.
 *
 * @param {import('./types').Options} options
 * @return {import('./types').AddonInfo}
 */
function addonInfoFromOptions(options) {
  let addonEntity = options.entity;
  let addonRawName = addonEntity.name;
  let dashedName = stringUtil.dasherize(addonRawName);
  let location = options.addonLocation || dashedName;

  if (options.addonOnly) {
    location = '.';
  }

  return {
    packageName: dashedName,
    name: {
      dashed: dashedName,
      classified: stringUtil.classify(addonRawName),
      raw: addonRawName,
    },
    entity: addonEntity,
    location,
  };
}

/**
 * @param {import('./types').Options} options
 * @return {import('./types').TestAppInfo}
 */
function testAppInfoFromOptions(options) {
  let name = options.testAppName || 'test-app';
  let dashedName = stringUtil.dasherize(name);

  return {
    packageName: dashedName,
    name: {
      dashed: dashedName,
      raw: name,
    },
    location: options.testAppLocation || dashedName,
  };
}

function withoutAddonOptions(options) {
  let result = {};

  for (let [key, value] of Object.entries(options)) {
    if (ADDON_OPTIONS.includes(key)) continue;
    result[key] = value;
  }

  return result;
}

module.exports = {
  addonInfoFromOptions,
  testAppInfoFromOptions,
  withoutAddonOptions,
};
