import Component from "../../lib/component";
import store from "../../store";

export default class UserAvatar extends Component {
  constructor() {
    super({
      element: document.querySelector("#user-avatar"),
      store: store,
    });
  }
  render(): void {
    let self = this;
    const { user } = store.state;

    const profileImage = `
          <img alt="${user?.user_metadata?.name + "'s avatar"}" src="${
      user?.user_metadata?.picture
    }" class="size-8 avatar"/>
        `;
    const profilePlaceHolder = `
          <div class="avatar-fallback">
            ${user?.user_metadata?.name}
          </div>
        `;

    if (!user) {
      self.element!.innerHTML = `
            <div class="bg-muted/10 animate-pulse avatar size-8">
            </div>
          `;
    } else {
      if (user?.user_metadata?.picture) {
        self.element!.innerHTML = profileImage;
      } else {
        self.element!.innerHTML = profilePlaceHolder;
      }
    }
  }
}
