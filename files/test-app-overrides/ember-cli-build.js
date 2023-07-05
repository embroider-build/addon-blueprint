'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    <% if (typescript) {%>'ember-cli-babel': { enableTypeScriptTransform: true },
    <% } %>autoImport: {
      watchDependencies: ['<%= addonName %>'],
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
