import type { User } from '@supabase/supabase-js';
import type {
  BillFriend,
  ExtendedBillWithFriends,
} from '../store/types/bills.type';
import currency from 'currency.js';

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
  if (!totalAmount || totalAmount <= 0) return 0;
  const totalPaid = bill_friends.reduce(
    (acc, curr) => acc.add(curr.amount_paid || 0),
    currency(0)
  );
  const percentage = totalPaid.divide(totalAmount).multiply(100);

  return Number(percentage.value.toFixed(2));
};

export const calculateUserOwedAmount = (
  billFriends: BillFriend[],
  currentUserId: User['id']
): number => {
  const userEntry = findFriendWithUserId(billFriends, currentUserId);
  if (!userEntry) return 0;
  const assigned = currency(userEntry.amount_assigned || 0);
  const paid = currency(userEntry.amount_paid || 0);
  const owed = assigned.subtract(paid);
  return Math.max(0, owed.value);
};

export const splitBill = (totalAmount: number, friendsCount: number) => {
  const total = currency(totalAmount, { precision: 2 });
  const baseShare = total.divide(friendsCount); // evenly divides
  const payments = [];

  // Step 1: Compute base shares (floored to smallest unit)
  for (let i = 0; i < friendsCount; i++) {
    payments.push(baseShare);
  }

  // Step 2: Compute correction for rounding drift
  const sumShares = payments.reduce((sum, p) => sum.add(p), currency(0));

  const diff = total.subtract(sumShares);

  // Step 3: Distribute any leftover cents/kobo
  let remainderCents = Math.round(diff.intValue); // in cents/kobo
  for (let i = 0; remainderCents > 0; i++, remainderCents--) {
    payments[i] = payments[i].add(currency(0.01));
  }

  // Step 4: Return clean formatted strings
  return payments.map((p) => p.value);
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
