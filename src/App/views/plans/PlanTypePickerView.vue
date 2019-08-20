<template>
  <div class="plan_container">
    <div class="row justify-content-center w-100 w-sm-80">
      <spinner message="Loading plans..." :ready="plansReady">
        <div class="picker_greeting">
          <h1>Hello {{username}}!</h1>
          <p>What would you like to do today?</p>
        </div>
        <!-- FEATURED PLANS
        <div class="row ">
          <div class="col-12">
            <h2 class="row-title">Featured Plans</h2>
          </div>
        </div> -->

        <!-- <div class="row">
          <plan
            v-for="(plan, index) in featured"
            :plan="plan"
            :index="index"
            :key="index + 'featured'"
          />
        </div> -->

        <div class="row mt-4 plans">
          <PlanType v-for="plan in plans" :key="plan.formDefinitionId" :plan="plan" />
        </div>
      </spinner>
    </div>
  </div>
</template>

<script>
import PlanType from "../../components/Plans/PlanType";
import PlanTemplateCard from "@/App/components/Plans/PlanTemplateCard";

import {
  getAvailablePlanTypes,
  getFeaturedPlans
} from "@/Common/services/PlanService";
import Spinner from "../../components/Spinner";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "PlanPickerView",
  components: {
    PlanType,
    PlanTemplateCard,
    Spinner
  },
  computed: {
    ...mapGetters({
      username: "username"
    })
  },
  data() {
    return {
      plansReady: false,
      plans: [],
      featured: []
    };
  },
  created() {
    // Populate plans with image data
      getFeaturedPlans().then(plans => {
      this.featured = plans;
    });

    getAvailablePlanTypes().then(plans => {
      // Sort plans by order
      plans.sort((a, b) => b.order - a.order);

      // Set image data for each plan
      this.plans = plans.map(plan => {
        const imageProps = { alt: plan.formDefinitionName };

        if (plan.description) {
          if (plan.description.includes("growth")) {
            imageProps.name = "custom-plan";
          } else if (plan.description.includes("blank")) {
            imageProps.name = "blank-plan";
          } else if (plan.description.includes("ready")) {
            imageProps.name = "ready-plan";
          }
        } else {
          imageProps.name = "blank-plan";
        }

        plan.image = imageProps;
        return plan;
      });

      this.plansReady = true;
    });
  }
};
</script>

<style scoped lang="scss">
.plan_container {
  margin: 16px 24px;
}

h1 {
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 35px;

  color: #000000;
}

p {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 100%;

  color: #000000;
}

.picker_greeting {
  margin-bottom: 16px;
}

.plan-box-wrapper {
  text-align: center;
  display: flex;
}
</style>