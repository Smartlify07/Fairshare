import Store from "../store/store";
import type { State } from "../store/types/state.type";

type Props = {
  store: Store<State>;
  element: HTMLElement | null;
};
export default class Component {
  element: HTMLElement | null = null;
  render(): void {}
  constructor(props = {} as Props) {
    let self = this;
    this.render = this.render || function () {};

    if (props.store instanceof Store) {
      props.store.events.subscribe("stateChange", () => self.render());
    }

    if (props.hasOwnProperty("element")) {
      if (props.element !== null) {
        this.element = props.element;
      }
    }
  }
}
