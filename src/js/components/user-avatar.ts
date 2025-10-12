import Component from '../lib/component';
import store from '../store';

export default class UserAvatar extends Component {
  constructor() {
    super({
      element: document.querySelector('#user-profile'),
      store: store,
    });
  }

  render() {
    let self = this;
    const { user } = store.state;

    const profileImage = `
      <img src="${user?.user_metadata?.avatar_url}" class="size-8 avatar"/>
    `;
    const profilePlaceHolder = `
      <div class="avatar-fallback">
        ${user?.user_metadata?.name}
      </div>
    `;

    if (!user) {
      self.element!.innerHTML = `
        <div class="avatar-loader size-8">
        </div>
      `;
    }

    if (user) {
      if (user?.user_metadata?.avatar_url) {
        self.element!.innerHTML = profileImage;
      } else {
        self.element!.innerHTML = profilePlaceHolder;
      }
    }
  }
}
