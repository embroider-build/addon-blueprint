import Component from '@glimmer/component';
import TemplateOnly from './template-only.js';
import { on } from '@ember/modifier';

export default class TemplateImport extends Component {
  <template>
    Hello from a GJS file but also <TemplateOnly />

    <button {{on "click" this.saySomething}}></button>
  </template>

  saySomething() {
    console.log("something");
  }
}
