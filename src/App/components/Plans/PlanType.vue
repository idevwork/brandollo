<template>
  <div class="col-md-4 col-sm-6 plan-outer">
    <div class="plan-wrapper">
      <div class="plan-inner" @click="navigateToPlan(plan.formDefinitionId)">
        <img :src="imagePath" :alt="plan.image.alt" />
        <h2>{{ plan.formDefinitionName}}</h2>
        <p>{{ plan.description }}</p>
        <button>Start Planning</button>
      </div>
      <upgrade-modal ref="upgrade" type="custom-plan-item" />
    </div>
  </div>
</template>

<script>
import UpgradeModal from "@/App/components/Shared/modals/UpgradeModal";
import { mapGetters } from "vuex";

export default {
  name: "Plan",
  props: {
    plan: {
      type: Object
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
    imagePath() {
      return require(`../../assets/images/plans/${this.plan.image.name}.svg`);
    }
  },
  methods: {
    navigateToPlan(id) {
      if (!id) {
        this.$router.push({ name: "create-ready-plan" });
      } else {
        if (id == 36 && !this.isPremium) {
          this.$refs.upgrade.show();
        } else {
          this.$router.push("/questions/" + id);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.plan-outer {
  margin: 8px 0px;
  width: 45vh;
  max-height: 500px;
  height: 60vh;
}

.plan-wrapper {
  text-align: center;
  display: flex;
  // min-width: 260px;
  width: 100%;
  height: 100%;

  img {
    width: 90%;
    max-width: 440px;
  }

  h2 {
    font-family: Roboto;

    margin-top: 12px;
    font-weight: 420;
    font-size: 28px;
    color: #2f80ed;
  }

  p {
    font-family: "Open Sans";
    color: #2a2a2a;

    font-weight: 200;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  button {
    background: #3e3e98;
    border-radius: 24px;
    border: none;

    font-family: "Open Sans";
    font-weight: bold;
    font-size: 18px;
    line-height: 175.78%;
    color: white;

    margin-top: auto;
    width: 176px;
    padding: 0px 20px;
    height: 40px;

    cursor: pointer;
  }

  .plan-inner {
    padding: 16px 12px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    border-radius: 20px;
    width: 100%;
    max-width: 460px;
    cursor: pointer;
    transition: 0.5s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 8px 12px 28px rgba(108, 78, 78, 0.21);
    }
  }
}
</style>