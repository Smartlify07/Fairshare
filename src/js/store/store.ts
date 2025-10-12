import PubSub from '../lib/pubsub';

export default class Store {
  actions: Record<string, any> = {};
  mutations: Record<string, any> = {};
  status: string = 'resting';
  state: any;
  events: any;
  queries: any;
  constructor(params: Record<string, any>) {
    let self = this;
    self.actions = {};
    self.mutations = {};
    self.queries = {};
    self.status = 'resting';
    self.state = {};
    self.events = new PubSub();

    if (params.hasOwnProperty('actions')) {
      self.actions = params.actions;
    }

    if (params.hasOwnProperty('mutations')) {
      self.mutations = params.mutations;
    }

    if (params.hasOwnProperty('queries')) {
      self.queries = params.queries;
    }

    self.state = new Proxy(params.state || {}, {
      set: function (state, key, value) {
        state[key] = value;
        self.events.publish('stateChange', self.state);
        if (self.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${String(key)}`);
        }
        self.status = 'resting';

        return true;
      },
      get: function (state, key) {
        return state[key];
      },
    });
  }

  dispatch(actionKey: string, payload: any) {
    let self = this;
    if (typeof self.actions[actionKey] !== 'function') {
      console.error(`Action "${actionKey}" doesn't exist`);
      return false;
    }

    console.groupCollapsed(`ACTION: ${actionKey}`);
    self.status = 'action';
    self.actions[actionKey](self, payload);
    console.groupEnd();
    return true;
  }

  commit(mutationKey: string, payload: any) {
    let self = this;

    if (typeof self.mutations[mutationKey] !== 'function') {
      return false;
    }
    self.status = 'mutation';
    let newState = self.mutations[mutationKey](self.state, payload);
    self.state = Object.assign(self.state, newState);

    return true;
  }

  async query(queryKey: string) {
    let self = this;
    self.status = 'query';

    try {
      const result = await self.queries[queryKey](self.state);

      self.commit('setQueryResult', result);
      self.status = 'resting';
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
