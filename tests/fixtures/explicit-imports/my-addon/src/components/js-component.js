import Component from '@glimmer/component';

import { default as Nested } from './nested/index.js';

export default class JSComponent extends Component {
  Nested = Nested;

  get name() {
    return 'JS';
  }
}
