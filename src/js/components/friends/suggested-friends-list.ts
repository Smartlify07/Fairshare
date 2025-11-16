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

    const friendsList = suggestedFriends.data
      .map(
        (friend) => `

      <li class="flex justify-between bg-surface items-center gap-[var(--space-sm)] w-full p-4 shadow-2xs rounded-xl">
        <div class="flex items-center gap-2">
          <div class='size-8 md:size-10 avatar-fallback flex items-center justify-center bg-neutral-100 text-size-base rounded-full!'>${friend.name?.charAt(
            0
          )}</div>
          <div class="flex flex-col">
            <h1 class="text-sm md:text-base text-ellipsis font-medium text-text">
              ${friend.name}
            </h1>
            <h3 class="text-xs md:text-sm text-muted">@${friend.name
              .split(' ')
              .join('')}</h3>
          </div>
        </div>

        <button data-id="${
          friend.id
        }" id="send-friend-request-btn" class="button button-primary peeling-btn! ${
          friend.friendship_status === 'pending' ? 'hidden!' : ''
        }">
  <svg class="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      <span class="whitespace-nowrap hidden sm:block">
      
      Send Request
      </span>
        </button>

         <div data-id="${
           friend.id
         }" class="button bg-border/80 text-text flex items-center gap-1! lg:gap-2! flex-nowrap cursor-not-allowed! px-4! lg:px-6! ${
          !friend.friendship_status ? 'hidden!' : ''
        }">
<svg class="size-6" width="256px" height="256px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12.0002C5.50024 8.66068 7.85944 5.78639 11.1348 5.1351C14.4102 4.48382 17.6895 6.23693 18.9673 9.32231C20.2451 12.4077 19.1655 15.966 16.3887 17.8212C13.6119 19.6764 9.91127 19.3117 7.55 16.9502C6.23728 15.6373 5.49987 13.8568 5.5 12.0002Z" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 12.0002L11.333 14.3332L16 9.66724" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
           <span class="shrink-0 whitespace-nowrap  hidden sm:block">
           Request Sent
           </span>
            
        </div>
          
      </li>
    
    `
      )
      .join('');

    if (suggestedFriends.loading) {
      this.element!.innerHTML = `
      <header class="flex items-center gap-2 mb-[var(--space-lg)]">
        <h1 class="text-size-lg font-medium font-heading text-text">Suggested Friends</h1>
    
      </header>

      <div class="rounded-md grid gap-[var(--space-lg)]">
        <ul class="flex flex-col gap-[var(--space-lg)]">
        
          ${Array.from({ length: 3 })
            .map(
              () => `
            <li class="flex justify-between items-center gap-[var(--space-sm)] w-full p-4 rounded-xl bg-surface  shadow-2xs animate-pulse">
              <div class="flex items-center gap-2">
                <div class="size-10 rounded-full bg-muted/10"></div>
                <div class="flex flex-col gap-2">
                  <div class="h-4 w-24 rounded-md bg-muted/10"></div>
                  <div class="h-3 w-16 rounded-md bg-muted/10"></div>
                </div>
              </div>

                <div class="h-8 w-24 rounded-md bg-muted/10"></div>
            </li>
          `
            )
            .join('')}
          
        </ul>
      </div>
    `;
      return;
    }

    this.element!.innerHTML = `
             <header class="flex items-center gap-2 mb-[var(--space-lg)]">
                <h1 class="text-size-lg font-medium font-heading text-text">
                 Suggested Friends
                </h1>
           
            </header>
          ${
            suggestedFriends.data.length > 0
              ? `<ul class="flex flex-col gap-[var(--space-lg)]">${friendsList}</ul>`
              : `<div class="card p-6 flex flex-col gap-5 justify-center items-center">
              <div class="rounded-full bg-primary/10 flex items-center justify-center size-16">
      <svg class="size-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.5 19.5L20 21M11 14C7.13401 14 4 17.134 4 21H11M19 17.5C19 18.8807 17.8807 20 16.5 20C15.1193 20 14 18.8807 14 17.5C14 16.1193 15.1193 15 16.5 15C17.8807 15 19 16.1193 19 17.5ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="var(--color-primary)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>      
              </div>

              <div class="flex flex-col gap-2 items-center">
              <h3 class="text-text text-center font-medium text-xl">
                No suggestions right now
              </h3>
              <p class="text-sm text-muted text-center font-body">
              Try searching for friends using the search bar
              </p>
              </div>
      </div>`
          }
    `;
  }
}
