// @ts-check;
const stringUtil = require('ember-cli-string-utils');

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

  return {
    packageName: dashedName,
    name: {
      dashed: dashedName,
      classified: stringUtil.classify(addonRawName),
      raw: addonRawName,
    },
    entity: addonEntity,
    location: options.addonLocation || dashedName,
  }
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
  }
}

module.exports = {
  addonInfoFromOptions,
  testAppInfoFromOptions,
};
