import Component from '@glimmer/component';

interface Signature {
  Args: {},
  Blocks: { default: [] } 
}

export default class CoLocated extends Component<Signature> {
  get someGetter() {
    return 'someGetter';
  }
}
