import { sendFriendRequest, updateFriendRequest } from '../../api/friends.api';
import UserAvatar from '../components/dashboard/user-avatar';
import FriendRequestsComponent from '../components/friends/friend-requests';
import FriendsList from '../components/friends/friends-list';
import SuggestedFriendsList from '../components/friends/suggested-friends-list';
import store from '../store';

const handleSendFriendRequest = async (receiver_id: string) => {
  if (!receiver_id) {
    throw new Error('Receiver id is required');
  }

  await sendFriendRequest(store.state.user?.id!, receiver_id);
  store.dispatch('updateSuggestedFriends', {
    friendship_status: 'pending',
    id: receiver_id,
  });
};

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('#send-friend-request-btn')) {
    const receiver_id = target.dataset.id;
    if (!receiver_id) {
      throw new Error('Receiver ID not specified.');
    }
    handleSendFriendRequest(receiver_id);
  }

  if (target.closest('#decline-request-btn')) {
    const receiver_id = target.dataset.receiver_id;
    const requester_id = target.dataset.requester_id;
    const id = target.dataset.id;

    if (!receiver_id || !requester_id) {
      throw new Error('Receiver ID and Requester ID must be specified.');
    }
    updateFriendRequest(requester_id, receiver_id, 'declined');
    store.dispatch('updateFriendRequest', {
      id,
      status: 'declined',
    });
  }
  if (target.closest('#accept-request-btn')) {
    const receiver_id = target.dataset.receiver_id;
    const requester_id = target.dataset.requester_id;
    const id = target.dataset.id;
    if (!receiver_id || !requester_id) {
      throw new Error('Receiver ID and Requester ID must be specified.');
    }
    updateFriendRequest(requester_id, receiver_id, 'accepted');
    store.dispatch('updateFriendRequest', {
      id,
      status: 'accepted',
    });
  }
});

const FriendList = new FriendsList();
const SuggestedFriendsListElement = new SuggestedFriendsList();
const FriendRequestsList = new FriendRequestsComponent();
const AvatarInstance = new UserAvatar();

AvatarInstance.render();
FriendList.render();
SuggestedFriendsListElement.render();
FriendRequestsList.render();

document.addEventListener('DOMContentLoaded', () => {
  store.query('getUser');
  store.query('getFriends');
  store.query('getSuggestedFriends');
  store.query('getFriendRequests');
});
