<template>
  <modal v-model="showModal">
    <div class="upgrade-wrapper">
      <div class="upgrade-inner">
        <h2>{{content[type].title}}</h2>
        <p>{{content[type].body}}</p>
        <!-- <button @click="clicked" > -->
        <a :href="this.destination" class="modal-default-button">{{content[type].buttonText}}</a>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from "@/Common/components/Modal";
import { mapState } from "vuex";
import settings from "@/settings";

export default {
  name: "Upgrade-Modal",
  props: ["type"],
  components: {
    modal: Modal
  },
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    ...mapState({
      teamId: s => s.teamStore.currentTeamId
    }),
    content() {
      return {
        "learn-item": {
          title: "This feature is only available to paid accounts.",
          body: " Would you like to access? Upgrade now.",
          buttonText: "Upgrade your account",
          buttonDestination: "",
          redirect: `${settings.host}/app/${this.teamId}/actions-list`
        },
        "plan-item": {
          title: "This feature is only available to paid accounts.",
          body: " Would you like to access? Upgrade now.",
          buttonText: "Upgrade your account",
          redirect: `${settings.host}/app/${this.teamId}/plan/create/packaged`
        },
        "custom-plan-item": {
          title: "This feature is only available to paid accounts.",
          body: " Would you like to access? Upgrade now.",
          buttonText: "Upgrade your account",
          redirect: `${settings.host}/app/${this.teamId}/plan/create-more`
        },
        "article-item": {
          title: "This feature is only available to paid accounts.",
          body: " Would you like to access? Upgrade now.",
          buttonText: "Upgrade your account",
          redirect: `${settings.host}/app/${this.teamId}/learn`
        }
      };
    },
    destination() {
      return `${settings.host}/${
        this.teamId
      }/upgrade?redirect=${encodeURIComponent(
        this.content[this.type].redirect
      )}`;
    }
  },
  mounted() {
    let that = this;
  },
  methods: {
    clicked() {},
    show() {
      this.showModal = true;
    },
    hide() {
      this.showModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.upgrade-wrapper {
  text-align: center;
  display: flex;

  img {
    width: 50px;
    height: 50px;
  }

  h2 {
    margin-top: 30px;
    font-weight: bold;
    font-size: 25px;
    color: #54534f;
  }

  p {
    color: #2a2a2a;
    margin-top: 20px;
    font-weight: 300;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  a {
    background: linear-gradient(74.9deg, #4796c4 -2.08%, #28c0e0 103.33%);
    box-shadow: 8px 12px 28px rgba(56, 170, 209, 0.22);
    border-radius: 7px;
    color: white;
    border: none;
    font-weight: bold;
    font-size: 18px;
    line-height: 27px;
    margin-top: auto;
    width: 200px;
    height: 45px;
    cursor: pointer;
    padding-top: 8px;
  }

  .upgrade-inner {
    padding: 50px 20px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    // box-shadow: 8px 12px 28px rgba(108, 78, 78, 0.21);
    border-radius: 20px;
    width: 100%;
    cursor: pointer;
    transition: 0.5s;

    &:hover {
      transform: translateY(-10px);
    }
  }
}
</style>
