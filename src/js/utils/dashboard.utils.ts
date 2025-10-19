import { getMonth } from "date-fns";
import type { ExtendedBillWithFriends } from "../store/types/bills.type";
import { getMonthFromIsoString } from "./date.utils";
import type { User } from "@supabase/supabase-js";

export const getTotalBillsSplitThisMonth = (
  bills: ExtendedBillWithFriends[]
) => {
  const currentMonth = getMonth(new Date());
  return bills.filter(
    (bill) => getMonthFromIsoString(bill.created_at) === currentMonth
  ).length;
};

export const getTotalAmountShared = (bills: ExtendedBillWithFriends[]) => {
  const currentMonth = getMonth(new Date());

  return bills
    .filter((bill) => getMonthFromIsoString(bill.created_at) === currentMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);
};

export const getTotalAmountPaidThisMonth = (
  bills: ExtendedBillWithFriends[],
  user_id: User["id"]
) => {
  const currentMonth = getMonth(new Date());

  return bills.reduce((total, bill) => {
    if (getMonthFromIsoString(bill.created_at) !== currentMonth) {
      return total;
    }

    for (let friend of bill.bill_friends) {
      if (friend.amount_paid !== null && friend.friend_id === user_id) {
        total += friend.amount_paid;
      }
    }
    return total;
  }, 0);
};

export const getPendingBalanceForThisMonth = (
  bills: ExtendedBillWithFriends[],
  user_id: User["id"]
) => {
  const currentMonth = getMonth(new Date());
  return bills.reduce((total, bill) => {
    if (getMonthFromIsoString(bill.created_at) !== currentMonth) {
      return total;
    }
    for (let friend of bill.bill_friends) {
      if (
        friend.friend_id === user_id &&
        friend.amount_paid! <= friend.amount_assigned
      ) {
        total += friend.amount_assigned - (friend.amount_paid ?? 0);
      }
    }
    return total;
  }, 0);
};
