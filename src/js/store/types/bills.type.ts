import type { Profile } from './profile.type';

export type Bill = {
  id: number;
  creator_id: string;
  created_at: string;
  title: string;
  amount: number;
};
export type BillFriend = {
  id: string;
  bill_id: Bill['id'];
  creator_id: string;
  amount_assigned: number;
  payment_status: 'settled' | 'owing';
  friend_id: string;
  amount_paid: null | number;
  friend: Profile;
};

export type ExtendedBillWithFriends = Bill & {
  bill_friends: BillFriend[];
  creator: Profile;
};
