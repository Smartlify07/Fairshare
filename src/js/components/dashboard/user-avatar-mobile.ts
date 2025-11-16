import Component from '../../lib/component';
import store from '../../store';

export default class UserAvatarMobile extends Component {
  constructor() {
    super({
      element: document.querySelector('#user-avatar-mobile'),
      store: store,
    });
  }
  render(): void {
    let self = this;
    const { user } = store.state;

    const profileImage = `
          <img alt="${user.data?.user_metadata?.name + "'s avatar"}" src="${
      user.data?.user_metadata?.picture
    }" class="size-8 rounded-full! avatar"/>
        `;
    const profilePlaceHolder = `
          <div class="avatar-fallback">
            ${user.data?.user_metadata?.name}
          </div>
        `;

    if (!user) {
      self.element!.innerHTML = `
            <div class="bg-muted/10 animate-pulse avatar rounded-full! size-8">
            </div>
          `;
    } else {
      if (user.data?.user_metadata?.picture) {
        self.element!.innerHTML = profileImage;
      } else {
        self.element!.innerHTML = profilePlaceHolder;
      }
    }
  }
}
