type PubSubType = {
  events: any;
};

export default class PubSub {
  events: any;
  constructor() {
    this.events = {} as unknown as PubSubType['events'];
  }

  subscribe(event: PubSubType['events'], callback: () => void) {
    let self = this as unknown as PubSubType;
    if (!self.events.hasOwnProperty(event)) {
      self.events[event] = [];
    }

    return self.events[event].push(callback);
  }

  publish(event: PubSub['events'], data = {}) {
    let self = this;
    if (!self.events.hasOwnProperty(event)) {
      return [];
    }

    return self.events[event].map((callback: (data: any) => any) => {
      callback(data);
    });
  }
}
