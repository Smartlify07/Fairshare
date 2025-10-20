import actions from "./actions";
import Store from "./store";
import state from "./state";
import mutations from "./mutations";
import queries from "./queries";
import { type State } from "./types/state.type";
const store = new Store<State>({
  actions,
  state,
  mutations,
  queries,
});
export default store;
