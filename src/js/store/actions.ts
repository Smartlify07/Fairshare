import type Store from './store';

export default {
  getUser: (context: Store) => {
    context.query('getUser');
  },

  getBills: (context: Store) => {
    context.query('getBills');
  },

  getFriends: (context: Store) => {
    context.query('getFriends');
  },

  createBill: (context: Store, payload: any) => {
    context.commit('createBill', payload);
  },

  updateSelectedBill: (context: Store, payload: any) => {
    context.commit('updateSelectedBill', payload);
  },

  updateBillStatus: (context: Store, payload: any) => {
    context.commit('updateBillStatus', payload);
  },
};
