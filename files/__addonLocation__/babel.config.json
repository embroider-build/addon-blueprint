{
  "plugins": [
<% if (typescript) { %>  ["@babel/plugin-transform-typescript", { "allExtensions": true, "onlyRemoveTypeImports": true, "allowDeclareFields": true }],
<% } %>    "@embroider/addon-dev/template-colocation-plugin",
    ["babel-plugin-ember-template-compilation", {
      "targetFormat": "hbs",
      "transforms": []
    }],
    ["decorator-transform", { "runtime": { "import": "decorator-transform/runtime" } }],
  ]
}
