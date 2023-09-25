# Authoring Libraries

Authoring libraries with rollup, using this blueprint, requires some more explicit conventions than what folks pre-V2-addons may be used to.

## Building

This blueprint uses [Rollup](https://rollupjs.org/) for assembling and transpiling your code in to a native npm package that can be imported from anywhere[^anywhere].

There are a few reasons we need a build step:
- use of pre-shipped JS features (decorators, and other in-progress ECMA proposals)
- co-located components are not modules-by-default[^gjs]
- building at publish time makes apps faster -- because the apps then have less to transform themselves[^embroider-compat-v2]

If you'd like to provide build-time behaviors, using [unplugin](https://github.com/unjs/unplugin) allows you to write a build-time plugin once, using similar-to-rollup-APIs, and works for Vite, Rollup, Webpack, and ESBuild.

## `package.json`

For background on native packages ([V2 Addons](https://github.com/emberjs/rfcs/blob/master/text/0507-embroider-v2-package-format.md)) and what all is needed to publish real npm packages, this documentation will be helpful:
- https://dev.to/binjospookie/exports-in-package-json-1fl2
- https://nodejs.org/api/packages.html#package-entry-points
- https://webpack.js.org/guides/package-exports/

Using `package.json#exports` means that:
- Used to specify what can be imported from your library. 
- The `addon.publicEntrypoints(...)` plugin in `rollup.config.mjs` should _at least_, include whatever is in `package.json#exports`
- The `addon.appReexports(...)` plugin must have overlap with the `package.json#exports` so that the app-tree merging may import from the addon.

## Importing modules

Modules should have the file extension included in the import path so that rollup knows which set of plugins to run over the file.

```ts
import { Something } from './path/to/file.ts';
```

If you've done ESM in node, this should feel familiar, and we can be be consistent with JS imports as well:

```js
import { AnotherThing } from './path/to/file.js';
```

Generally, import:
- gjs with `./path/to/file.gjs`
- gts with `./path/to/file.gts`
- js with `./path/to/file.js`
- ts with `./path/to/file.ts`
- hbs with `./path/to/file.js` or `./path/to/file`

A couple caveats with older, co-located components,
 - for `.hbs` / template-only components, no extension is needed, but the js extension can be used.
 - for co-located components, where the template is in a separate `.hbs` file, you may not import that `.hbs` file directly, because it is merged in with the associated `.js` or `.ts` file.

For consumers of your library, they will not need to worry about the extensions, because:
- rollup compiles away the implementation details (non-js modules)
- package.json#exports declares what is importable under what path, and maps non-extension imports to files with extensions


## CSS

As mentioned in the [RFC for Native Packages](https://github.com/emberjs/rfcs/blob/master/text/0507-embroider-v2-package-format.md#css), 

> If any of the Own Javascript or App Javascript modules depend on the presence of a CSS file in the same package, it should say so explicitly via an ECMA relative import, like:
> 
> import '../css/some-component.css';
>
> This is interpreted as a build-time directive that ensures that before the Javascript module is evaluated, the CSS file's contents will be present in the DOM. ECMA import of CSS files must always include the explicit .css extension.

The broader JavaScript ecosystem does not yet have a standardized way of handling CSS form libraries, but there are some things aligning. This [proposal-import-attributes](https://github.com/tc39/proposal-import-attributes) describes how packagers (such as Webpack, Vite, etc), can consistently, cross-ecosystem-ly, interpreted CSS imports and have CSS participate in the module graph. 

We want CSS to participate in the module graph so that tree-shaking and bundle splitting can work for CSS as well as JS. Though, this applies to more than just CSS, and it will work for any file extension that you want to import. For example, importing SVG files could give you the SVG, the URL to the SVG, or a reference to a spritesheet.

[^anywhere]: no reliance on ember-cli. Eventually this'll mean that you can use CDN-imports to import your libraries in REPLs.
[^gjs]: this is one of the reasons ember is moving to gjs/gts for components, because the concept of a "module" is important, and easily represented by this file type.
[^embroider-compat-v2]: if you use embroider, it will do an automated conversion of v1 addons in your `node_modules` to v2 addons (converting _native packages_) and cache the result, so that subsequent builds will be faster. This also helps with bundling speed as well.
