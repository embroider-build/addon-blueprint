import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class AnotherGts extends Component<Signature> {
  greeting = "Hello";
  <template>
    <div ...attributes>
      {{this.greeting}} from another GTS file!
    </div>
  </template>
}
