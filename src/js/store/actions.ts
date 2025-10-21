import type Store from "./store";
import type { State } from "./types/state.type";

type StoreType = Store<State>;
export default {
  getUser: (context: StoreType) => {
    context.query("getUser");
  },

  getProfile: (context: StoreType) => {
    context.query("getUserProfile");
  },
  getBills: (context: StoreType) => {
    context.query("getBills");
  },

  getFriends: (context: StoreType) => {
    context.query("getFriends");
  },

  createBill: (context: StoreType, payload: any) => {
    context.commit("createBill", payload);
  },

  updateSelectedBill: (context: StoreType, payload: any) => {
    context.commit("updateSelectedBill", payload);
  },

  updateSelectedFriendsToSplitWith: (
    context: StoreType,
    payload: State["selectedFriendsToSplitWith"]
  ) => {
    context.commit("updateSelectedFriendsToSplitWith", payload);
  },

  updateBillStatus: (context: StoreType, payload: any) => {
    context.commit("updateBillStatus", payload);
  },
};
