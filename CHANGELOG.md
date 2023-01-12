







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
