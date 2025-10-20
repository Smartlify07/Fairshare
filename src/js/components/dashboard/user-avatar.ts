import Component from "../../lib/component";
import store from "../../store";

export default class UserAvatar extends Component {
  constructor() {
    super({
      element: document.querySelector("#user-avatar"),
      store: store,
    });
  }
  render(): void {}
}
