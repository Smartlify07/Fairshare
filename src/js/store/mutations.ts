import type { State } from './types/state.type';

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
    console.log(state);
    return state;
  },
};
