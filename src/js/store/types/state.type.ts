import type { User } from '@supabase/supabase-js';
import type { ExtendedBillWithFriends } from './bills.type';
import type { Friend, FriendRequest, SuggestedFriend } from './friends.type';
import type { Profile } from './profile.type';

export type State = {
  user: User | null;
  bills: ExtendedBillWithFriends[];
  friends: Friend[];
  friendRequests: FriendRequest[];
  suggestedFriends: SuggestedFriend[];
  selectedBill: ExtendedBillWithFriends | null;
  profile: Profile | null;
  selectedFriendsToSplitWith: Friend['id'][];
  selectedFilter: 'all' | 'as_creator' | 'you_owe';
};
