import type { User } from '@supabase/supabase-js';
import type { ExtendedBillWithFriends } from './bills.type';
import type { Friend, FriendRequest, SuggestedFriend } from './friends.type';
import type { Profile } from './profile.type';

export type AsyncState<T> = {
  loading: boolean;
  error: string | null;
  data: T;
};

export type State = {
  user: AsyncState<User | null>;
  bills: AsyncState<ExtendedBillWithFriends[]>;
  friends: AsyncState<Friend[]>;
  friendRequests: AsyncState<FriendRequest[]>;
  suggestedFriends: AsyncState<SuggestedFriend[]>;
  profile: AsyncState<Profile | null>;

  selectedBill: ExtendedBillWithFriends | null;
  selectedFriendsToSplitWith: Friend['id'][];
  selectedFilter: 'all' | 'as_creator' | 'you_owe';
};
