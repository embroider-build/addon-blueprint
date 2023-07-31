import { default as JSComponent } from './components/js-component.js';
import { default as TSComponent } from './components/ts-component.ts';
import { default as Nested } from './components/nested/index.js';

// Easily allow apps, which are not yet using strict mode templates, to consume your Glint types, by importing this file.
// Add all your components, helpers and modifiers to the template registry here, so apps don't have to do this.
// See https://typed-ember.gitbook.io/glint/using-glint/ember/authoring-addons

// import type MyComponent from './components/my-component';

// Remove this once entries have been added! 👇
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface Registry {
  Nested: typeof Nested;
  JsComponent: typeof JSComponent;
  TsComponent: typeof TSComponent;
}
