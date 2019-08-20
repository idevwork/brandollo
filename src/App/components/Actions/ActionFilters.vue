<template>
  <div class="filter-section">
    <div class="filter-section-bottom">
      <ul v-show="activePlans.length > 0">
        <span
          class="filters"
          v-for="plan in activePlans"
          :key="plan.id"
          :style="style(plan.position)"
        >
          <b-col>
            {{ plan.label }}
            <font-awesome-icon @click="removeFilter(plan)" icon="times" />
          </b-col>
        </span>
      </ul>

      <span v-if="isTimelineActive" class="time-block-info">
        <font-awesome-icon style="color: gray;" title="Gantt Help" icon="question-circle" />Add timeblocks:
        <i>Hold Shift</i> and Drag on timeline
      </span>

      <!-- <b-button-group >      
        <b-button variant="secondary" @click="setSplit('right')">Large</b-button>
        <b-button variant="secondary" @click="setSplit('middle')">Medium</b-button>
        <b-button variant="secondary" @click="setSplit('left')">Small</b-button>      
      </b-button-group>-->

      <b-dropdown v-if="isTimelineActive" class="filter-button" :text="zoom == 50 ? 'Zoom: Normal':'Zoom: Compact'">
        <b-dropdown-item @click="setZoom(50); rePositionTimeline()">Normal</b-dropdown-item>
        <b-dropdown-item @click="setZoom(25); rePositionTimeline()">Compact</b-dropdown-item>
      </b-dropdown>

      <b-dropdown class="filter-button" :text="showingActions">
        <b-dropdown-item @click="showCompleted(null)">Show All</b-dropdown-item>
        <b-dropdown-item active @click="showCompleted(false)">Show Pending</b-dropdown-item>
        <b-dropdown-item @click="showCompleted(true)">Show Completed</b-dropdown-item>
      </b-dropdown>

      <b-dropdown class="filter-button" :text="showingAssign">
        <b-dropdown-item @click="toggleMyActions(true)">Show My</b-dropdown-item>
        <b-dropdown-item @click="toggleMyActions(false)">Show Team</b-dropdown-item>
      </b-dropdown>

      <b-dropdown class="filter-button" :text="showingSort">
        <b-dropdown-item @click="changeSort('order')">Order by Order</b-dropdown-item>
        <b-dropdown-item @click="changeSort('start')">Order by Start</b-dropdown-item>
        <b-dropdown-item @click="changeSort('end')">Order by End</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { filter } from "lodash";
// import { returnStatement } from "babel-types";

export default {
  name: "Action-Filters",
  computed: {
    ...mapState({
      pendingOperation: s => !s.actionStore.isOperationReady,
      myActions: s => s.actionStore.actionFilters.myActions,
      actionState: s => s.actionStore.actionFilters.actionCompleted,
      sortBy: s => s.actionStore.actionFilters.sortBy,
      zoom: s => s.timeline.options.unit
    }),
    ...mapGetters({
      plans: "plans",
      today: "timeline/todayPosition",
    }),
    isTimelineActive(){
      return this.$route.name == 'gantt-timeline'
    },
    activePlans() {
      return filter(this.plans, p => {
        return p.filterBy;
      });
    },
    showingActions() {
      if (this.actionState == null) {
        return "Showing: All";
      }
      if (this.actionState) {
        return "Show: Completed";
      }

      return "Show: Pending";
    },
    showingAssign() {
      if (this.myActions) {
        return "Show: My Actions";
      } else {
        return "Show: All Actions";
      }
    },
    showingSort() {
      if (this.sortBy == "order") {
        return "Order: #";
      }
      if (this.sortBy == "start") {
        return "Order: Start";
      }
      if (this.sortBy == "end") {
        return "Order: Due";
      }
    }
  },
  methods: {
    ...mapActions({
      filterPlan: "togglePlanFilter",
      toggleMyActions: "toggleMyActions",
      changeSort: "changeSort",
      showCompleted: "setActionCompleteFilter",
      setZoom: "timeline/setZoom",
      setSplit: "timeline/changeSplit",
      updateViewWindow: "timeline/updateViewWindow",
    }),
    computedColor(order) {
      let color = "#B54E4E";
      switch (order) {
        case 0:
          color = "#B359A4";
          break;
        case 1:
          color = "#2389C7";
          break;
        case 2:
          color = "#82B960";
          break;
        case 3:
          color = "#DE8E30";
          break;
        case 4:
          color = "#E1C014";
          break;
        case 5:
          color = "#B54E4E";
          break;
      }

      return color;
    },
    style(order) {
      return "background-color: " + this.computedColor(order) + ";";
    },
    removeFilter(plan) {
      this.filterPlan(plan.id);
    },
    rePositionTimeline() {
      let viewWindow = {
        minX: this.today.x,
        minY: this.today.y,
        width: this.today.width,
      }

      this.updateViewWindow(viewWindow);
    }
  }
};
</script>

<style scoped lang="scss">
.filter-section {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;

  ul {
    height: auto;
    margin-bottom: 0;
    margin-right: auto;
    padding-inline-start: 0;
    vertical-align: middle;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;

    .filters {
      float: left;
      border-radius: 250px;

      color: white;
      font-size: 15px;
      padding: 5px 0 5px 0;
      margin: 1px 5px 0 5px;
      justify-content: center;
      align-items: stretch;

      i {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }

  .filter-section-bottom {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  .time-block-info {
    margin: auto 0 auto 0;
    padding-right: 3rem;
  }
}

/*  Mobile styles */
@media (max-width: 576px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;

    .filter-button {
      width: 180px;

      &:not(:first-of-type) {
        margin-top: 5px;
      }
    }

    .filter-section-bottom {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
    }

    & > ul {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.filter-section {
  justify-content: flex-start;

  .btn.btn-secondary {
    border-color: white;
    background-color: white;
    color: #6c757d;
  }
}

/*  Mobile styles */
@media (max-width: 576px) {
  .filter-section {
    .btn.btn-secondary {
      border-color: inherit;
      background-color: white;
      color: #6c757d;
    }

    .filter-button {
      .dropdown-toggle {
        width: 180px;
        text-align: left;
      }
    }
  }
}
</style>
