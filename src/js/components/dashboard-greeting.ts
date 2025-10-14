import Component from "../lib/component";
import store from "../store";

export default class DashboardGreeting extends Component {
  constructor() {
    super({
      element: document.querySelector("#greeting-section"),
      store: store,
    });
  }

  render() {
    let self = this;
    const { user } = store.state;

    const greetingLoader = `
        <div class="min-h-10 min-w-[230px] rounded-xl bg-neutral-100 self-start animate-pulse">
        </div>
        `;
    const greeting = `<h1>Hello, ${user?.user_metadata.name ?? ""}</h1>`;

    self.element!.innerHTML = user ? greeting : greetingLoader;
  }
}
