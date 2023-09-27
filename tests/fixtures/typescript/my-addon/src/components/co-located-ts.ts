import Component from '@glimmer/component';
import { service } from '@ember/service';
import Example from '../services/example';

export default class CoLocatedTs extends Component {
  @service declare example: Example;

  whereAmI = 'from a co-located TS component';
}
