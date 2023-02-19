<template>
  <div class="display">
    <span>CUs: {{ computerUnits }}</span>
    <span>Users: {{ userUnits }}</span>
    <span>Money: {{ currencyFormat.format(moneyUnits) }}</span>
  </div>
  <div id="stack">
    <Resource
      v-for="resourceKey in resourceKeys"
      :key="resourceKey"
      :id="resourceKey"
    />
  </div>
</template>

<script>
import Resource from "@/components/Resource.vue";
import { useGameStore } from "@/stores/game";
import { mapState, mapActions } from "pinia";

export default {
  components: {
    Resource,
  },
  data() {
    return {
      currencyFormat: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    };
  },
  computed: {
    ...mapState(useGameStore, [
      "computerUnits",
      "userUnits",
      "moneyUnits",
      "resourceKeys",
    ]),
  },
  mounted() {
    this.tick = setInterval(this.handleTick, 1000);
  },
  methods: {
    ...mapActions(useGameStore, [
      "takeComputerUnits",
      "takeUserUnits",
      "addMoneyUnits",
    ]),
    handleTick() {
      let userCount = this.userUnits;
      while (userCount > 0) {
        userCount -= 1;
        if (this.computerUnits >= 1000) {
          this.takeComputerUnits(1000);
          this.addMoneyUnits(10);
        } else {
          this.takeUserUnits(1);
        }
      }
    },
  },
  unmounted() {
    clearInterval(this.tick);
  },
};
</script>

<style scoped>
#stack {
  margin: auto;
  display: grid;
  justify-content: center;
}
.display {
  display: grid;
  grid-template-columns: min-content min-content min-content;
  margin: auto;
  justify-content: center;
  grid-gap: 64px;
}
.display * {
  white-space: nowrap;
}
</style>
