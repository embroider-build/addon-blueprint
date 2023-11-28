'use strict';

module.exports = {
  "plugins": [
<% if (typescript) { %>  ["@babel/plugin-transform-typescript", { "allExtensions": true, "onlyRemoveTypeImports": true, "allowDeclareFields": true }],
<% } %>    "@embroider/addon-dev/template-colocation-plugin",
    ["decorator-transform", {
      runtime: {
        import: require.resolve('decorator-transforms/runtime'),
      }
    }]
  ]
}
