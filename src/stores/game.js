import { defineStore } from 'pinia'

class Resource {
  constructor(config) {
    const { name, earnings, speed, count = 0, marketing = false, baseCost, running = false, manageCost } = config
    this.name = name;
    this.earnings = earnings;
    this.speed = speed;
    this.progress = 0;
    this.count = count;
    this.unlocked = false;
    this.managed = false;
    this.marketing = marketing;
    this.baseCost = baseCost;
    this.running = running;
    this.manageCost = manageCost;
  }
}

const resourceTable = new Map()

const addResource = (resource) => {
  const { ...resourceData } = resource
  resourceTable.set(crypto.randomUUID(), resourceData)
};

addResource(
  new Resource({
    name: "database",
    speed: 10,
    earnings: 1000,
    count: 1,
    baseCost: 50,
    manageCost: 1000
  })
);

addResource(
  new Resource({
    name: "caching",
    speed: 10,
    earnings: 500,
    baseCost: 50,
    manageCost: 1000
  })
);

addResource(
  new Resource({
    name: "automated back ups",
    speed: 10,
    earnings: 500,
    baseCost: 50,
    manageCost: 1000
  })
);

addResource(
  new Resource({
    name: "ssl",
    speed: 10,
    earnings: 500,
    baseCost: 50,
    manageCost: 1000
  })
);

addResource(
  new Resource({
    name: "waf",
    speed: 10,
    earnings: 500,
    baseCost: 50,
    manageCost: 1000
  })
);

addResource(
  new Resource({
    name: "graphql",
    speed: 10,
    earnings: 2500,
    baseCost: 50,
    manageCost: 1000
  })
);

addResource(
  new Resource({
    name: "marketing",
    speed: 10,
    earnings: 10,
    count: 1,
    baseCost: 50,
    manageCost: 1000,
    marketing: true
  })
);

export const useGameStore = defineStore('game', {
  state: () => ({
    computerUnits: 0,
    userUnits: 0,
    moneyUnits: 0,
    resources: resourceTable
  }),
  getters: {
    resourceKeys: (state) => Array.from(state.resources.keys()),
    getResource: (state) => (id) => state.resources.get(id),
  },
  actions: {
    addComputerUnits(cu) {
      this.computerUnits += cu
    },
    takeComputerUnits(cu) {
      this.computerUnits -= cu
    },
    addUserUnits(uu) {
      this.userUnits += uu
    },
    takeUserUnits(uu) {
      this.userUnits -= uu
    },
    addMoneyUnits(mu) {
      this.moneyUnits += mu
    },
    takeMoneyUnits(mu) {
      this.moneyUnits -= mu
    },
    updateResource(id, newState) {
      const thisResource = this.getResource(id);
      this.resources.set(id, { ...thisResource, ...newState });
    }
  }
})
