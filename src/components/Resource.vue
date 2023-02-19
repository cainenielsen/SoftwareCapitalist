<template>
  <div class="resource">
    <div class="resource-top-grid">
      <span>{{ data.name }}</span>
      <span>{{ data.earnings }} CUs</span>
      <span>X {{ data.count }}</span>
      <button @click="handleBuy">Buy &bull; ${{ data.baseCost }}</button>
    </div>
    <div class="resource-bottom-grid">
      <button @click="handleRun" :disabled='data.count === 0 || data.running === true'>Run</button>
      <span>
        <label for="file"></label>
        <progress id="file" :max="max" :value="data.progress"></progress>
      </span>
      <span>{{ data.progress / 100 }}%</span>
      <button :disabled="data.managed" @click="handleManage">Manage</button>
    </div>
  </div>
</template>
<script>
import { useGameStore } from "@/stores/game";
import { mapActions, mapState } from "pinia";

export default {
  props: ["id"],
  data() {
    return {
      max: 10000,
    };
  },
  mounted() {
    if (this.data.managed) {
      this.handleRun();
    }
  },
  computed: {
    ...mapState(useGameStore, {
      moneyUnits: 'moneyUnits',
      data(store) {
        return store.getResource(this.id);
      },
    }),
  },
  methods: {
    ...mapActions(useGameStore, ["addComputerUnits", "updateResource", "addUserUnits", "takeMoneyUnits"]),
    handleTick() {
      if (this.data.progress >= this.max) {
        clearInterval(this.tick);
        this.updateSelf({ progress: 0, running: false })
        this.handleComplete();
        if (this.data.managed) {
          this.handleRun();
        }
      } else {
        const newProgress = this.data.progress + this.data.speed;
        this.updateSelf({ progress: newProgress })
      }
    },
    handleRun() {
      if (this.data.running === false) {
        this.updateSelf({ running: true })
        this.tick = setInterval(this.handleTick, 1);
      }
    },
    handleComplete() {
      if (this.data.marketing) {
        this.addUserUnits(this.data.earnings * this.data.count);
      } else {
        this.addComputerUnits(this.data.earnings * this.data.count);
      }
    },
    updateSelf(state) {
      this.updateResource(this.id, state)
    },
    handleBuy() {
      if (this.moneyUnits >= this.data.baseCost) {
        this.updateSelf({ count: this.data.count += 1 })
        this.takeMoneyUnits(this.data.baseCost)
      } else {
        alert(`not enough money, costs $${this.data.baseCost}`)
      }
    },
    handleManage() {
      if (this.moneyUnits >= this.data.manageCost) {
        this.updateSelf({ managed: true })
        this.takeMoneyUnits(this.data.manageCost)
      } else {
        alert(`not enough money, costs $${this.data.manageCost}`)
      }
    }
  },
  unmounted() {
    clearInterval(this.tick);
  },
};
</script>

<style scoped>
.resource {
  border-radius: 24px;
  margin-top: 24px;
  overflow: hidden;
}

.resource-top-grid {
  display: grid;
  grid-template-columns: 1fr min-content min-content min-content;
  justify-content: space-between;
  grid-column-gap: 24px;
  padding: 24px;
  background-color: orange;
}

.resource-bottom-grid {
  display: grid;
  grid-template-columns: min-content 256px 64px min-content;
  justify-content: space-between;
  grid-column-gap: 24px;
  padding: 24px;
  background-color: rgb(255, 207, 117);
}

.resource * {
  white-space: nowrap;
}

progress[value] {
  /* Reset the default appearance */
  -webkit-appearance: none;
   appearance: none;

   width: 100%;
}

progress[value]::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 2px;
}

progress[value]::-webkit-progress-value {
  background-color: dodgerblue;
}
</style>
