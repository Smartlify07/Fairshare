import { getAuthState } from './auth/auth';
import {
  getFriendRequests,
  getReceivedFriendRequests,
  updateFriendRequest,
} from './api/friends';

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

const handleGetFriendRequests = async () => {
  const user = await getAuthState();
  const friendRequests = await getReceivedFriendRequests(user?.id!);
  if (friendRequests.length === 0) {
    friendRequestsListElement.style.display = 'none';
    const friendRequestsEmptyState = document.createElement('div');
    friendRequestsEmptyState.innerHTML = `
    <div class="flex flex-col gap-6 items-center justify-center">
      <div class="flex gap-0 justify-center items-center">
          <img class="rounded-avatar size-10 object-cover" src="/public/images/boy_avatar.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-1-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-2-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <h1 class="font-heading text-lg text-text">No friend requests yet</h1>
        <p class="font-display text-base text-muted font-normal text-center">
      Looks like your friends haven’t found you just yet. Sit tight, they’ll show up soon!</p>
      </div>
    </div>
    `;

    friendRequestsElement.appendChild(friendRequestsEmptyState);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  getUserProfile();
  handleGetFriendRequests();
});
