import type { State } from './types/state.type';

export default {
  user: null,
  profile: null,
  bills: [],
  friends: [],
  suggestedFriends: [],
  selectedBill: null,
  selectedFriendsToSplitWith: [],
  selectedFilter: 'all',
  friendRequests: [],
} satisfies State;
