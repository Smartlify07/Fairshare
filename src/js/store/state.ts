import type { State } from './types/state.type';

export default {
  user: {
    loading: true,
    error: null,
    data: null,
  },

  profile: {
    loading: true,
    error: null,
    data: null,
  },

  bills: {
    loading: true,
    error: null,
    data: [],
  },

  friends: {
    loading: true,
    error: null,
    data: [],
  },

  friendRequests: {
    loading: true,
    error: null,
    data: [],
  },

  suggestedFriends: {
    loading: true,
    error: null,
    data: [],
  },

  /** non-async UI-only states */
  selectedBill: null,
  selectedFriendsToSplitWith: [],
  selectedFilter: 'all',
} satisfies State;
