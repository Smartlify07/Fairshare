import Store from '../store/store';

type Props = {
  store: Store;
  element: HTMLElement | null;
};
export default class Component {
  element: HTMLElement | null;
  constructor(props = {} as Props) {
    let self = this;
    this.render = this.render || function () {};

    if (props.store instanceof Store) {
      props.store.events.subscribe('stateChange', () => self.render());
    }

    if (props.hasOwnProperty('element')) {
      this.element = props.element;
    }
  }
  render() {}
}
