import { babel } from '@rollup/plugin-babel';
<% if (!isExistingMonorepo) { %>import copy from 'rollup-plugin-copy';
<% } %>import { Addon } from '@embroider/addon-dev/rollup';
<% if (typescript) { %>
import { $ } from "execa";
import { fixBadDeclarationOutput } from "fix-bad-declaration-output";
<% } %>

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    // By default all your JavaScript modules (**/*.js) will be importable.
    // But you are encouraged to tweak this to only cover the modules that make
    // up your addon's public API. Also make sure your package.json#exports
    // is aligned to the config here.
    // See https://github.com/embroider-build/embroider/blob/main/docs/v2-faq.md#how-can-i-define-the-public-exports-of-my-addon
    addon.publicEntrypoints(['**/*.js', 'index.js'<% if (typescript) {%>, 'template-registry.js'<% } %>]),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    addon.appReexports([
      'components/**/*.js',
      'helpers/**/*.js',
      'modifiers/**/*.js',
      'services/**/*.js',
    ]),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    // This babel config should *not* apply presets or compile away ES modules.
    // It exists only to provide development niceties for you, like automatic
    // template colocation.
    //
    // By default, this will load the actual babel config from the file
    // babel.config.json.
    babel({
      extensions: ['.js', '.gjs'<% if (typescript) { %>, '.ts', '.gts'<% } %>],
      babelHelpers: 'bundled',
    }),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    addon.hbs(),

    // Ensure that .gjs files are properly integrated as Javascript
    addon.gjs(),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    addon.keepAssets(['**/*.css']),

    // Remove leftover build artifacts when starting a new build.
    addon.clean(),
<% if (!isExistingMonorepo) { %>
    // Copy Readme and License into published package
    copy({
      targets: [
<% filesToCopyFromRootToAddon.forEach((file) => { %>        { src: '<%= pathFromAddonToRoot %>/<%= file %>', dest: '.' },
<% }); %>      ],
    }),
<% } %>

<% if (typescript) { %>
    {
      name: "Build Declarations",
      closeBundle: async () => {
        /**
         * Generate the types (these include /// <reference types="ember-source/types"
         * but our consumers may not be using those, or have a new enough ember-source that provides them.
         */
        console.log("Building types");
        <% if (npm) { %>
        await $({ stdio: 'inherit' })`npm exec glint -- --declaration`;
        <% } else { %>
        await $({ stdio: 'inherit' })`<%= packageManager %> glint --declaration`;
        <% } %>

        /**
         * https://github.com/microsoft/TypeScript/issues/56571#
         * README: https://github.com/NullVoxPopuli/fix-bad-declaration-output
         */
        console.log("Fixing types");
        await fixBadDeclarationOutput("declarations/**/*.d.ts", [
          // https://github.com/microsoft/TypeScript/issues/56571#issuecomment-1830436576
          ["TypeScript#56571", { types: "all" }],
          // https://github.com/typed-ember/glint/issues/628
          "Glint#628",
        ]);
        console.log("⚠️ Dangerously (but neededly) fixed bad declaration output from typescript");
      },
    },
<% } %>
  ],
};
