import type { User } from "@supabase/supabase-js";
import type { BillFriend } from "../store/types/bills.type";

export const getRemainingFriends = (friends: BillFriend[], max: number) => {
  if (!friends || !max) {
    throw new Error("Specify friends and max numbers");
  }
  return friends.slice(0, max ?? 3).length - 3;
};

export const findFriendWithUserId = (
  bill_friends: BillFriend[],
  user_id: User["id"]
) => {
  return bill_friends.find((friend) => friend.friend_id === user_id);
};

export const getFriendsWhoHaveSettled = (bill_friends: BillFriend[]) => {
  return bill_friends.filter((friend) => friend.payment_status === "settled");
};
