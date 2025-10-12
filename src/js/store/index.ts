import actions from './actions';
import Store from './store';
import state from './state';
import mutations from './mutations';
import queries from './queries';
const store = new Store({
  actions,
  state,
  mutations,
  queries,
});
export default store;
