<template>
  <div
    :class="['flex-list', { 
      'split-view': $route.meta.splitView, 
    'timeline-view': $route.name == 'gantt-timeline' }]"
  >
    <!-- Actions table -->
    <div :class="['table', { 'd-none': splitViewMobile }]" :style="splitStyle">
      <!-- Header row -->
      <div class="header">
        <!-- Status -->
        <div class="grid-col">
          <popper trigger="hover" :options="{placement: 'top'}">
            <div class="popper">
              Current status of the action.
              <br />Pending: action ready to be worked on.
              <br />Active: Someone is currently working on completing this action.
              <br />Completed: Action was finished succesfully.
            </div>
            <span slot="reference">Complete</span>
          </popper>
        </div>

        <!-- Action title -->
        <div class="action-col text-left">
          <popper trigger="hover" :options="{placement: 'top'}">
            <div class="popper">
              Name of the Action. Click on the title to see details,
              <br />or click on ? to learn more about the action
            </div>
            <span slot="reference">Next Activity</span>
          </popper>
        </div>

        <!-- Learn how -->
        <div class="grid-col toggle-timeline-column">
          <popper trigger="hover" :options="{placement: 'top'}">
            <div class="popper">Learn more about action</div>
            <span slot="reference">Learn How</span>
          </popper>
        </div>

        <!-- Plan progress -->
        <div class="plan-col toggle-column text-left d-none d-sm-block">
          <popper trigger="hover" :options="{placement: 'top'}">
            <div class="popper">The plan the action belongs to</div>
            <span slot="reference">Plan Progress</span>
          </popper>
        </div>

        <!-- Date start REMOVED TO FOLLOW UX DESIGN
        <div class="grid-col toggle-column d-none d-sm-block">
          <popper trigger="hover" :options="{placement: 'top'}">
            <div
              class="popper"
            >When you should start working on the action. Click on the date to change</div>
            <span slot="reference">Start</span>
          </popper>
        </div>-->

        <!-- Date end -->
        <div class="grid-col toggle-column d-none d-sm-block">
          <popper trigger="hover" :options="{placement: 'top'}">
            <div
              class="popper"
            >Date by when the action should be finished. Click on the date to change</div>
            <span slot="reference">Finish</span>
          </popper>
        </div>

        <!-- Owner -->
        <div class="grid-col">
          <popper trigger="hover" :options="{placement: 'top'}">
            <div class="popper">
              The person responsible of finishing the action.
              <br />Assign to a member of your team or change assignee by clicking on the icon
            </div>
            <span slot="reference">Owner</span>
          </popper>
        </div>
      </div>

      <!-- Action rows if they exist -->
      <draggable
        v-if="storeActions && storeActions.length"
        :value="storeActions"
        @end="changeOrder"
        :options="draggableOptions"
      >
        <transition-group name="collapse" tag="div" class="body">
          <Action
            v-for="(activity, index2) in storeActions"
            :key="activity.transitionId"
            :activity="activity"
            :idx="index2"
            @change-order="changeOrder"
          />
        </transition-group>
      </draggable>

      <!-- Or no actions message -->
      <div v-else class="no-actions-message">
        <div v-if="plans.length == 0">
          You have no plans.
          Create
          <router-link title="Create plan" :to="'/' + currentTeamId + '/plan/create-more'">one</router-link>{{" to get started!"}}
        </div>
        <div v-else>
          You have no activities.
          <br />Check your filters or use the top right 'create' button to create your first one!
        </div>
      </div>
    </div>

    <!-- Action details -->
    <transition name="slide">
      <router-view :style="splitRightStyle" />
    </transition>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import "vue-popperjs/dist/css/vue-popper.css";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import Action from "@/App/components/Actions/Action";
import Draggable from "vuedraggable";
import notificationMixin from "@/Common/mixins/Notification";
import { DEBOUNCE_REORDER_TIMEOUT } from "../../store/modules/actionStore";

const uuid = require("uuid/v4");

export default {
  mixins: [notificationMixin],
  name: "Actions-list",
  components: {
    popper: Popper,
    Draggable,
    Action
  },
  data() {
    return {
      format: "dd/MM/yy",
      debouncedOrderChanger: null,
      hideHeader: true,
      halfScreenMode: true
    };
  },
  computed: {
    ...mapState({
      teamId: s => s.teamStore.currentTeamId,
      actionStoreReady: s => s.actionStore.actionStoreReady,
      actionsOrdersCopy: s => s.actionStore.actionsOrdersCopy,
      requestInProgress: s => s.actionStore.actionsOrderRequestToken,
      sortBy: s => s.actionStore.actionFilters.sortBy
    }),
    ...mapGetters({
      storeActions: "actions",
      plans: "plans",
      currentTeamId: "currentTeamId",
      getActionById: "getActionbyId",
      left: "timeline/leftPane",
      right: "timeline/rightPane"
    }),

    splitViewMobile() {
      return this.$route.params.actionId && window.innerWidth < 576;
    },
    splitStyle() {
      return `width:${this.$route.meta.splitView ? this.left : 100}%`;
    },
    splitRightStyle() {
      return `width:${this.right}%`;
    },
    allowDrag() {
      return this.sortBy === "order";
    },
    draggableOptions() {
      let result = {};

      result.disabled = !this.allowDrag;

      if (window.innerWidth < 576) {
        result.handle = ".drag-grip";
      }
      return result;
    }
  },

  created() {
    // When actions arrive, save actions copy
    const unwatch = this.$watch(
      () => this.actionStoreReady,
      ready => {
        if (ready) {
          this.updateActionsCopy();
        }
      },
      { immediate: true }
    );

    // Set a debounced action sender
    this.debouncedOrderChanger = _.debounce(() => {
      // Send actions to server to update the orders
      this.reorderActions({ teamId: this.teamId })
        .then(() => {
          unwatch();
          this.showToast("Actions reordered successfully!");
        })
        .catch(error => {
          if (error !== "cancelled") {
            this.showToast("Actions reorder failed!", "error");
          }
        });
    }, DEBOUNCE_REORDER_TIMEOUT);
  },

  // Register click handler to remove empty dummy actions
  mounted() {
    this.$nextTick().then(() => {
      this.$el.addEventListener("click", event => {
        if (
          !event.target.closest(".action-row") &&
          !event.target.closest(".create-button")
        ) {
          this.clearUnsavedActions();
        }
      });
    });
  },
  methods: {
    ...mapActions({
      addDummyAction: "createUnsavedAction",
      reorderActions: "reorderActions"
    }),
    ...mapMutations({
      clearUnsavedActions: "CLEAR_UNSAVED_ACTIONS",
      updateActionsOrder: "UPDATE_ACTIONS_ORDER",
      updateActionsCopy: "UPDATE_ACTIONS_COPY"
    }),

    addAction() {
      this.$emit("add-action");
    },

    showFirstAction: function() {
      this.$router.push({
        name: "actionDetails",
        params: {
          actionId: this.storeActions[0].id
        }
      });
    },

    // Change actions order
    changeOrder({ oldIndex, newIndex, parentId }) {
      console.log(oldIndex, newIndex);

      // Nothing useful happened - return
      if (oldIndex === newIndex) {
        return;
      }

      // If we have changing order request in progress, abort it
      if (this.requestInProgress) {
        this.requestInProgress.cancel();
      }

      // Orders to update
      const actionsToUpdate = [];

      /**
       * Indexing is based on actions getter, which groups actions
       * We have to find changed actions based on their index and if they have a parentId
       */
      let actionsScope;

      if (parentId) {
        const parentAction = this.storeActions.find(a => a.id === parentId);

        if (parentAction) {
          actionsScope = parentAction.actions;
        }
      } else {
        actionsScope = this.storeActions;
      }

      // The current one
      const draggedAction = actionsScope[oldIndex];
      const targetOrder = actionsScope[newIndex].order;
      actionsToUpdate.push({ id: draggedAction.id, order: targetOrder });

      // Shift intermediate actions
      if (oldIndex < newIndex) {
        for (let i = oldIndex + 1; i <= newIndex; i++) {
          const action = actionsScope[i];
          actionsToUpdate.push({ id: action.id, order: action.order - 1 });
        }
      } else {
        for (let i = oldIndex - 1; i >= newIndex; i--) {
          const action = actionsScope[i];
          actionsToUpdate.push({ id: action.id, order: action.order + 1 });
        }
      }

      // Mutate the store
      this.updateActionsOrder({ actions: actionsToUpdate, unsaved: true });

      // Debounce request
      this.debouncedOrderChanger();
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-to,
.slide-leave {
  transform: translateX(0);
}
.flex-list {
  display: flex;
  position: relative;
  padding: 0 15px;
  .table {
    flex-grow: 0;
    flex-shrink: 0;
    width: 100%;
    transition: width 0.5s;
    background: white;

    .no-actions-message {
      text-align: center;
      padding: 30px 0;
      font-size: 16px;
    }
  }

  /* Shrink actions table for the split view */
  &.timeline-view {
    .toggle-timeline-column {
      display: none !important;
    }
  }

  &.split-view {
    .table {
      width: 50%;
    }

    .toggle-column {
      display: none !important;
    }

    .header,
    .action-row {
      padding-right: 20px;

      /* Rules for shrinked table */
      & > div {
        min-width: auto;
        flex-grow: 0;
        flex-shrink: 0;

        &:first-child {
          width: 10%;
        }
        &:nth-child(2) {
          width: 45%;
        }

        &:nth-child(3) {
          width: 20%;
          flex-basis: 25px;
        }

        &:nth-child(4) {
          width: 5%;
          flex-basis: 10%;
        }

        &:nth-child(5) {
          width: 30%;
          flex-basis: 30%;
        }
      }
    }
  }

  .header {
    padding: 10px 20px 10px 5px;
    height: 61px;
    max-height: 61px;
    border-bottom: 1px solid white;
    justify-content: space-between;
    display: flex;
    background-color: #ededed;
    padding-right: 20px;

    position: sticky;
    top: 102px;
    z-index: 5;

    & > div {
      width: calc(100% / 6);
      padding: 0px 5px;
      text-align: center;
      justify-content: center;
      align-self: center;
      min-width: 118px;
      font-size: 16px;
    }
  }

  .action-col {
    flex-grow: 2;
  }
  .plan-col {
    flex-grow: 1;
  }
  .grid-col {
    flex-basis: 120px;
  }
  .grid-col-start {
    left: 20px;
  }
  .num-col {
    flex: 0 0 10px;
  }

  .sub-list {
    .action-row {
      padding-left: 5px;
    }
  }
}

.popper[x-placement^="right"] .popper__arrow {
  border-width: 50px 0px 50px 50px !important;
  border-color: transparent transparent transparent #fafafa;
  right: -50px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.45s;
}
.collapse-enter, .collapse-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

.collapse-enter-to {
  opacity: 1;
}

.collapse-move {
  transition: transform 0.45s;
}

/*  Mobile styles */
@media (max-width: 576px) {
  .flex-list {
    padding-left: 0;
    padding-right: 0;

    .header {
      padding: 0;
      top: 60px;

      & > div {
        font-size: 13px;
        min-width: auto;
        flex-grow: 0;
        flex-shrink: 0;

        // status section
        &:first-child {
          width: 10%;
          flex-basis: 20%;
        }

        // action section
        &:nth-child(2) {
          width: 15%;
          flex-basis: 40%;
        }

        // learn how section
        &:nth-child(3) {
          width: 10%;
          flex-basis: 10%;
        }

        // owner section
        &:nth-child(4) {
          width: 20%;
          flex-basis: 20%;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import "~pretty-checkbox/src/scss/variables";

// $pretty--colors:(
//   primary:#3f51b5,
//   info:#00bcd4,
//   success:red,
//   warning:$pretty--color-warning, // default
//   danger:$pretty--color-danger //default
// );

$pretty--z-index-back: 0;
$pretty--z-index-between: 1;
$pretty--z-index-front: 2;

@import "~pretty-checkbox/src/pretty-checkbox.scss";
</style>


