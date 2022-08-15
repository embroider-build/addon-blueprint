# @embroider/addon-blueprint

Blueprint for scaffolding ember v2 addons

For migrating a v1 addon to a v2 addon, you may follow _[Porting Addons to V2](https://github.com/embroider-build/embroider/blob/main/PORTING-ADDONS-TO-V2.md)_ and
this blog post [Migrating an Ember addon to the next-gen v2 format
](https://www.kaliber5.de/de/blog/v2-addon_en).


## WIP

This is still work in progress.

The blueprint contains a number of assumptions, e.g. using a monorepo using (`yarn`  or `npm`) workspaces, with separate workspaces for the addon and the test-app. But there is plenty of room for bikeshedding here, so if you have suggestions about better ways to set this up, then please file an issue to discuss!


## Usage

```bash
ember addon my-addon -b @embroider/addon-blueprint --yarn
```

### Options

#### `--addon-location`

The location / folder name of the addon can be customized via `--addon-location`.

Examples:
```bash
ember addon my-addon -b @embroider/addon-blueprint --addon-location=packages/the-addon
# generates
#   my-addon/packages/the-addon
```

#### `--test-app-location`


The location / folder name of the addon can be customized via `--test-app-location`.

Examples:
```bash
ember addon my-addon -b @embroider/addon-blueprint --test-app-location=test-app
# generates
#   my-addon/test-app
```

By default, `{test app name}` will be used.

#### `--test-app-name`

The name of the test-app can be customized via `--test-app-name`.

Examples:
```bash
ember addon my-addon -b @embroider/addon-blueprint --test-app-name=test-app-for-my-addon
# generates
#   my-addon/test-app-for-my-addon
```

By default, `test-app` will be used.

#### `--release-it`

If you want release-it behavior, (specifically provided by `create-rwjblue-release-it-setup`),
use the `--release-it` flag

```bash
ember addon my-addon -b @embroider/addon-blueprint --yarn --release-it
```

### Updating the addon

The blueprint supports `ember-cli-update` to update your addon with any changes that occurred in the blueprint since you created the addon. So to update your addons boilerplate, simply run `ember-cli-update` (or `npx ember-cli-update` if you haven't installed it globally). 

For additional instructions, please consult its [documentation](https://github.com/ember-cli/ember-cli-update).


### In existing monorepos

In existing monorepos, it may be helpful to establish a convention for generating v2 addons as sub-monorepos
within your monorepo.
To do this, you'll need to use many of the above options all at once (remembering that all packages in a monorepo must have a unique "name" in their package.json).

For example:
```bash
ember addon my-addon-name -b @embroider/addon-blueprint \
  --skip-git \
  --skip-npm \
  --addon-location="package" \
  --test-app-name="test-app-for-my-addon-name" \
  --test-app-location="test-app"
# generates
#   my-addon-name/
#     package/
#     test-app/
```

Then, your workspace search globs can be defined as (for example):
```js
# all ember apps in the top level "apps directory"
apps/*
# all ember v2 addons share the same structure
# example:
#   addons/
#     my-awesome-addon/
#       package/
#       test-app/
#       docs/
#       etc/
addons/*/package
addons/*/test-app
addons/*/docs
```


## License

This project is licensed under the [MIT License](LICENSE.md).
