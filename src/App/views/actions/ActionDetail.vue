<template>
  <div class="action-detail-wrapper">
    <spinner :ready="isReady">
      <!-- Tabs -->
      <div class="details-tabs" ref="tabs">
        <div
          v-for="tab in availableTabs"
          :key="tab.name"
          :class="['details-tab', {'active': tab.name === activeTabName, 'disabled': !tab.canBeActivated()}]"
          @click="setActiveTab(tab.name, tab.canBeActivated)"
        >{{ tab.title }}</div>

        <!-- Close details view -->
        <span class="close-action-details" @click="closeActionDetails">✕</span>
      </div>

      <!-- Header row -->
      <div class="flex-container col-flex mt-3 pl-1 pl-sm-3">
        <div class="row-flex header">
          <div class="row-flex justify-content-start">
            <!-- Status checkbox -->
            <status-popover
              :action="action"
              :permission="permissions.changestatus"
              :circleStatus="false"
              :details-mode="true"
            ></status-popover>

            <!-- Action title -->
            <h3 id="detail__title" class="ml-3 ml-sm-4">
              {{action ? action.title: ''}}
              <span v-if="pendingOperation">Saving..</span>
            </h3>
          </div>

          <router-link
            class="d-flex align-items-center"
            v-if="activeTabName === 'learn'"
            :to="{
              name: 'learn-article', 
              params: {articleId: articleId}, 
              query: {content: action.contentResourceId}
            }"
            target="_blank"
          >
            <font-awesome-icon class="learn_link_icon" icon="external-link-alt" />
          </router-link>
        </div>
      </div>

      <hr />

      <!-- Tab content is represented with dynamic component -->
      <keep-alive>
        <component :is="currentTabComponent" v-bind="currentTabComponentProps" />
      </keep-alive>
    </spinner>
  </div>
</template>

<script>
import Spinner from "@/App/components/Spinner";
import { mapActions, mapGetters, mapState } from "vuex";
import { StatusPopover } from "@/App/components/Shared";
import "vue-datetime/dist/vue-datetime.css";
import { Datetime as VueDatetime } from "vue-datetime";
import Popper from "vue-popperjs";
import DetailsView from "./DetailsView";
import LearnView from "../../components/Shared/modals/LearnView";

const uuid = require("uuid/v4");

export default {
  name: "Action-Detail",
  components: {
    spinner: Spinner,
    datetime: VueDatetime,
    "status-popover": StatusPopover,
    popper: Popper,
    LearnView,
    DetailsView
  },
  props: ["format"],
  data() {
    return {
      actionId: null,
      tabs: [
        {
          name: "details",
          title: "Task Details",
          component: "DetailsView",
          canBeActivated: () => true
        },
        {
          name: "learn",
          title: "Learn",
          component: "LearnView",
          canBeActivated: () => this.action && this.action.contentResourceId
        }
      ],
      activeTabName: "details",
      isReady: true
    };
  },
  /**
   * Get actionId param from the route object
   * If action with such ID exists, populate the actionId property
   * Else redirect to 404
   */
  created() {
    const actionIdParam = this.$route.params.actionId;

    // Set action ID from the route
    if (this.getActionById(actionIdParam)) {
      this.actionId = actionIdParam;
    } else {
      this.$router.push({ name: "NotFound" });
    }

    // Set tab based on query param
    const tabName = this.$route.query.tab;

    if (tabName) {
      // Check if tab can be activated
      const tabObj = this.tabs.find(tab => tab.name === tabName);

      if (tabObj && tabObj.canBeActivated()) {
        this.activeTabName = tabName;
      }
    } else {
      // Redirect to parameterized route
      this.$router.push({
        name: this.$route.name,
        params: this.$route.params,
        query: { tab: "details" }
      });
    }
  },
  mounted() {
    // Set the color variable using the plan
    // We use this var for the tabs active/hover color
    const tabsStyleObj = this.$refs.tabs.style;
    tabsStyleObj.setProperty("--color", this.getPlanColor(this.action.planId));

    // If plan changes, change the color
    this.$watch(
      () => {
        if (this.action && this.action.planId) {
          return this.getPlanColor(this.action.planId);
        }

        return null;
      },
      newColor => {
        if (newColor) {
          tabsStyleObj.setProperty("--color", newColor);
        }
      }
    );
  },

  // Action id changed
  beforeRouteUpdate(to, from, next) {
    // Set action ID if it was changed
    if (this.actionId !== to.params.actionId) {
      this.actionId = to.params.actionId;
    }

    // Set tab based on query param
    const tabName = to.query.tab;
    if (tabName) {
      // Check if tab can be activated
      const tabObj = this.tabs.find(tab => tab.name === tabName);

      if (tabObj && tabObj.canBeActivated()) {
        this.activeTabName = tabName;
      } else {
        this.activeTabName = this.tabs[0].name;
      }
    }

    // Call next to resolve the routing
    next();
  },

  computed: {
    ...mapState({
      pendingOperation: s => !s.actionStore.isOperationReady,
      permissions: state => state.teamStore.currentPermissions
    }),
    ...mapGetters({
      getActionById: "getActionbyId",
      getUser: "getTeamMemberName",
      team: "currentTeamId",
      getPlanColor: "getPlanColor"
    }),

    // Render only tabs with content
    availableTabs() {
      return this.tabs.filter(t => t.canBeActivated());
    },

    // Current tab component's name
    currentTabComponent() {
      const tab = this.tabs.find(tab => tab.name === this.activeTabName);
      return tab && tab.component ? tab.component : null;
    },

    // Props for current tab component
    currentTabComponentProps() {
      if (this.currentTabComponent === "LearnView") {
        return {
          modalType: "popper",
          resource: this.action.contentResourceId || null
        };
      } else if (this.currentTabComponent === "DetailsView") {
        return {
          format: this.format,
          action: this.action
        };
      }
    },

    // Computed action from store based on router action-id param
    action() {
      return this.getActionById(this.actionId);
    },

    articleId() {
      let id = this.action.planAction.resourceId;

      if (this.action.parentId) {
        console.log("theres a parent!");
        let parent = this.getActionById(this.action.parentId);
        console.log(parent);

        id = parent.planAction.resourceId;
      }

      return id;
    }
  },

  methods: {
    // Set active tab name, if it can be activated
    setActiveTab(name, validatorFn) {
      if (validatorFn()) {
        this.$router.push({
          name: "actionDetails",
          params: this.$route.params,
          query: { tab: name }
        });
      }
    },

    // Navigate back to the list
    closeActionDetails() {
      if (this.$route.query.p == "timeline") {
        this.$router.push({ name: "gantt-timeline" });
        return;
      }
      this.$router.push({ name: "actions-list" });
    },
  }
};
</script>

<!-- These are scoped styles for this component -->
<style lang="scss" scoped>
@import "../../scss/dashboard/variables";

.action-detail-wrapper {
  flex-grow: 0;
  flex-shrink: 0;
  width: 60%;
  margin-bottom: 16px;

  & > div {
    position: sticky;
    top: 120px;
  }

  .details-tabs {
    display: flex;

    .details-tab {
      height: 60px;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      border: 1px solid #ccc;
      transition: color, background-color 0.15s linear;

      &:not(:last-of-type) {
        border-right: 0;
      }

      &:not(.active) {
        &:hover {
          background-color: var(--color);
          color: white;
        }
      }

      // Active tab color
      &.active {
        background-color: var(--color);
        color: white;
        cursor: auto;
      }

      // Disabled tab
      &.disabled {
        background-color: #c4c4c4;
        color: white;
        cursor: not-allowed;

        &:hover {
          background-color: #c4c4c4;
          color: white;
        }
      }
    }
  }
}

.close-action-details {
  font-size: 20px;
  font-weight: bold;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.15s linear;

  &:hover {
    background-color: #ccc;
  }
}

.row-flex {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.col-flex {
  display: flex;
  flex-direction: column;
}

.header {
  justify-content: space-between;
  padding-bottom: 10px;

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: normal;
  }

  .row-flex {
    justify-content: space-between;
    align-items: center;
  }
}

.learn_link_icon {
  font-size: 24px;
  color: #c4c4c4;
  margin-right: 12px;
}

/* Mobile styles */
@media (max-width: 576px) {
  .action-detail-wrapper {
    // position: static;

    margin-top: 0 !important;
    width: 100vw !important;
    min-height: 100vh !important;

    .details-tabs {
      .details-tab {
        height: 45px;
      }
    }

    .header {
      h3 {
        font-size: 15px;
        line-height: 20px;
      }
    }
  }
}
</style>

<!-- These are random style tweaks applied globally -->
<!-- Needs reworking/organizing -->
<style>
#startdate,
#enddate {
  width: 72px;
}

.status,
.round-btn {
  width: 100px !important;
  height: 30px;
  font-size: 15px !important;
  border-radius: 24px;
  color: white;
  padding-top: 5px !important;
  text-align: center;
  cursor: pointer;
}
.round-btn {
  background-color: rgb(102, 102, 102);
}
.tasks .sidebar__link[data-v-68388eca]:hover {
  text-decoration: none;
  background-color: white !important;
}
.tasks p.sidebar__link-title {
  color: rgb(60, 72, 88);
  font-size: 15px;
  font-weight: bold;
}
.tasks .sidebar__submenu {
  padding: 10px 0px 0px 0px;
}
.row.sidebar__link {
  margin-bottom: 10px;
}
.comment-add .avatar-circle-ty,
#comments .avatar-circle-ty {
  border-radius: 50%;
  flex-shrink: 0;
}
</style>

<!-- These are random style tweaks applied globally -->
<!-- Needs reworking/organizing -->
<style lang="scss">
/* Align datepicker to the right pane on split-view */
.split-view {
  .datepicker--open,
  .datepicker--closed {
    right: 0;
    left: auto;
  }
}

/* Disabled date picker styles */
.date.disabled {
  div.datepicker__wrapper {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background: rgba(0, 0, 0, 0.1);
    }

    .datepicker__clear-button {
      display: none;
    }
  }
}
div.datepicker__wrapper {
  background: url("../../assets/images/calendar_icon.png") no-repeat 17px center /
    20px;

  .datepicker__dummy-wrapper--is-active {
    border: 1px solid #79bcdf;
  }
  .datepicker--open {
    .datepicker__dummy-wrapper--is-active {
      border: none;
    }

    .datepicker__month-day--first-day-selected {
      background: #79bcdf;
      border: 1px solid #79bcdf;
    }

    .datepicker__month-day--last-day-selected {
      background: #79bcdf;
    }

    .datepicker__month-day[style] {
      border: 1px solid #79bcdf !important;
    }

    .datepicker__month-button {
      background: url("../../assets/images/arrow_icon.png") no-repeat 50%/30px;
    }

    .datepicker__month-day--selected {
      background: #79bcdf7a;
      &:hover {
        color: #79bcdf;
      }
    }
  }

  .datepicker__input {
    text-align: center;
    padding-top: 1px;
  }
  .datepicker__clear-button {
    padding-top: 2px;
    padding-left: 12px;
  }
}

/* Plan dropdown triangle hover */
.action-details {
  .plan-dropdown {
    padding-right: 15px;
  }
}
</style>

