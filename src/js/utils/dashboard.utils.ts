import { getMonth, getYear } from 'date-fns';
import type { ExtendedBillWithFriends } from '../store/types/bills.type';
import { getMonthFromIsoString } from './date.utils';
import type { User } from '@supabase/supabase-js';
import currency from 'currency.js';
import { findFriendWithUserId } from './bills.utils';

export const getTotalBillsSplitThisMonth = (
  bills: ExtendedBillWithFriends[]
) => {
  const currentMonth = getMonth(new Date());
  return bills.filter(
    (bill) => getMonthFromIsoString(bill.created_at) === currentMonth
  ).length;
};

export const getTotalAmountShared = (
  bills: ExtendedBillWithFriends[]
): number => {
  const now = new Date();
  const currentMonth = getMonth(now);
  const currentYear = getYear(now);

  return bills.reduce((total, bill) => {
    const billDate = new Date(bill.created_at);
    if (
      getMonth(billDate) !== currentMonth ||
      getYear(billDate) !== currentYear
    ) {
      return total;
    }

    return total.add(bill.amount || 0);
  }, currency(0)).value;
};

export const getTotalAmountPaidThisMonth = (
  bills: ExtendedBillWithFriends[],
  user_id: User['id']
): number => {
  const now = new Date();
  const currentMonth = getMonth(now);
  const currentYear = getYear(now);

  return bills.reduce((total, bill) => {
    const billDate = new Date(bill.created_at);
    if (
      getMonth(billDate) !== currentMonth ||
      getYear(billDate) !== currentYear
    ) {
      return total;
    }

    const friend = findFriendWithUserId(bill.bill_friends, user_id);
    if (!friend || friend.amount_paid == null) return total;

    return total.add(friend.amount_paid);
  }, currency(0)).value;
};

export const getPendingBalanceForThisMonth = (
  bills: ExtendedBillWithFriends[],
  user_id: User['id']
) => {
  const now = new Date();
  const currentMonth = getMonth(now);
  const currentYear = getYear(now);

  return bills.reduce((total, bill) => {
    const billDate = new Date(bill.created_at);

    if (
      getMonthFromIsoString(bill.created_at) !== currentMonth ||
      getYear(billDate) !== currentYear
    ) {
      return total;
    }

    const userFriend = findFriendWithUserId(bill.bill_friends, user_id);
    if (!userFriend) return total;

    const assigned = currency(userFriend.amount_assigned || 0);
    const paid = currency(userFriend.amount_paid || 0);
    const pending = assigned.subtract(paid);

    return total.add(Math.max(0, pending.value));
  }, currency(0)).value;
};
