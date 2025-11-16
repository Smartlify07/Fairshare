import { sendFriendRequest, updateFriendRequest } from '../../api/friends.api';
import UserAvatar from '../components/dashboard/user-avatar';
import UserAvatarMobile from '../components/dashboard/user-avatar-mobile';
import FriendRequestsComponent from '../components/friends/friend-requests';
import FriendsList from '../components/friends/friends-list';
import SuggestedFriendsList from '../components/friends/suggested-friends-list';
import store from '../store';
import type { FriendRequest } from '../store/types/friends.type';

const handleSendFriendRequest = async (receiver_id: string) => {
  if (!receiver_id) {
    throw new Error('Receiver id is required');
  }

  await sendFriendRequest(store.state.user.data?.id!, receiver_id);
  store.dispatch('updateSuggestedFriends', {
    friendship_status: 'pending',
    id: receiver_id,
  });
};

const handleUpdateRequest = async (
  id: string,
  receiver_id: string,
  requester_id: string,
  status: FriendRequest['status']
) => {
  if (!receiver_id || !requester_id) {
    throw new Error('Receiver ID and Requester ID must be specified.');
  }
  updateFriendRequest(requester_id, receiver_id, status);
  store.dispatch('updateFriendRequest', {
    id,
    status,
  });
};

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const sendBtn = target.closest('#send-friend-request-btn') as HTMLElement;
  const declineBtn = target.closest('#decline-request-btn') as HTMLElement;
  const acceptBtn = target.closest('#accept-request-btn') as HTMLElement;

  if (sendBtn) {
    const receiver_id = sendBtn?.dataset.id;
    if (!receiver_id) {
      throw new Error('Receiver ID not specified.');
    }
    handleSendFriendRequest(receiver_id);
  } else if (declineBtn) {
    const receiver_id = declineBtn.dataset.receiver_id;
    const requester_id = declineBtn.dataset.requester_id;
    const id = declineBtn.dataset.id;

    handleUpdateRequest(id!, receiver_id!, requester_id!, 'declined');
  } else if (acceptBtn) {
    const receiver_id = acceptBtn.dataset.receiver_id;
    const requester_id = acceptBtn.dataset.requester_id;
    const id = acceptBtn.dataset.id;
    handleUpdateRequest(id!, receiver_id!, requester_id!, 'accepted');
  } else {
    return;
  }
});

const FriendList = new FriendsList();
const SuggestedFriendsListElement = new SuggestedFriendsList();
const FriendRequestsList = new FriendRequestsComponent();
const AvatarInstance = new UserAvatar();
const MobileAvatarInstance = new UserAvatarMobile();

AvatarInstance.render();
MobileAvatarInstance.render();
FriendList.render();
SuggestedFriendsListElement.render();
FriendRequestsList.render();

document.addEventListener('DOMContentLoaded', () => {
  store.query('getUser');
  store.query('getFriends');
  store.query('getSuggestedFriends');
  store.query('getFriendRequests');
});
