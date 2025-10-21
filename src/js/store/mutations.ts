import type { BillFriend } from "./types/bills.type";
import type { State } from "./types/state.type";

export default {
  setQueryResult(state: State, payload: any) {
    return Object.assign({}, state, payload);
  },

  createBill(state: State, payload: any) {
    state.bills.push(payload);
    return state;
  },

  updateSelectedBill(state: State, payload: any) {
    state.selectedBill = payload;
    return state;
  },
  updateSelectedFriendsToSplitWith(
    state: State,
    payload: State["selectedFriendsToSplitWith"]
  ) {
    state.selectedFriendsToSplitWith = payload;
    return state;
  },
  updateBillStatus(state: State, payload: BillFriend) {
    const updatedBills = state.bills.map((bill) => {
      return bill.id === payload.bill_id
        ? {
            ...bill,
            bill_friends: bill.bill_friends.map((friend) =>
              friend.friend_id === payload.friend_id
                ? { ...friend, ...payload }
                : friend
            ),
          }
        : bill;
    });
    state.bills = updatedBills;
    return state;
  },
};
