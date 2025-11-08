import { sendFriendRequest, updateFriendRequest } from '../../api/friends.api';
import FriendRequestsComponent from '../components/friends/friend-requests';
import FriendsList from '../components/friends/friends-list';
import SuggestedFriendsList from '../components/friends/suggested-friends-list';
import store from '../store';

document.addEventListener('DOMContentLoaded', () => {
  store.query('getUser');
  store.query('getFriends');
  store.query('getSuggestedFriends');
  store.query('getFriendRequests');
});

const handleSendFriendRequest = async (receiver_id: string) => {
  if (!receiver_id) {
    throw new Error('Receiver id is required');
  }

  await sendFriendRequest(store.state.user?.id!, receiver_id);
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
    if (!receiver_id || !requester_id) {
      throw new Error('Receiver ID and Requester ID must be specified.');
    }
    updateFriendRequest(requester_id, receiver_id, 'declined');
  }
  if (target.closest('#accept-request-btn')) {
    const receiver_id = target.dataset.receiver_id;
    const requester_id = target.dataset.requester_id;
    if (!receiver_id || !requester_id) {
      throw new Error('Receiver ID and Requester ID must be specified.');
    }
    updateFriendRequest(requester_id, receiver_id, 'accepted');
  }
});

const FriendList = new FriendsList();
const SuggestedFriendsListInstance = new SuggestedFriendsList();
const FriendRequestsList = new FriendRequestsComponent();

FriendRequestsList.render();
FriendList.render();
SuggestedFriendsListInstance.render();
