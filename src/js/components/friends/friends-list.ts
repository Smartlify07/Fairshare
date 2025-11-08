import Component from '../../lib/component';
import store from '../../store';

export default class FriendsList extends Component {
  constructor() {
    super({
      element: document.getElementById('friends-section'),
      store: store,
    });
  }

  render(): void {
    const { friends } = store.state;

    const friendsList = friends
      .map(
        (friend) => `

      <li class="flex flex-col bg-surface items-center gap-[var(--space-sm)] min-w-[140px] max-w-[140px] border-[0.5px] p-4 border-border rounded-xl">
          <div class='size-14 avatar-fallback flex items-center justify-center bg-neutral-100 text-size-lg rounded-full!'>${friend.name?.charAt(
            0
          )}</div>
          
        <h3 class="text-text text-sm font-medium">${friend.name}</h3>
      </li>
    
    `
      )
      .join('');

    this.element!.innerHTML = `
      <section class="">
          <h1 class="text-size-lg font-medium mb-[var(--space-lg)] font-heading text-text">
            Your Friends
          </h1>
        <div class="rounded-md grid gap-[var(--space-lg)]">
                
          ${
            friends.length > 0
              ? `<ul class="flex gap-[var(--space-lg)]">${friendsList}</ul>`
              : `<p class="text-muted text-center text-sm">No friends yet. Add one to start splitting!</p>`
          }
        </div>
      </section>
    `;
  }
}
