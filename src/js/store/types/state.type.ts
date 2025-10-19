import type { User } from "@supabase/supabase-js";
import type { ExtendedBillWithFriends } from "./bills.type";
import type { FriendshipProfileJoin } from "./friends.type";
import type { Profile } from "./profile.type";

export type State = {
  user: User | null;
  bills: ExtendedBillWithFriends[];
  friends: FriendshipProfileJoin[];
  selectedBill: ExtendedBillWithFriends | null;
  profile: Profile | null;
};
