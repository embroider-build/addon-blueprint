import Component from '@glimmer/component';
import { service } from '@ember/service';
import type Example from '../services/example.ts';

export default class CoLocatedTs extends Component {
  @service declare example: Example;

  whereAmI = 'from a co-located TS component';
}
