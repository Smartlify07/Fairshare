import type { State } from "./types/state.type";

export default {
  user: null,
  profile: null,
  bills: [],
  friends: [],
  selectedBill: null,
  selectedFriendsToSplitWith: [],
} satisfies State;
