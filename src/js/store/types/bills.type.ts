import type { Friend } from "./friends.type";
import type { Profile } from "./profile.type";

export type Bill = {
  id: number;
  creator_id: string;
  created_at: string;
  title: string;
  amount: number;
};
export type BillFriend = {
  id: string;
  bill_id: Bill["id"];
  creator_id: string;
  amount_assigned: number;
  payment_status: "settled" | "owing";
  friend_id: string;
  amount_paid: null | number;
  friend: Profile;
};

export type ExtendedBillWithFriends = Bill & {
  bill_friends: BillFriend[];
  creator: Profile;
};

export type BillFriendCreationPayload = {
  bill_id: string;
  friend_id: string;
  amount_assigned: number;
  payment_status: "owing" | "paid";
};

export type PayBillPayload = {
  bill_id: Bill["id"];
  amount_paid: number;
  friend_id: Friend["id"];
  creator_id: Bill["creator_id"];
  payment_status: BillFriend["payment_status"];
};
