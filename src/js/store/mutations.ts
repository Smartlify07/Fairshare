import type { BillFriend } from './types/bills.type';
import type { FriendRequest, SuggestedFriend } from './types/friends.type';
import type { State } from './types/state.type';

export default {
  setQueryResult(state: State, payload: any) {
    return Object.assign({}, state, payload);
  },

  createBill(state: State, payload: any) {
    state.bills.data.push(payload);
    return state;
  },

  updateSelectedBill(state: State, payload: any) {
    state.selectedBill = payload;
    return state;
  },
  updateSelectedFriendsToSplitWith(
    state: State,
    payload: State['selectedFriendsToSplitWith']
  ) {
    state.selectedFriendsToSplitWith = payload;
    return state;
  },
  updateBillStatus(state: State, payload: BillFriend) {
    const updatedBills = state.bills.data.map((bill) => {
      return bill.id === payload.bill_id
        ? {
            ...bill,
            bill_friends: bill.bill_friends.map((friend) =>
              friend.friend_id === payload.friend_id
                ? { ...friend, ...payload }
                : friend
            ),
          }
        : bill;
    });
    state.bills.data = updatedBills;
    return state;
  },
  updateSelectedFilter(state: State, payload: State['selectedFilter']) {
    state.selectedFilter = payload;
    return state;
  },

  updateSuggestedFriends(state: State, payload: SuggestedFriend) {
    const updateSuggestions = state.suggestedFriends.data.map((suggestion) => {
      return suggestion.id === payload.id
        ? {
            ...suggestion,
            friendship_status: payload.friendship_status,
          }
        : suggestion;
    });
    state.suggestedFriends.data = updateSuggestions;
    return state;
  },

  updateFriendRequest(state: State, payload: FriendRequest) {
    const { friendRequests } = state;
    const updatedFriendRequests = friendRequests.data.filter((request) => {
      return Number(request.id) !== Number(payload.id);
    });
    const newFriend = friendRequests.data.find(
      (request) => Number(request.id) === Number(payload.id)
    )?.profile;
    let updatedFriends = [];
    if (!newFriend) {
      updatedFriends = [...state.friends.data];
    }
    updatedFriends = [...state.friends.data, newFriend!];
    state.friendRequests.data = updatedFriendRequests;
    state.friends.data = updatedFriends;
    return state;
  },
};
