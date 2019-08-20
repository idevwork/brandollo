<template>
  <!-- Plan progress dropdown -->
  <b-dropdown
    class="plan-dropdown"
    variant="none p-0"
    v-if="action && plansforChange(action.planId).length"
    no-caret
    :right="right"
  >
    <template slot="button-content">
      <div
        :style="planProgressStyle(action.planId)"
        style="display: flex; justify-content: flex-start; align-items: center;"
      >
        <div>
          {{action.planName || getPlanNameById(action.planId)}}
          <span>[{{completeActions(action.planId)}}%]</span>
        </div>
        <div class="progress_caret">
          <font-awesome-icon class="show-hover" icon="caret-down" style="color: gray; font-size: 16px" />
        </div>
      </div>
    </template>

    <b-dropdown-item
      v-for="plan in plansforChange(action.planId)"
      :key="plan.id"
      @click.prevent="changePlanForAction(action, plan)"
    >{{ plan.label }}</b-dropdown-item>
  </b-dropdown>

  <!-- Plan progress -->
  <div v-else-if="action" :style="planProgressStyle(action.planId)">
    <div>
      {{action.planName || getPlanNameById(action.planId)}}
      <span>[{{completeActions(action.planId)}}%]</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import notificationMixin from "@/Common/mixins/Notification";

export default {
  name: "PlanDropdown",
  mixins: [notificationMixin],
  props: {
    action: {
      type: Object,
      default: () => {}
    },
    right: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapGetters({
      completeActions: "planCompleteCount",
      plansforChange: "plansExceptId",
      getActionById: "getActionbyId",
      getPlanById: "getPlanbyId",
      getPlanColor: "getPlanColor"
    })
  },
  methods: {
    ...mapActions({
      changePlan: "changePlan"
    }),

    // Get plan progress color
    planProgressStyle(planId) {
      return { color: this.getPlanColor(planId) };
    },

    // Get plan name by plan id
    getPlanNameById(planId) {
      if (!planId) {
        return "";
      }
      const plan = this.getPlanById(planId);
      return (plan && plan.label) || "";
    },

    // Change plan
    changePlanForAction(activity, plan) {
      this.changePlan({ activity, plan })
        .then(() => this.showToast("Plan was successfully changed"))
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.show-hover {
  display: none;
}

.plan-dropdown:hover {
  .show-hover {
    display: inline-flex;;
  }
}

.progress_caret {
  width: 20px;
}
</style>