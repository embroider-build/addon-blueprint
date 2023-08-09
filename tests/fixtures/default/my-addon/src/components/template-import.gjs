import Component from '@glimmer/component';
import TemplateOnly from './template-only';
import { on } from '@ember/modifier';

export default class CoLocated extends Component {
  <template>
    Hello from a GJS file but also <TemplateOnly />

    <button {{on "click" this.saySomething}}></button>
  </template>

  saySomething() {
    console.log("something");
  }
}
