# Authoring Libraries

Authoring libraries with rollup, using this blueprint, requires some more explicit conventions than what folks pre-V2-addons may be used to.

## Importing modules

Modules should have the file extension included in the import path so that rollup knows which set of plugins to run over the file.

```ts
import { Something } from './path/to/file.ts';
```

If you've done ESM in node, this should feel familiar, and we can be be consistent with JS imports as well:

```js
import { AnotherThing } from './path/to/file.js';
```

A couple caveats with older, co-located components,
 - for `.hbs` / template-only components, the import path is still `.js`, because we transform it.
 - for co-located components, where the template is in a separate `.hbs` file, you may not import that `.hbs` file directly, because it is merged in with the associated `.js` or `.ts` file.


