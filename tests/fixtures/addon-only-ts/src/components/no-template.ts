import Component from '@glimmer/component';

interface Signature {
  Args: {},
  Blocks: {} 
}

export class NoTemplate extends Component<Signature> {
  get someGetter() {
    return 'someGetter';
  }
}
