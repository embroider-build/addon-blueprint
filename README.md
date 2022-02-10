ember-v2-addon-blueprint
==============================================================================

Blueprint for scaffolding ember v2 addons

This is based on the setup used for [ember-stargate](https://github.com/kaliber5/ember-stargate), explained in detail
in the blog post [Migrating an Ember addon to the next-gen v2 format
](https://www.kaliber5.de/de/blog/v2-addon_en).


WIP
------------------------------------------------------------------------------

This is still work in progress. 

The blueprint contains a number of assumptions, e.g. using a monorepo using `yarn` workspaces, with a `packages/` folder
for both the v2 addon and the separate test app. But there is plenty of room for bikeshedding here, so if you have 
suggestions about better ways to set this up, then please file an issue to discuss!


Usage
------------------------------------------------------------------------------

```bash
ember addon my-addon -b ember-v2-addon-blueprint --yarn
```

> Note: this sets up a monorepo using `yarn` workspaces. Package managers other than `yarn` have not been tested yet! 


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).