<template>
  <!-- Default mode -->
  <span v-if="!detailsMode">
    <div v-if="permission || action.assignedUserId == userDetails.profile.sub">
      <p-check
        v-if="showSquare"
        name="check"
        color="info"
        class="p-icon p-jelly p-bigger"
        :modelValue="action.completed"
        v-on:change="stateChanged"
      >
        <font-awesome-icon slot="extra" icon="check" class="icon"/>
      </p-check>
      <p-check
        v-else
        name="check"
        color="success"
        class="p-icon p-round p-jelly p-bigger"
        :modelValue="action.completed"
        v-on:change="stateChanged"
      >
        <font-awesome-icon slot="extra" icon="check" class="icon"/>
      </p-check>
    </div>

    <p-check
      v-else
      name="check"
      color="success"
      class="p-icon p-round p-jelly p-bigger"
      v-model="action.completed"
      disabled
    >
      <font-awesome-icon slot="extra" icon="check" class="icon"/>
    </p-check>
  </span>

  <!-- Details mode -->
  <span v-else class="toggle-action">
    <button
      :class="['toggle-action-status', { 'action-status-complete': action && action.completed }]"
      @click="stateChanged(!action.completed)"
      :disabled="!permission && action.assignedUserId !== userDetails.profile.sub"
    >
      {{ action && action.completed ? "Mark Uncomplete" : "Mark Complete" }}
    </button>
  </span>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PrettyCheck from "pretty-checkbox-vue/check";
import completeDing from "@/App/assets/audio/complete.wav";

export default {
  components: {
    "p-check": PrettyCheck
  },
  props: {
    "permission": null,
    "action": {
      type: Object,
      default: () => {}
    },
    "showSquare": null,
    "detailsMode": {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState({
      userDetails: state => state.userStore.user
    })
  },
  methods: {
    ...mapActions({
      completeAction: "finishAction",
      cancelAction: "cancelAction"
    }),
    // Change action status
    stateChanged(payload) {
      if (payload) {
        var audio = new Audio(completeDing);
        audio.volume = 0.7;
        audio.play();
        this.completeAction(this.action);
      } else {
        this.cancelAction(this.action);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../scss/dashboard/variables';

.toggle-action {
  flex-shrink: 0;
}

.toggle-action-status {
  padding: 5px;
  border-radius: 5px;
  font-size: 14px;
  color: white;
  background: #C4C4C4;
  border: none;
  cursor: pointer;
}

.action-status-complete {
  background-color: $custom;
}
</style>
