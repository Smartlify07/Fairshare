import type Store from './store';
import type { State } from './types/state.type';

type StoreType = Store<State>;
export default {
  getUser: (context: StoreType) => {
    context.query('getUser');
  },

  getProfile: (context: StoreType) => {
    context.query('getUserProfile');
  },
  getBills: (context: StoreType) => {
    context.query('getBills');
  },

  getFriends: (context: StoreType) => {
    context.query('getFriends');
  },

  getSuggestedFriends: (context: StoreType) => {
    context.query('getSuggestedFriends');
  },

  getFriendRequests: (context: StoreType) => {
    context.query('getFriendRequests');
  },

  createBill: (context: StoreType, payload: any) => {
    context.commit('createBill', payload);
  },

  updateSelectedBill: (context: StoreType, payload: any) => {
    context.commit('updateSelectedBill', payload);
  },

  updateSelectedFriendsToSplitWith: (
    context: StoreType,
    payload: State['selectedFriendsToSplitWith']
  ) => {
    context.commit('updateSelectedFriendsToSplitWith', payload);
  },

  updateBillStatus: (context: StoreType, payload: any) => {
    context.commit('updateBillStatus', payload);
  },

  updateSelectedFilter: (
    context: StoreType,
    payload: State['selectedFilter']
  ) => {
    context.commit('updateSelectedFilter', payload);
  },
};
