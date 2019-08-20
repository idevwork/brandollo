
<template>
  <div class="col-flex status-container">
    <h3>{{plan.label}}</h3>

    <div class="row justify-content-center">
      <a
        class="plan_button col-4"
        v-if="permissions.changeteam"
        @click="renamePlanWarning($event, plan)"
      >
        <font-awesome-icon title="Rename action" icon="pencil-alt" class="cursor-pointer"></font-awesome-icon>
        <div>Rename</div>
      </a>
      <a class="col-4 plan_button" v-if="permissions.changeteam" @click="removePlanWarning($event, plan)">
        <font-awesome-icon title="Delete action" icon="trash" class="cursor-pointer"></font-awesome-icon>
        <div>Remove</div>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import notificationMixin from "@/Common/mixins/Notification";

export default {
  mixins: [notificationMixin],
  name: "plan-details",
  props: {
    plan: Object
  },
  computed: {
    ...mapState({
      permissions: state => state.teamStore.currentPermissions
    }),
    ...mapGetters({
      team: "currentTeamId"
    })
  },
  methods: {
    ...mapActions({
      removePlan: "removePlan",
      updatePlan: "updatePlan"
    }),
    removePlanWarning(event, plan) {
      this.$swal({
        title: "Are you sure, you want to delete this plan?",
        text: plan.label,
        showConfirmButton: true,
        showCancelButton: true
      }).then(data => {
        if (!data.dismiss) {
          this.removePlan({ planId: plan.id, teamId: this.team }).then(res => {
            this.showToast("Plan deleted!", "success");
          });
        }
      });
    },
    renamePlanWarning(event) {
      this.$swal({
        title: "Change Plan Name:",
        text: `Current name: ${this.plan.label}`,
        input: "text",
        inputValue: this.plan.label,
        inputPlaceHolder: "Enter a new plan name",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Change"
      }).then(data => {
        if (data.value.length > 0) {
          console.log("it exists?");
          let updatedPlan = {
            ...this.plan,
            label: data.value
          };
          this.updatePlan({ teamId: this.team, plan: updatedPlan }).then(
            res => {
              this.showToast("Plan name changed!", "success");
            }
          );
        } else if (data.value === this.plan.label) {
          this.showToast("Plan name not changed", "error");
        } else {
          this.showToast("A plan name can't be empty", "error");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}
.col-flex {
  display: flex;
  flex-direction: column;
}

.status-container {
  padding: 0px 10px 20px 10px;
  width: 300px;
  a {
    cursor: pointer;
  }
}
// .status-container > div {
//   text-align: center;
//   padding: 10px 20px;
//   cursor: pointer;
//   transition: all 0.25s;
// }
// .status-container > div:hover {
//   background-color: rgb(228, 228, 228);
// }

.plan_button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.25s;

  height: 24px;

  &:hover {
    background-color: rgb(228, 228, 228);
  }
}
</style>
