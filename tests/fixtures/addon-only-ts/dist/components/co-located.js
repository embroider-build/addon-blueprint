import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';
import Component from '@glimmer/component';

var TEMPLATE = precompileTemplate("{{this.someGetter}}\n\n{{yield}}\n");

class CoLocated extends Component {
  get someGetter() {
    return 'someGetter';
  }
}
setComponentTemplate(TEMPLATE, CoLocated);

export { CoLocated as default };
//# sourceMappingURL=co-located.js.map
