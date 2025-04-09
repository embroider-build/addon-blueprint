# @embroider/addon-blueprint

> This blueprint is a preview of the [v2 app blueprint](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/) and was intended to an experiment to see what was needed to ship v2 addons. While the blueprint was successful in its aims, this blueprint will never become the default for newly generated Ember addons. The DX hit of forcing every Ember developer to maintain a monorepo was too high a bar and the Ember Core Tooling team decided it didn't match the expectations of the Ember community. We are currently developing a non-monorepo version of the addon blueprint that is still work in progress but you can try it out now: https://github.com/ember-cli/ember-addon-blueprint
>
> Anyone considering a new migration of a v1 addon to v2 should use the new `@ember/addon-blueprint` and not this one 👍

Blueprint for scaffolding ember v2 addons

For migrating a v1 addon to a v2 addon, you may follow _[Porting Addons to V2](https://github.com/embroider-build/embroider/blob/main/PORTING-ADDONS-TO-V2.md)_ and
this blog post [Migrating an Ember addon to the next-gen v2 format
](https://www.kaliber5.de/de/blog/v2-addon_en).

## WIP

This is still work in progress.

The blueprint contains a number of assumptions, e.g. using a monorepo using (`yarn` or `npm`) workspaces, with separate workspaces for the addon and the test-app. But there is plenty of room for bikeshedding here, so if you have suggestions about better ways to set this up, then please file an issue to discuss!

## Usage

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --pnpm
```

### Options

For all these options, you'll see a warning printed from `ember-cli` about unsupported options.
`ember-cli` doesn't have a way to detect if flags are used by a blueprint.

#### `--pnpm`

Sets up the new addon with [`pnpm`](https://pnpm.io/) as a default package manager.

Example:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --pnpm
cd my-addon
```

#### `--npm`

Sets up the new addon with `npm` as a default.

Example:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --npm
cd my-addon
```

#### `--yarn`

Sets up the new addon with `yarn` as a default.

Example:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --yarn
cd my-addon
```

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
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --test-app-location=test-app
# generates
#   my-addon/test-app
```

By default, `{test app name}` will be used.

#### `--test-app-name`

The name of the test-app can be customized via `--test-app-name`.

Examples:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --test-app-name=test-app-for-my-addon
# generates
#   my-addon/test-app-for-my-addon
```

By default, `test-app` will be used.

#### `--addon-only`

Will only create the addon, similar to the v1 addon behavior of `ember addon my-addon`.
This is useful for incremental migrations of v1 addons to v2 addons where the process from the
[Porting Addons to V2](https://github.com/embroider-build/embroider/blob/main/PORTING-ADDONS-TO-V2.md)
guide.

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --addon-only
# generates non-monorepo:
#   my-addon/
#     .git
#     package.json
```

For incremental migration in monorepos, you'll want to also supply the `--skip-git` flag.

#### `--typescript`

Sets up the new addon with [`typescript`](https://www.typescriptlang.org/) support.

Example:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --typescript
```

### Updating the addon

The blueprint supports `ember-cli-update` to update your addon with any changes that occurred in the blueprint since you created the addon. So to update your addons boilerplate, simply run `ember-cli-update` (or `npx ember-cli-update` if you haven't installed it globally).

For additional instructions, please consult its [documentation](https://github.com/ember-cli/ember-cli-update).

### In existing monorepos

To generate a new v2 addon inside an existing monorepo, `cd` to that repo's directory and run the command as usual. The blueprint will auto-detect an existing `package.json` and adapt to it. Specifically it will not create or override any files at the root folder, like the `package.json` itself.

Most likely though you would not want to use the default locations for the addon and the test app. Instead you should establish a convention how multiple addons and test-apps are located. With the aforementioned path options you can then make the blueprint emit the packages in the correct place.

Some more things to pay attention to:

- Pass the package manager option ( `--npm`, `--yarn`, `--pnpm`) that you already use!
- Make sure that the chosen addon and test-app locations are all covered by the configured workspace layout of your package manager!
- Each package should have a distinct name, so make provide unique names for your test apps instead of the default `test-app` by using the `--test-app-name` option.
- There is no `start` script at the root `package.json` anymore to start both the addon's build and the test app in watch mode. So you would have to run that `start` script with your package manager in both locations in parallel (separate terminal windows/tabs).
- Pass the `skip-git` option to not auto-commit the generated files. Most likely there will be things to adapt to you specific requirements before committing.
- The blueprint will omit all files usually generated at the root folder, including `.prettierrc.js`, and instead use whatever you have already defined in your existing monorepo. So you should run the `lint:fix` script for both the addon and the test-app, and eventually address any non-fixable linting issues or other configuration conventions related to your specific setup.

Some examples...

#### Group by name

We group by the name of the addon, the addon's package and its test app are co-located sub-folders:

```
project-monorepo
└── addons
    ├── my-addon
    │   ├── package
    │   └── test-app
    └── ...
```

[//]: # 'to edit this: https://tree.nathanfriend.io/?s=(%27options!(%27fancy!true~fullPath3~trailingSlash3~rootDot3)~4(%274%27project-monorepo02addons05my-addon0*5package0*5test-app05...%27)~version!%271%27)*%20%200%5Cn5-%203!false4source!5*2%0154320*'

To generate this run:

```bash
cd project-monorepo
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint \
  --skip-git \
  --skip-npm \
  --addon-location="addons/my-addon/package" \
  --test-app-name="test-app-for-my-addon" \
  --test-app-location="addons/my-addon/test-app"
```

#### Group by type

Addons and test-apps are separated:

```
project-monorepo
├── addons
│   ├── my-addon
│   └── ...
└── tests
    ├── my-addon
    └── ...
```

[//]: # 'to edit this: https://tree.nathanfriend.io/?s=(%27options!(%27fancy!true~fullPath2~trailingSlash2~rootDot2)~5(%275%27project-monorepo04738904test39%27)~version!%271%27)*0640862!false3s*my-74-%205source!6%20%207addon8%5Cn9*...%01987654320*'

To generate this run:

```bash
cd project-monorepo
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint \
  --skip-git \
  --skip-npm \
  --addon-location="addons/my-addon" \
  --test-app-name="test-app-for-my-addon" \
  --test-app-location="tests/my-addon"
```

## License

This project is licensed under the [MIT License](LICENSE.md).
