<template>
  <div :class="[{'plan_wrapper_featured': plan.isFeatured}, 'plan_wrapper', 'fluid_text', 'pointer']" @click="picked(plan)">
    <div class="plan_box">
      <!-- Featured Star -->
      <img
        class="featured_star"
        v-if="isFeaturedPlan"
        src="../../assets/images/plans/plan_picker/featured_plan_star.svg"
      />

      <!-- Icon Img -->
      <img class="plan_icon" :src="planIconUrl"/>    

      <!-- Title-->
      <h2>{{ plan.formDefinitionName}}</h2>

      <!-- Desc -->
      <p>{{ plan.description }}</p>

      <!-- Button -->
      <button class="plan_button">Get Started</button>
    </div>
  </div>
</template>

<script>
import UpgradeModal from "@/App/components/Shared/modals/UpgradeModal";
import { mapGetters } from "vuex";
import featuredStar from "../../assets/images/plans/plan_picker/featured_plan_star.svg";

export default {
  name: "PlanTemplateCard",
  props: {
    plan: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  components: {
    UpgradeModal
  },
  computed: {
    ...mapGetters({
      isPremium: "isPremium",
      currentTeamId: "currentTeamId"
    }),
    isFeaturedPlan() {
      let feat = this.plan.categories.findIndex(c => c === "Featured Plans");

      return feat > -1 ? true : false;
    },
    planIconUrl() {
      if (!this.plan.options) {
        return "";
      }
      let opts = JSON.parse(this.plan.options)
      return opts.iconUrl;
    }
  },
  methods: {
    picked(plan) {
      if (!this.isPremium) {
        this.$emit("upgrade")
      } else {
        // this.$emit("plan-selected", { planId: plan.formDefinitionId });
        this.$router.push("/questions/" + this.plan.formDefinitionId);
      }
    },
    planIcon(options) {
      if (!options) {
        return "";
      }
      let opts = JSON.parse(options);
      return opts.icon;
    },
    style(order) {
      return `color: ${this.computedColor(
        order
      )}; border: 1px solid ${this.computedColor(order)};`;
    }
  }
};
</script>

<style scoped lang="scss">
.fluid_text {
  font-size: calc(4px + (10 - 4) * (100vw - 400px) / (1280 - 600));
}

.plan_wrapper {
  height: 21vw;
  max-height: 273px;
  background: #ffffff;
  border-radius: 30px;
  transition: 0.5s;

  .plan_box {
    height: 100%;
    padding: 12px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;

    .featured_star {
      position: absolute;
      right: 10px;
      top: 10px;
      height: 2.7em;
      max-height: 44px;
      min-height: 32px;
    }

    .plan_icon {
      font-size: 100%;
      height: 50%;
    }

    h2 {
      font-family: Roboto;

      margin: 0;
      font-weight: 420;
      font-size: 1.602em;
      line-height: 1.602em;
      color: #2f80ed;
    }

    p {
      font-family: "Open Sans";
      color: #2a2a2a;

      font-weight: 200;
      font-size: 1em;
      line-height: 1.5em;
      margin: 0;
      text-overflow: ellipsis;
      max-height: 4.5em;

      text-align: center;
    }

    .plan_button {
      background: #3e3e98;
      border-radius: 24px;
      border: none;

      font-family: "Open Sans";
      font-weight: normal;
      font-size: 1.125em;
      line-height: 1.5em;
      color: white;

      margin-top: auto;
      width: 11vw;
      min-width: 114px;
      max-width: 148px;
      padding: 0px 20px;
      height: 2.5em;
      // min-height: 32px;

      cursor: pointer;
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 8px 12px 28px rgba(108, 78, 78, 0.21);
  }
}

.pointer {
  cursor: pointer;
}

// full screen font sizes
@media (min-width: 1280px) {
  .plan_wrapper {
    .plan_box {
      h2 {
        font-size: 22px;
      }

      p {
        font-size: 12px;
      }

      .plan_button {
        font-size: 13px;
      }
    }
  }
}

@media (max-width: 680px) {
  .plan_wrapper {
    height: 48vw;
    width: 344px;
    max-height: 240px;

    margin-left: auto;
    margin-right: auto;

    .plan_box {
      h2 {
        font-size: 20px;
      }

      p {
        font-size: 10px;
      }

      .plan_button {
        font-size: 11px;
      }
    }
  }
}

// mobile screen sizes
@media screen and (max-width: 499px) {
  .plan_wrapper {
    height: 52vw;
    width: 100%;
    max-height: 220px;

    margin-left: auto;
    margin-right: auto;

    .plan_box {
      h2 {
        font-size: 4.2em;
      }

      p {
        font-size: 2.5em;
      }

      .plan_button {
        font-size: 2.8em;
        margin-bottom: 4px;
      }
    }

  }
}
</style>
