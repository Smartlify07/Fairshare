import { getAuthState } from './utils/auth';
import {
  addFriend,
  getFriendRequests,
  getFriends,
  getSuggestedFriends,
  updateFriendRequest,
} from './utils/friends';

const dashboard = document.querySelector('#dashboard') as HTMLElement;
const friendsElement = document.querySelector('#friends') as HTMLDivElement;
const friendListElement = document.querySelector(
  '#friend-list'
) as HTMLUListElement;
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

  console.log(user?.user_metadata.name);

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

const handleGetFriends = async () => {
  const friends = await getFriends();
  console.log(friends);
  const emptyState = document.createElement('div');
  emptyState.textContent = "You don't have any friends yet.";
  if (friends?.length === 0) {
    console.log('No friends');
    friendsElement.appendChild(emptyState);
  } else {
    friends?.forEach((friend) => {
      const listItemElement = document.createElement('li');
      listItemElement.id = 'add-friend-list-item';

      listItemElement.textContent = friend.name;
      friendsElement.appendChild(listItemElement);
    });
  }
};

const handleUpdateFriendRequest = async (
  receiver_id: string,
  requester_id: string
) => {
  try {
    await updateFriendRequest(requester_id, receiver_id, 'accepted');
    alert('Friend request accepted!');
  } catch (error) {
    console.error(error);
  }
};

const handleGetFriendRequests = async () => {
  const friendRequests = await getFriendRequests();
  friendRequests?.forEach((friend_request) => {
    const listItemElement = document.createElement('li');
    const button = document.createElement('button');
    listItemElement.id = 'add-friend-list-item';
    button.textContent = 'Accept request';

    button.addEventListener('click', () => {
      handleUpdateFriendRequest(
        friend_request.receiver_id,
        friend_request.requester_id
      );
    });

    listItemElement.textContent = friend_request.profiles?.name;
    listItemElement.appendChild(button);
    friendRequestsListElement.appendChild(listItemElement);
  });
  console.log(friendRequests);
};

const handleAddFriend = async (friend_id: string) => {
  const user = await getUserProfile();

  try {
    await addFriend(user?.id!, friend_id);
    alert('Friend request sent');
  } catch (error) {
    console.error(error);
  }
};

const handleGetSuggestedFriends = async () => {
  const suggestedFriends = await getSuggestedFriends();
  console.log(suggestedFriends);
  suggestedFriends?.forEach((friend) => {
    const listItemElement = document.createElement('li');
    const button = document.createElement('button');
    listItemElement.id = 'add-friend-list-item';
    button.textContent = 'Add friend';

    button.addEventListener('click', () => {
      handleAddFriend(friend.id);
    });

    listItemElement.textContent = friend.name;
    listItemElement.appendChild(button);
    friendListElement.appendChild(listItemElement);
  });
};
window.addEventListener('DOMContentLoaded', () => {
  getUserProfile();
  handleGetFriends();
  handleGetSuggestedFriends();
  handleGetFriendRequests();
});
