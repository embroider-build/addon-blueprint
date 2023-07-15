import { precompileTemplate } from '@ember/template-compilation';
import Component from '@glimmer/component';

precompileTemplate("{{this.someGetter}}\n");

class CoLocated extends Component {
  get someGetter() {
    return 'someGetter';
  }
}

export { CoLocated };
//# sourceMappingURL=co-located.js.map
