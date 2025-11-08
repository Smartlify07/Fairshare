import Component from '../../lib/component';
import store from '../../store';

export default class FriendRequestsComponent extends Component {
  constructor() {
    super({
      element: document.getElementById('friend-requests-section'),
      store: store,
    });
  }

  render(): void {
    const { friendRequests } = store.state;
    const friendsList = friendRequests
      ?.map((friend) => {
        const receiver_id = friend.receiver_id;
        const requester_id = friend.requester_id;

        return `

      <li class="flex justify-between bg-surface items-center gap-[var(--space-sm)] w-full p-4 shadow-2xs rounded-xl">
        <div class="flex items-center gap-2">
          <div class='size-10 avatar-fallback flex items-center justify-center bg-neutral-100 text-size-base rounded-full!'>${friend.profile.name?.charAt(
            0
          )}</div>
          <div class="flex flex-col">
            <h1 class="text-base font-medium text-text">
              ${friend.profile.name}
            </h1>
            <h3 class="text-sm text-muted">@${friend.profile.name
              .split(' ')
              .join('')}</h3>
          </div>
        </div>

        <div class="flex items-center gap-4">
              <button
              id="decline-request-btn"
              data-receiver_id="${receiver_id}" 
              data-requester_id="${requester_id}" 
              class="button button-outline">
                Decline
              </button>
              <button
              id="accept-request-btn"
              data-receiver_id="${receiver_id}" 
              data-requester_id="${requester_id}"
              class="button button-primary">
                Accept
              </button>
        </div>
      </li>
    
    `;
      })
      .join('');

    this.element!.innerHTML = `
            <header class="flex items-center gap-2 mb-[var(--space-lg)]">
                <h1 class="text-size-lg font-medium font-heading text-text">
                  Friend Requests
                  </h1>
                  <span class="rounded-full bg-primary/30 text-primary size-6 text-sm inline-flex font-medium items-center justify-center">
                    ${friendRequests?.length ?? 0}
                  </span>
            </header>
        <div class="rounded-md grid gap-[var(--space-lg)]">
                
          ${
            friendRequests?.length > 0
              ? `<ul class="flex flex-col gap-[var(--space-lg)]">${friendsList}</ul>`
              : `<p class="text-muted text-center text-sm">No friends yet. Add one to start splitting!</p>`
          }
        </div>
    `;
  }
}
