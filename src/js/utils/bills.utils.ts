import type { User } from '@supabase/supabase-js';
import type {
  BillFriend,
  ExtendedBillWithFriends,
} from '../store/types/bills.type';

export const getRemainingFriends = (friends: BillFriend[], max: number) => {
  if (!friends || !max) {
    throw new Error('Specify friends and max numbers');
  }
  return friends.slice(0, max ?? 3).length - 3;
};

export const findFriendWithUserId = (
  bill_friends: BillFriend[],
  user_id: User['id']
) => {
  return bill_friends.find((friend) => friend.friend_id === user_id);
};

export const getFriendsWhoHaveSettled = (bill_friends: BillFriend[]) => {
  return bill_friends.filter((friend) => friend.payment_status === 'settled');
};

export const sortBillsByRecent = (bills: ExtendedBillWithFriends[]) => {
  return bills.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export const calculateTotalPaidPercentage = (
  bill_friends: BillFriend[],
  totalAmount: number
) => {
  const totalPaidAmount = bill_friends.reduce(
    (acc, curr) => acc + (curr.amount_paid || 0),
    0
  );
  return ((totalPaidAmount / totalAmount) * 100).toFixed(2);
};

export const calculateUserOwedAmount = (
  billFriends: BillFriend[],
  currentUserId: User['id']
): number => {
  const userEntry = findFriendWithUserId(billFriends, currentUserId);
  if (!userEntry) return 0;
  return userEntry.amount_assigned - (userEntry?.amount_paid || 0) || 0;
};

export const filterBills = (
  bills: ExtendedBillWithFriends[],
  filter: 'all' | 'as_creator' | 'you_owe',
  currentUserId: User['id']
): ExtendedBillWithFriends[] => {
  switch (filter) {
    case 'as_creator':
      return bills.filter((bill) => bill.creator_id === currentUserId);
    case 'you_owe':
      return bills.filter((bill) => {
        const userEntry = findFriendWithUserId(
          bill.bill_friends,
          currentUserId
        );
        return userEntry
          ? userEntry.amount_assigned - (userEntry.amount_paid || 0) > 0
          : false;
      });
    case 'all':
      return bills;
    default:
      return bills;
  }
};

export const getBillOwner = (
  bill_friends: BillFriend[],
  creator_id: string
) => {
  return bill_friends.find((friend) => friend.friend_id === creator_id);
};
