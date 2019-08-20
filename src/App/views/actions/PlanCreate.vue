<template>
  <spinner :ready="isReady">
    <div class="page">
      <plan-picker v-on:plan-selected="planSelected" />
    </div>
  </spinner>
</template>

<script>
import Spinner from "@/App/components/Spinner";
import PlanPicker from "@/App/components/Plans/PlanPicker.vue";

import { mapGetters } from "vuex";

export default {
  name: "create-plan",
  components: {
    spinner: Spinner,

    planPicker: PlanPicker
  },
  data() {
    return {
      isReady: false
    };
  },
  ...mapGetters({
    isPremium: "isPremium",
    isTrial: "isTrial",
    isFree: "isFree",
    currentTeamId: "currentTeamId"
  }),
  mounted() {
    let that = this;
    this.isReady = true;
  },
  methods: {
    planSelected(plan) {
      if (!this.isPremium) {
      }
      this.$router.push("/questions/" + plan.planId);
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
}
</style>
