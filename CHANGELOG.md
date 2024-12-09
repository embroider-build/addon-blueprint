# @embroider/addon-blueprint Changelog

## Release (2024-12-09)

@embroider/addon-blueprint 3.0.0 (major)

#### :boom: Breaking Change
* `@embroider/addon-blueprint`
  * [#314](https://github.com/embroider-build/addon-blueprint/pull/314) Require node 18+ ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#307](https://github.com/embroider-build/addon-blueprint/pull/307) Upgrade @typescript-eslint/* ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#299](https://github.com/embroider-build/addon-blueprint/pull/299) Update addon dependencies ([@simonihmig](https://github.com/simonihmig))
  * [#300](https://github.com/embroider-build/addon-blueprint/pull/300) remove publishConfig from addon package.json ([@jamescdavis](https://github.com/jamescdavis))

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#312](https://github.com/embroider-build/addon-blueprint/pull/312) bring v2 addon bp in line with scripts from ember addon ([@void-mAlex](https://github.com/void-mAlex))
  * [#306](https://github.com/embroider-build/addon-blueprint/pull/306) ember-source is required for babel-plugin-ember-template-compilation ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 4
- Alex ([@void-mAlex](https://github.com/void-mAlex))
- James C. Davis ([@jamescdavis](https://github.com/jamescdavis))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-08-23)

@embroider/addon-blueprint 2.18.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#295](https://github.com/embroider-build/addon-blueprint/pull/295) Match prettier-plugin-ember-template-tag with version in addon/package.json ([@BoussonKarel](https://github.com/BoussonKarel))

#### Committers: 1
- [@BoussonKarel](https://github.com/BoussonKarel)

## Release (2024-07-04)

@embroider/addon-blueprint 2.17.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#293](https://github.com/embroider-build/addon-blueprint/pull/293) Bump decorator-transforms to v2 ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#286](https://github.com/embroider-build/addon-blueprint/pull/286) Bump ember-babel-plugin-ember-template-compilation ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#284](https://github.com/embroider-build/addon-blueprint/pull/284) Update the linting packages and the eslint config ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#282](https://github.com/embroider-build/addon-blueprint/pull/282) Upgrade the build dependencies in the addon's package.json ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#290](https://github.com/embroider-build/addon-blueprint/pull/290) Remove default `ciProvider` in `appOptions` ([@mkszepp](https://github.com/mkszepp))

#### :memo: Documentation
* `@embroider/addon-blueprint`
  * [#285](https://github.com/embroider-build/addon-blueprint/pull/285) docs: update install instructions to use pnpm and remove `skip-npm` ([@IgnaceMaes](https://github.com/IgnaceMaes))

#### Committers: 4
- Ignace Maes ([@IgnaceMaes](https://github.com/IgnaceMaes))
- Markus Sanin ([@mkszepp](https://github.com/mkszepp))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-04-05)

@embroider/addon-blueprint 2.16.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#280](https://github.com/embroider-build/addon-blueprint/pull/280) Make sure to use the correct package manager in concurrently scripts ([@bertdeblock](https://github.com/bertdeblock))

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#278](https://github.com/embroider-build/addon-blueprint/pull/278) fix: update prepack hook to account for ts scenario ([@aklkv](https://github.com/aklkv))

#### Committers: 2
- Alexey Kulakov ([@aklkv](https://github.com/aklkv))
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))

## Release (2024-03-29)

@embroider/addon-blueprint 2.15.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#279](https://github.com/embroider-build/addon-blueprint/pull/279) Add ESLint rule to require that relative imports use full extensions ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#276](https://github.com/embroider-build/addon-blueprint/pull/276) Remove unnecessary verbatimModuleSyntax from tsconfig.json ([@SergeAstapov](https://github.com/SergeAstapov))

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#277](https://github.com/embroider-build/addon-blueprint/pull/277)  Because TS addons need to emit declarations, we need to set noEmit to false ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#269](https://github.com/embroider-build/addon-blueprint/pull/269) Sort dependencies in root `package.json` file ([@bertdeblock](https://github.com/bertdeblock))

#### Committers: 3
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-03-04)

@embroider/addon-blueprint 2.14.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#266](https://github.com/embroider-build/addon-blueprint/pull/266) add a timeout minutes to the CI jobs ([@mansona](https://github.com/mansona))

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#268](https://github.com/embroider-build/addon-blueprint/pull/268) use our own version of ember-cli so the test app is always generated with the latest blueprint ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2024-02-27)

@embroider/addon-blueprint 2.13.1 (patch)

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#265](https://github.com/embroider-build/addon-blueprint/pull/265) Add @glint/core to root package.json ([@miguelcobain](https://github.com/miguelcobain))

#### :memo: Documentation
* `@embroider/addon-blueprint`
  * [#263](https://github.com/embroider-build/addon-blueprint/pull/263) Document typescript option ([@miguelcobain](https://github.com/miguelcobain))

#### Committers: 1
- Miguel Andrade ([@miguelcobain](https://github.com/miguelcobain))

## Release (2024-02-18)

@embroider/addon-blueprint 2.13.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#259](https://github.com/embroider-build/addon-blueprint/pull/259) remove wyvox/action-setup-pnpm to realign with ember-cli ([@mansona](https://github.com/mansona))

#### :house: Internal
* `@embroider/addon-blueprint`
  * [#262](https://github.com/embroider-build/addon-blueprint/pull/262) fix workspace definition ([@mansona](https://github.com/mansona))
  * [#260](https://github.com/embroider-build/addon-blueprint/pull/260) update release-plan ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))
## Release (2024-02-15)

@embroider/addon-blueprint 2.12.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#253](https://github.com/embroider-build/addon-blueprint/pull/253) Update LTS scenarios ([@bertdeblock](https://github.com/bertdeblock))

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#247](https://github.com/embroider-build/addon-blueprint/pull/247) fix indentation in GitHub CI workflow ([@jelhan](https://github.com/jelhan))
  * [#256](https://github.com/embroider-build/addon-blueprint/pull/256) Add missing .gitignores to better support --addon-only scenarios (no test app) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 3
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Jeldrik Hanschke ([@jelhan](https://github.com/jelhan))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
## Release (2023-12-18)

@embroider/addon-blueprint 2.11.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#243](https://github.com/embroider-build/addon-blueprint/pull/243) Update dependencies in the addon's package.json ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
## Release (2023-12-12)

@embroider/addon-blueprint 2.10.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#222](https://github.com/embroider-build/addon-blueprint/pull/222) Use --skip-cleanup for ember-try for faster-exiting try-scenarios ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#227](https://github.com/embroider-build/addon-blueprint/pull/227) add quotes around path in GitHub workflow ([@basz](https://github.com/basz))

#### Committers: 2
- Bas Kamer ([@basz](https://github.com/basz))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
## Release (2023-12-08)

@embroider/addon-blueprint 2.9.0 (minor)

#### :rocket: Enhancement
* `@embroider/addon-blueprint`
  * [#231](https://github.com/embroider-build/addon-blueprint/pull/231) Remove unneeded babel plugins so that shipped addon code is way smaller and easier to debug without sourcemaps ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
## Release (2023-12-06)

@embroider/addon-blueprint 2.8.1 (patch)

#### :bug: Bug Fix
* `@embroider/addon-blueprint`
  * [#233](https://github.com/embroider-build/addon-blueprint/pull/233) Specify rootDir so that declarations can always be emitted with the correct paths. ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* `@embroider/addon-blueprint`
  * [#232](https://github.com/embroider-build/addon-blueprint/pull/232) Readme: minor formatting fix ([@lolmaus](https://github.com/lolmaus))

#### :house: Internal
* `@embroider/addon-blueprint`
  * [#235](https://github.com/embroider-build/addon-blueprint/pull/235) Dedupe lockfile ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#236](https://github.com/embroider-build/addon-blueprint/pull/236) remove release-it & upgrade release-plan ([@mansona](https://github.com/mansona))
  * [#234](https://github.com/embroider-build/addon-blueprint/pull/234) Setup release plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 3
- Andrey Mikhaylov (lolmaus) ([@lolmaus](https://github.com/lolmaus))
- Chris Manson ([@mansona](https://github.com/mansona))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.8.0 (2023-11-22)

#### :rocket: Enhancement
* [#216](https://github.com/embroider-build/addon-blueprint/pull/216) GH Actions: Swap NVP for wyvox ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#214](https://github.com/embroider-build/addon-blueprint/pull/214) Update tsconfig to have verbatimModuleSyntax and document reasoning for the tsconfig options ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#223](https://github.com/embroider-build/addon-blueprint/pull/223) Fix compatibility with ember-cli 5.4+ ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#218](https://github.com/embroider-build/addon-blueprint/pull/218) Configure Glint correctly for ember-template-imports ([@lukasnys](https://github.com/lukasnys))
* [#213](https://github.com/embroider-build/addon-blueprint/pull/213) Properly configure Yarn v3 ([@bartocc](https://github.com/bartocc))

#### Committers: 4
- Julien Palmas ([@bartocc](https://github.com/bartocc))
- Lukas Nys ([@lukasnys](https://github.com/lukasnys))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.7.0 (2023-09-29)

#### :rocket: Enhancement
* [#209](https://github.com/embroider-build/addon-blueprint/pull/209) Better defaults for publicEntrypoints and appReexports ([@simonihmig](https://github.com/simonihmig))

#### :bug: Bug Fix
* [#210](https://github.com/embroider-build/addon-blueprint/pull/210) Add a service usage to the TS tests to help guide our babel config for TS. ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.6.1 (2023-09-26)

#### :bug: Bug Fix
* [#206](https://github.com/embroider-build/addon-blueprint/pull/206) Assure gts works ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#205](https://github.com/embroider-build/addon-blueprint/pull/205) local dev: upgrade pnpm so that we have the resolution-mode=highest change ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#204](https://github.com/embroider-build/addon-blueprint/pull/204) Add workflow_dispatch to ci ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.6.0 (2023-09-19)

#### :rocket: Enhancement
* [#198](https://github.com/embroider-build/addon-blueprint/pull/198) Use put-built-npm-pacakge-contents@v2.0.0 ([@chancancode](https://github.com/chancancode))

#### :bug: Bug Fix
* [#202](https://github.com/embroider-build/addon-blueprint/pull/202) Upgrade @typescript-eslint dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#201](https://github.com/embroider-build/addon-blueprint/pull/201) Use correct extension for Prettier config file in ESLint config ([@bertdeblock](https://github.com/bertdeblock))

#### Committers: 3
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Godfrey Chan ([@chancancode](https://github.com/chancancode))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.5.0 (2023-09-06)

#### :rocket: Enhancement
* [#191](https://github.com/embroider-build/addon-blueprint/pull/191) Remove `ember-disable-prototype-extensions` from test app ([@bertdeblock](https://github.com/bertdeblock))
* [#188](https://github.com/embroider-build/addon-blueprint/pull/188) pnpm: suggest stricter dep management ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#190](https://github.com/embroider-build/addon-blueprint/pull/190) Update config templates to properly handle .gts files ([@lukemelia](https://github.com/lukemelia))
* [#128](https://github.com/embroider-build/addon-blueprint/pull/128) Fix `cd <path>` in CONTRIBUTING.md ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#182](https://github.com/embroider-build/addon-blueprint/pull/182) cjs for all prettier configs ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 5
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Ignace Maes ([@IgnaceMaes](https://github.com/IgnaceMaes))
- Luke Melia ([@lukemelia](https://github.com/lukemelia))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.4.0 (2023-08-18)

#### :rocket: Enhancement
* [#177](https://github.com/embroider-build/addon-blueprint/pull/177) Upgrade @embroider/test-setup ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#179](https://github.com/embroider-build/addon-blueprint/pull/179) Upgrade ember-try ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#181](https://github.com/embroider-build/addon-blueprint/pull/181) Upgrade eslint-plugin-ember ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#178](https://github.com/embroider-build/addon-blueprint/pull/178) Upgrade ember-template-lint ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#185](https://github.com/embroider-build/addon-blueprint/pull/185) Fix issue while saving gjs/gts where prettier deletes the contents of the file: Downgrade prettier-plugin-ember-template-tag until we're on prettier@v3 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#186](https://github.com/embroider-build/addon-blueprint/pull/186) pnpm: Use the workspace protocol for pnpm for the test-app's dependency on the addon ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#173](https://github.com/embroider-build/addon-blueprint/pull/173) Improve building the `ember-cli-update` blueprint options ([@bertdeblock](https://github.com/bertdeblock))

#### :house: Internal
* [#175](https://github.com/embroider-build/addon-blueprint/pull/175) Lint upgrade only ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.3.0 (2023-08-11)

#### :rocket: Enhancement
* [#172](https://github.com/embroider-build/addon-blueprint/pull/172) Make sure `node-version` is always specified in the GitHub CI file ([@bertdeblock](https://github.com/bertdeblock))

#### Committers: 1
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))

## v2.2.1 (2023-08-11)

#### :rocket: Enhancement
* [#170](https://github.com/embroider-build/addon-blueprint/pull/170) Make sure the addon's `package.json` file is always sorted ([@bertdeblock](https://github.com/bertdeblock))
* [#171](https://github.com/embroider-build/addon-blueprint/pull/171) Update `ember-try` scenarios ([@bertdeblock](https://github.com/bertdeblock))

#### :bug: Bug Fix
* [#169](https://github.com/embroider-build/addon-blueprint/pull/169) Make sure the `node_modules` folder is ignored by Git ([@bertdeblock](https://github.com/bertdeblock))
* [#168](https://github.com/embroider-build/addon-blueprint/pull/168) Update addon ignore files ([@bertdeblock](https://github.com/bertdeblock))

#### Committers: 1
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))

## v2.2.0 (2023-08-10)

#### :rocket: Enhancement
* [#167](https://github.com/embroider-build/addon-blueprint/pull/167) Review lint / dotfiles ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#159](https://github.com/embroider-build/addon-blueprint/pull/159) Add GJS to the default addon blueprint ([@mansona](https://github.com/mansona))
* [#163](https://github.com/embroider-build/addon-blueprint/pull/163) bump addon-dev version ([@mansona](https://github.com/mansona))
* [#161](https://github.com/embroider-build/addon-blueprint/pull/161) Use wyvox/action-setup-pnpm ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#166](https://github.com/embroider-build/addon-blueprint/pull/166) update concurrently version in top-level monorepo ([@mansona](https://github.com/mansona))

#### :memo: Documentation
* [#162](https://github.com/embroider-build/addon-blueprint/pull/162) Add docs about things people should know when authoring V2 addons ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#165](https://github.com/embroider-build/addon-blueprint/pull/165) Reduce post-blueprint generated diff after running `lint:fix` ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#164](https://github.com/embroider-build/addon-blueprint/pull/164) Separate lint tests ([@mansona](https://github.com/mansona))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.1.0 (2023-08-01)

#### :rocket: Enhancement
* [#146](https://github.com/embroider-build/addon-blueprint/pull/146) Add CI workflow to push dist output to separate branch ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#160](https://github.com/embroider-build/addon-blueprint/pull/160) Fix TS Imports by recommending folks add the .ts extension to their import paths ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#158](https://github.com/embroider-build/addon-blueprint/pull/158) Add typescript component building / testing tests ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#156](https://github.com/embroider-build/addon-blueprint/pull/156) Component compilation tests ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#151](https://github.com/embroider-build/addon-blueprint/pull/151) Add some fixture utils ... ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v2.0.0 (2023-07-17)

#### :boom: Breaking Change
* [#149](https://github.com/embroider-build/addon-blueprint/pull/149) Drop node 14 support ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#155](https://github.com/embroider-build/addon-blueprint/pull/155) Remove node resolve ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#150](https://github.com/embroider-build/addon-blueprint/pull/150) Re-enable typescript tests ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#147](https://github.com/embroider-build/addon-blueprint/pull/147) Reorganize tests in to multiple files so the tests are less overwheming to work with ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#148](https://github.com/embroider-build/addon-blueprint/pull/148) Use a newer pnpm ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.7.0 (2023-07-06)

#### :rocket: Enhancement
* [#136](https://github.com/embroider-build/addon-blueprint/pull/136) Move off rollup-plugin-ts ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#129](https://github.com/embroider-build/addon-blueprint/pull/129) Skip .gitignore in existing monorepo ([@simonihmig](https://github.com/simonihmig))
* [#137](https://github.com/embroider-build/addon-blueprint/pull/137) Update for ember-cli `--typescript` changes ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#134](https://github.com/embroider-build/addon-blueprint/pull/134) Run tests with latest Ember CLI ([@simonihmig](https://github.com/simonihmig))
* [#140](https://github.com/embroider-build/addon-blueprint/pull/140) Node 14.19.3 does not exist anymore (sometimes, 500 error from nodejs) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.6.2 (2023-05-31)

#### :bug: Bug Fix
* [#127](https://github.com/embroider-build/addon-blueprint/pull/127) Updated the addon package's Babel configuration ([@ijlee2](https://github.com/ijlee2))

#### Committers: 1
- Isaac Lee ([@ijlee2](https://github.com/ijlee2))

## v1.6.1 (2023-05-30)

#### :house: Internal
* [#125](https://github.com/embroider-build/addon-blueprint/pull/125) Update RELEASE.md ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.5.0 (2023-02-17)

#### :rocket: Enhancement
* [#105](https://github.com/embroider-build/addon-blueprint/pull/105) New flag: --addon-only ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#102](https://github.com/embroider-build/addon-blueprint/pull/102) Alphabetized and standardized the root package.json scripts ([@ijlee2](https://github.com/ijlee2))

#### :house: Internal
* [#102](https://github.com/embroider-build/addon-blueprint/pull/102) Alphabetized and standardized the root package.json scripts ([@ijlee2](https://github.com/ijlee2))
* [#103](https://github.com/embroider-build/addon-blueprint/pull/103) Reduce ambiguity in *.js file extension in addon-root files by explicitly mentioning cjs or mjs ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#106](https://github.com/embroider-build/addon-blueprint/pull/106) Run the tests for --typescript, and get those tests working ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Isaac Lee ([@ijlee2](https://github.com/ijlee2))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.4.1 (2023-01-12)

#### :bug: Bug Fix
* [#95](https://github.com/embroider-build/addon-blueprint/pull/95) Fix missing `.gitignore` in addon folder ([@simonihmig](https://github.com/simonihmig))
* [#96](https://github.com/embroider-build/addon-blueprint/pull/96) Remove deprecated `@types/ember__test-helpers` ([@simonihmig](https://github.com/simonihmig))
* [#94](https://github.com/embroider-build/addon-blueprint/pull/94) Fix files that get copied from root to addon ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v1.4.0 (2023-01-12)

#### :rocket: Enhancement
* [#83](https://github.com/embroider-build/addon-blueprint/pull/83) Bump `@embroider/addon-dev` ([@simonihmig](https://github.com/simonihmig))
* [#88](https://github.com/embroider-build/addon-blueprint/pull/88) Support existing monorepos ([@simonihmig](https://github.com/simonihmig))
* [#76](https://github.com/embroider-build/addon-blueprint/pull/76) Tweak test-app "description" field ([@SergeAstapov](https://github.com/SergeAstapov))

#### :bug: Bug Fix
* [#87](https://github.com/embroider-build/addon-blueprint/pull/87) Update broken test-app script overrides ([@simonihmig](https://github.com/simonihmig))
* [#78](https://github.com/embroider-build/addon-blueprint/pull/78) Support pnpm in GitHub workflow ([@LevelbossMike](https://github.com/LevelbossMike))
* [#79](https://github.com/embroider-build/addon-blueprint/pull/79) Fix accidental resolutions ([@ef4](https://github.com/ef4))

#### :house: Internal
* [#92](https://github.com/embroider-build/addon-blueprint/pull/92) Split monorepo tests in CI ([@simonihmig](https://github.com/simonihmig))
* [#91](https://github.com/embroider-build/addon-blueprint/pull/91) Skip `--typescript` tests temporarily due to #82 ([@simonihmig](https://github.com/simonihmig))
* [#85](https://github.com/embroider-build/addon-blueprint/pull/85) Don't fail-fast in CI ([@simonihmig](https://github.com/simonihmig))

#### Committers: 4
- Edward Faulkner ([@ef4](https://github.com/ef4))
- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v1.3.0 (2022-11-13)

#### :rocket: Enhancement
* [#74](https://github.com/embroider-build/addon-blueprint/pull/74) Cleanup .eslintignore file in addon blueprint ([@SergeAstapov](https://github.com/SergeAstapov))
* [#75](https://github.com/embroider-build/addon-blueprint/pull/75) Update create-rwjblue-release-it-setup, adds support for `--release-it` and `--pnpm` ([@simonihmig](https://github.com/simonihmig))
* [#42](https://github.com/embroider-build/addon-blueprint/pull/42) Add Typescript support ([@simonihmig](https://github.com/simonihmig))

#### :bug: Bug Fix
* [#73](https://github.com/embroider-build/addon-blueprint/pull/73) add pnpm condition to yarn/npm branches in blueprint files ([@SergeAstapov](https://github.com/SergeAstapov))
* [#72](https://github.com/embroider-build/addon-blueprint/pull/72) Fix packageName  wrong `start:tests` and `test` ([@LevelbossMike](https://github.com/LevelbossMike))

#### :memo: Documentation
* [#63](https://github.com/embroider-build/addon-blueprint/pull/63) Add docs for --npm, --pnpm, and --yarn ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#69](https://github.com/embroider-build/addon-blueprint/pull/69) Update release-it plugins ([@simonihmig](https://github.com/simonihmig))
* [#67](https://github.com/embroider-build/addon-blueprint/pull/67) Update CI to volta-cli/action@v4 ([@simonihmig](https://github.com/simonihmig))
* [#62](https://github.com/embroider-build/addon-blueprint/pull/62) Update release-it instructions for when GITHUB_AUTH detection fails ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 4
- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.2.5 (2022-09-19)

#### :rocket: Enhancement
* [#36](https://github.com/embroider-build/addon-blueprint/pull/36) Add support for npm and pnpm ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#54](https://github.com/embroider-build/addon-blueprint/pull/54) Add Ember 4.4 LTS to addon blueprint, remove 3.24 ([@simonihmig](https://github.com/simonihmig))
* [#52](https://github.com/embroider-build/addon-blueprint/pull/52) Move .md files to published package ([@simonihmig](https://github.com/simonihmig))
* [#48](https://github.com/embroider-build/addon-blueprint/pull/48) Support ember-cli-update ([@simonihmig](https://github.com/simonihmig))
* [#37](https://github.com/embroider-build/addon-blueprint/pull/37) Switch to Concurrently from npm-run-all ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#55](https://github.com/embroider-build/addon-blueprint/pull/55) Use `prepack` rather than `prepublishOnly` ([@dfreeman](https://github.com/dfreeman))
* [#43](https://github.com/embroider-build/addon-blueprint/pull/43) Fix test-app to not fail prettier linting ([@simonihmig](https://github.com/simonihmig))
* [#31](https://github.com/embroider-build/addon-blueprint/pull/31) Rebuild on addon changes ([@ef4](https://github.com/ef4))
* [#30](https://github.com/embroider-build/addon-blueprint/pull/30) Provide a fixed root to @babel/eslint-parser ([@ef4](https://github.com/ef4))

#### :memo: Documentation
* [#60](https://github.com/embroider-build/addon-blueprint/pull/60) Link to the "Porting Addons to V2" documentation at the top of the README ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#51](https://github.com/embroider-build/addon-blueprint/pull/51) Use npm package references in docs ([@simonihmig](https://github.com/simonihmig))
* [#34](https://github.com/embroider-build/addon-blueprint/pull/34) Enable/Fix copy-paste for ember addon commands ([@gossi](https://github.com/gossi))

#### :house: Internal
* [#57](https://github.com/embroider-build/addon-blueprint/pull/57) Refactor utils in prep for multiple workspaces support ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#50](https://github.com/embroider-build/addon-blueprint/pull/50) Fix test timeouts ([@simonihmig](https://github.com/simonihmig))
* [#49](https://github.com/embroider-build/addon-blueprint/pull/49) Add Lints ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#44](https://github.com/embroider-build/addon-blueprint/pull/44) Add tests ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#45](https://github.com/embroider-build/addon-blueprint/pull/45) Add GitHub Actions ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#40](https://github.com/embroider-build/addon-blueprint/pull/40) Switch to pnpm and add tests package ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#38](https://github.com/embroider-build/addon-blueprint/pull/38) Cleanup unused locals ([@simonihmig](https://github.com/simonihmig))

#### Committers: 5
- Dan Freeman ([@dfreeman](https://github.com/dfreeman))
- Edward Faulkner ([@ef4](https://github.com/ef4))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- Thomas Gossmann ([@gossi](https://github.com/gossi))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.1.2 (2022-07-01)

#### :bug: Bug Fix
* [#29](https://github.com/embroider-build/addon-blueprint/pull/29) volta pin npm ([@ef4](https://github.com/ef4))

#### Committers: 1
- Edward Faulkner ([@ef4](https://github.com/ef4))

## v1.1.1 (2022-07-01)

#### :bug: Bug Fix
* [#28](https://github.com/embroider-build/addon-blueprint/pull/28) Followup fixes for changed addon location ([@ef4](https://github.com/ef4))

#### Committers: 1
- Edward Faulkner ([@ef4](https://github.com/ef4))

## v1.1.0 (2022-07-01)

#### :rocket: Enhancement
* [#27](https://github.com/embroider-build/addon-blueprint/pull/27) Change default locations of addon and test-app ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#23](https://github.com/embroider-build/addon-blueprint/pull/23) Path customization for addons and test apps. ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#24](https://github.com/embroider-build/addon-blueprint/pull/24) Refactor extending test-app's package.json, add `ember-disable-prototype-extensions` ([@simonihmig](https://github.com/simonihmig))
* [#25](https://github.com/embroider-build/addon-blueprint/pull/25) Drop node dependency declaration ([@simonihmig](https://github.com/simonihmig))
* [#26](https://github.com/embroider-build/addon-blueprint/pull/26) Prevent the `lint:hbs` scripts from throwing when no template files are present ([@bertdeblock](https://github.com/bertdeblock))
* [#22](https://github.com/embroider-build/addon-blueprint/pull/22) Remove release-it by default, but allow --release-it flag ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 3
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.0.0 (2022-06-27)

#### :bug: Bug Fix
* [#12](https://github.com/embroider-build/addon-blueprint/pull/12) Fix running `create-rwjblue-release-it-setup` ([@simonihmig](https://github.com/simonihmig))

#### :memo: Documentation
* [#20](https://github.com/embroider-build/addon-blueprint/pull/20) Use Github reference in Usage docs ([@simonihmig](https://github.com/simonihmig))

#### Committers: 2
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

# Changelog
