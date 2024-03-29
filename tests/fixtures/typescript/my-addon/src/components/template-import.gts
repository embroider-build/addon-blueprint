import Component from '@glimmer/component';
import TemplateOnly from './template-only.ts';
import AnotherGts from './another-gts.gts'; // N.B. relative imports inside a v2 addon should have explicit file extensions (this is consistent with how node treats ES modules)
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { fn } from '@ember/helper';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    saying?: string;
  };
}

export default class TemplateImport extends Component<Signature> {
  <template>
    <div ...attributes>
      Hello from a GTS file but also <TemplateOnly /> and <AnotherGts />

      <button {{on "click" (fn this.saySomething @saying)}}></button>
    </div>
  </template>

  @action
  saySomething(sayWhat: string | undefined) {
    console.log(sayWhat || "something");
  }
}
