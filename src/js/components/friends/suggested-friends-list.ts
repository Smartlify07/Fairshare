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
             <header class="flex items-center gap-2 mb-[var(--space-lg)]">
                <h1 class="text-size-lg font-medium font-heading text-text">
                 Suggested Friends
                </h1>
           
            </header>
          ${
            suggestedFriends.length > 0
              ? `<ul class="flex flex-col gap-[var(--space-lg)]">${friendsList}</ul>`
              : `<div class="card p-6 flex flex-col gap-5 justify-center items-center">
              <div class="rounded-full bg-primary/10 flex items-center justify-center size-16">
      <svg class="size-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.5 19.5L20 21M11 14C7.13401 14 4 17.134 4 21H11M19 17.5C19 18.8807 17.8807 20 16.5 20C15.1193 20 14 18.8807 14 17.5C14 16.1193 15.1193 15 16.5 15C17.8807 15 19 16.1193 19 17.5ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="var(--color-primary)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>      
              </div>

              <div class="flex flex-col gap-2 items-center">
              <h3 class="text-text font-medium text-xl">
                No suggestions right now
              </h3>
              <p class="text-sm text-muted font-body">
              Try searching for friends using the search bar
              </p>
              </div>
      </div>`
          }
    `;
  }
}
