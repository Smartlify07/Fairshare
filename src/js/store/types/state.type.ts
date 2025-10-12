import type { User } from '@supabase/supabase-js';
import type { ExtendedBillWithFriends } from './bills.type';
import type { FriendshipProfileJoin } from './friends.type';

export type State = {
  user: User | null;
  bills: ExtendedBillWithFriends[];
  friends: FriendshipProfileJoin[];
  selectedBill: ExtendedBillWithFriends | null;
};
