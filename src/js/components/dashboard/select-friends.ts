import Component from '../../lib/component';
import store from '../../store';
import { checkIsBrokenImage } from '../../utils/images.utils';

export default class SelectFriends extends Component {
  constructor() {
    super({
      element: document.querySelector('.friend-selector'),
      store: store,
    });
  }

  render(): void {
    const {
      friends: { data: friends },
    } = store.state;

    let innerHTML = '';
    friends.forEach(async (friend) => {
      const isImageBroken = await checkIsBrokenImage(friend?.avatar_url ?? '');
      innerHTML += `
    <button type="button" id="${friend.id}" class="friend">
      <div class="avatar flex items-center justify-center gap-1">
      ${
        isImageBroken
          ? `<img src=${friend?.avatar_url} alt=${friend.name + "'s avatar"}/>`
          : `<div class=${'avatar-fallback'}>${friend.name.charAt(0)}</div>`
      }
      </div>
     <span>${friend.name}</span>
    </button>`;
      this.element!.innerHTML = innerHTML;
    });
  }
}
