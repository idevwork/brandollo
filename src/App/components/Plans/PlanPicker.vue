<template>
  <spinner
    message="Loading lots of options for you.."
    :ready="Boolean(readyPlans && readyPlans.length)"
    spinner-class-name="pt-4"
  >
    <div class="plan_picker">
      <div class="plan_descriptor">
        <p>
          <span>
            <router-link
              style="color: black"
              class="pointer"
              :to="{ name: 'plan-create-more'}"
            >Create /</router-link>
          </span> Plan Templates
        </p>
        <h1>Hey {{username}},</h1>
        <h4>Plan Templates are personalised for your business and will include recommended actions, timelines and learning content. You can create more than one plan</h4>
      </div>

      <!--  Plans grid  -->
      <div class="plan_container">
        <PlanTemplateCard v-for="(plan, index) in readyPlans" :plan="plan" :index="index" :key="index" @upgrade="showUpgradeModal"/>
      </div>

      <!-- Back to create button -->
      <div class="plan_return">
        <h4>Not sure what you're looking for?</h4>
        <router-link style="color: black" :to="{ name: 'plan-create-more'}">
          <button class="plan_return_button">Back to Create</button>
        </router-link>
      </div>
    </div>
    <upgrade-modal ref="upgrade" type="plan-item" />
  </spinner>
</template>

<script>
import { getAvailablePlans } from "@/Common/services/PlanService";
import PlanTemplateCard from "@/App/components/Plans/PlanTemplateCard";
import Spinner from "@/App/components/Spinner.vue";
import UpgradeModal from "@/App/components/Shared/modals/UpgradeModal";
import { mapGetters } from "vuex";

export default {
  name: "Plan-Picker",
  components: {
    Spinner,
    UpgradeModal,
    PlanTemplateCard
  },
  data() {
    return {
      readyPlans: []
    };
  },
  computed: {
    ...mapGetters({
      username: "username"
    })
  },
  mounted() {
    getAvailablePlans().then(plans => {
      this.readyPlans = plans;
      this.readyPlans.forEach(p => {
        let isFeatured =
          p.categories.findIndex(c => c === "Featured Plans") > -1
            ? true
            : false;

        p.isFeatured = isFeatured;
      });

      // sort featured plans first
      this.readyPlans.sort((a, b) => {
        return b.isFeatured - a.isFeatured;
      });
    });
  },
  methods: {
    showUpgradeModal() {
      this.$refs.upgrade.show();
    }
  }
};
</script>

<style scoped lang="scss">
.plan_picker {
  margin: 1vh 3vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .plan_descriptor {
    width: 100%;
    max-width: 1280px;

    font-size: calc(4px + (8 - 4) * (100vw - 400px) / (1280 - 360));

    p {
      font-family: "Open Sans";
      font-weight: normal;
      font-size: 1.5em;
    }

    h1 {
      font-family: Roboto;
      font-weight: 420;
      font-size: 3em;
      line-height: 1em;
    }

    h4 {
      font-family: "Open Sans";
      font-weight: normal;
      font-size: 2em;
    }
  }

  .plan_container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 2vh;
    grid-column-gap: 3vw;
    margin: 16px 0;

    max-width: 1280px;
  }

  .plan_return {
    margin-top: 24px;

    width: 100%;
    max-width: 1280px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    h4 {
      font-family: "Open Sans";
      font-weight: normal;
      font-size: 1.2em;
    }

    .plan_return_button {
      margin-left: 16px;
      background: #ff647c;
      border-radius: 24px;
      border: none;

      font-family: "Open Sans";
      font-weight: normal;
      font-size: 1.125em;
      line-height: 1.5em;
      color: white;

      margin-top: auto;
      width: auto;
      min-width: 114px;
      padding: 0px 24px;
      height: 2.5em;
      cursor: pointer;

      transition: 0.5s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(108, 78, 78, 0.21);
      }
    }
  }
}

@media (max-width: 680px) {
  .plan_picker {
    .plan_descriptor {
      p {
        font-size: 12px;
      }

      h1 {
        font-size: 24px;
      }

      h4 {
        font-size: 16px;
      }
    }

    .plan_container {
      grid-template-columns: repeat(1, 66vw);
    }

    .plan_return {
      margin-top: 8px;
      margin-left: auto;
      margin-right: auto;
      width: auto;

      justify-content: center;
      flex-direction: column;

      h4 {
        font-size: 1em;
      }

      .plan_return_button {
        margin: 0;
        font-size: 1em;
        width: auto;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .plan_picker {
    margin: 1vh 2vw;

    .plan_container {
      grid-template-columns: repeat(1, 90vw);
    }

    .plan_return {
      margin-top: 8px;
      margin-left: auto;
      margin-right: auto;
      width: auto;

      justify-content: center;
      flex-direction: column;

      h4 {
        font-size: 1em;
      }

      .plan_return_button {
        margin: 0;
        font-size: 1em;
        width: auto;
      }
    }
  }
}
</style>
