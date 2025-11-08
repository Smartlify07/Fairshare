import Component from '../../lib/component';
import store from '../../store';

export default class SuggestedFriendsList extends Component {
  constructor() {
    super({
      element: document.getElementById('suggested-friends-section'),
      store: store,
    });
  }

  render(): void {
    const { suggestedFriends } = store.state;

    const friendsList = suggestedFriends
      .map(
        (friend) => `

      <li class="flex justify-between bg-surface items-center gap-[var(--space-sm)] w-full p-4 shadow-2xs rounded-xl">
        <div class="flex items-center gap-2">
          <div class='size-10 avatar-fallback flex items-center justify-center bg-neutral-100 text-size-base rounded-full!'>${friend.name?.charAt(
            0
          )}</div>
          <div class="flex flex-col">
            <h1 class="text-base font-medium text-text">
              ${friend.name}
            </h1>
            <h3 class="text-sm text-muted">@${friend.name
              .split(' ')
              .join('')}</h3>
          </div>
        </div>

        <button data-id="${
          friend.id
        }" id="send-friend-request-btn" class="button button-primary peeling-btn! ${
          friend.friendship_status === 'pending' ? 'hidden!' : 'hidden'
        }">
    <svg class="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#fff" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="user-add"> <g> <path d="M17,21V19a4,4,0,0,0-4-4H5a4,4,0,0,0-4,4v2" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path> <circle cx="9" cy="7" fill="none" r="4" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <line fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="17" x2="23" y1="11" y2="11"></line> <line fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="20" x2="20" y1="8" y2="14"></line> </g> </g> </g> </g></svg>            Send Request
        </button>

         <div data-id="${
           friend.id
         }" id="send-friend-request-btn" class="button bg-border/80 text-text cursor-not-allowed! peeling-btn! ${
          !friend.friendship_status ? 'hidden!' : 'hidden'
        }">
<svg class="size-6" width="256px" height="256px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12.0002C5.50024 8.66068 7.85944 5.78639 11.1348 5.1351C14.4102 4.48382 17.6895 6.23693 18.9673 9.32231C20.2451 12.4077 19.1655 15.966 16.3887 17.8212C13.6119 19.6764 9.91127 19.3117 7.55 16.9502C6.23728 15.6373 5.49987 13.8568 5.5 12.0002Z" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 12.0002L11.333 14.3332L16 9.66724" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            Request Sent
            
        </div>
          
      </li>
    
    `
      )
      .join('');

    this.element!.innerHTML = `
        <div class="rounded-md grid gap-[var(--space-lg)]">
                
          ${
            suggestedFriends.length > 0
              ? `<ul class="flex flex-col gap-[var(--space-lg)]">${friendsList}</ul>`
              : `<p class="text-muted text-center text-sm">No friends yet. Add one to start splitting!</p>`
          }
        </div>
    `;
  }
}
