import { getAuthState } from './auth/auth';
import { getReceivedFriendRequests, updateFriendRequest } from './api/friends';

const friendRequestsElement = document.querySelector(
  '#friend-requests'
) as HTMLElement;
const friendRequestsListElement = document.querySelector(
  '#friend-requests-list'
) as HTMLUListElement;
const userProfileElement = document.querySelector(
  '#user-profile'
) as HTMLDivElement;
const userImageElement = document.querySelector(
  '#user-profile-avatar'
) as HTMLImageElement;
const greetingText = document.querySelector(
  '#greeting-section > h1'
) as HTMLHeadingElement;

const getUserProfile = async () => {
  const user = await getAuthState();
  if (user?.user_metadata?.picture) {
    userImageElement.src = user?.user_metadata?.picture;
  } else {
    userImageElement.style.display = 'none';
    userProfileElement.className =
      'rounded-avatar flex items-center justify-center bg-bg text-text';
    userProfileElement.textContent = user?.user_metadata.name.charAt(0);
  }
  greetingText.textContent = `Hello, ${user?.user_metadata?.name}`;
  return user;
};

const handleUpdateFriendRequest = async (
  receiver_id: string,
  requester_id: string,
  status: 'accepted' | 'declined'
) => {
  try {
    await updateFriendRequest(requester_id, receiver_id, status);
  } catch (error) {
    console.error(error);
  }
};

const handleGetReceivedFriendRequests = async () => {
  const user = await getAuthState();

  const friendRequests = await getReceivedFriendRequests(user?.id!);
  if (friendRequests?.length === 0) {
    const emptyFriendRequestList = document.createElement('div');
    emptyFriendRequestList.innerHTML = `
    <div class="flex flex-col gap-6 items-center justify-center">
      <div class="flex gap-0 justify-center items-center">
          <img class="rounded-avatar size-10 object-cover" src="/public/images/boy_avatar.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-1-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-2-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <h1 class="font-heading text-lg text-text">No friends yet</h1>
        <p class="font-display text-base text-muted font-normal text-center">
            Your friends list is looking a little lonely. Start connecting and this space will fill up fast!
        </p>
      </div>
    </div>
    `;
    friendRequestsElement?.appendChild(emptyFriendRequestList);
  } else {
    friendRequests?.forEach((friend: any) => {
      const profile = friend.profiles;
      const friendCardElement = document.createElement('div');
      friendCardElement.className =
        'flex items-center rounded-card p-4 justify-between border shadow-xs border-border bg-surface';
      friendCardElement.innerHTML = `
              <div class="flex items-center gap-4">
                ${
                  friend?.avatar_url
                    ? `<img
                  src=${profile.avatar_url ?? ''}
                  alt=${profile.name}
                  class="rounded-avatar size-10 object-cover"
                />`
                    : `<div class="rounded-avatar bg-bg size-10 flex items-center text-text font-body justify-center">
                        ${profile.name.charAt(0)}              
                      </div>`
                }
                <div>
                  <h3
                    class="text-base font-medium overflow-hidden w-[200px] whitespace-nowrap text-ellipsis font-heading text-text"
                  >
                    ${profile.name}
                  </h3>
                  <p
                    class="text-sm font-normal tracking-tight text-muted font-display"
                  >
                    @${profile?.username ?? profile?.name}
                  </p>
                </div>

                       
              </div>

              <div class="flex items-center gap-2">
                  <button id="accept-btn" class="accept-btn rounded-2xl bg-surface text-success border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-sm">
                    Accept
                  </button>
                  <button id="decline-btn" class="decline-btn rounded-2xl bg-surface text-error border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-sm">
                    Decline
                  </button>
              </div>     
    `;
      friendRequestsListElement?.append(friendCardElement);
      friendCardElement
        .querySelector('#accept-btn')
        ?.addEventListener('click', () => {
          handleUpdateFriendRequest(
            friend.receiver_id,
            friend.requester_id,
            'accepted'
          );
        });
      friendCardElement
        .querySelector('#decline-btn')
        ?.addEventListener('click', () => {
          handleUpdateFriendRequest(
            friend.receiver_id,
            friend.requester_id,
            'declined'
          );
        });
    });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  getUserProfile();
  handleGetReceivedFriendRequests();
});
