<template>
  <spinner :ready="teamStoreReady && actionStoreReady">
      <div class="containerWithSidebar">
      <sidebar
        class="sidebar"
        ref="actionSidebar"
        @toggle-sidebar="toggleSidebar"
        @start-tour="startTour"
      />
      <div :class="[sidebarActive ? 'side-bar-open' : '', 'main']">
        <div
          v-if="mobileAlertVisible"
          class="alert alert-warning alert-dismissable"
        >
          <button
            @click="mobileAlertEnabled = false"
            type="button"
            class="close"
            data-dismiss="alert"
          >
            &times;
          </button>
          <h2>
            Hi there, Welcome to the timeline. This tool is currently designed
            to be used on a desktop screen, and may not work as intended on
            mobile
          </h2>
        </div>

        <!-- Page-Title -->
        <div :class="{ 'd-none': splitViewMobile }">

          <div id="header__title" class="header__row">
            <div class="create-button">
              <b-dropdown
                variant="custom"
                right
                split
                text="Create"
                @click="addAction"
              >
                <b-dropdown-item @click="addAction">Activity</b-dropdown-item>
                <b-dropdown-item :to="'/' + currentTeamId + '/plan/create-more'"
                  >Plan</b-dropdown-item
                >
              </b-dropdown>
            </div>

            <filters />
          </div>
        </div>

        <!-- end page title end breadcrumb -->
        <timeline v-if="!disableTimeline && !isMobile"></timeline>
        <!-- <div v-if="!disableTimeline" class="row">
          <div class="col-12 col-sm-12">
            <div class="header__row">
              <h4 id="list__title">Marketing Actions</h4>
              <h4 v-if="pendingOperation">Saving..</h4>
            </div>
          </div>
        </div> -->
        <actionsList
          ref="actionList"
          class="main-bottom"
          @add-action="addAction"
        ></actionsList>

        <!-- <action-gantt ref="actionGantt" style="width:70vw; overflow-x:scroll" v-dragscroll="!this.dragMode"></action-gantt> -->
        <!--  -->
      </div>
    </div>

    <!--  Virtual tour  -->
    <v-tour
      name="actionToolIntro"
      :steps="stepsList"
      :callbacks="stepCallback"
    ></v-tour>
  </spinner>
</template>

<script>
import {
  Spinner,
  ActionSidebar,
  ActionsList,
  ActionTimeline,
  ActionFilters,
  ActionDetail,
  ActionGantt
} from "@/App/components";

import { mapActions, mapGetters, mapState } from "vuex";
import { checkHasFormData } from "@/Common/services/SchemaService";
import { dragscroll } from "vue-dragscroll";

export default {
  name: "Action-tool-2",
  props: ["team", "disableTimeline", "actionId"],
  components: {
    spinner: Spinner,
    sidebar: ActionSidebar,
    actionsList: ActionsList,
    timeline: ActionTimeline,
    filters: ActionFilters,
    "action-detail": ActionDetail,
    "action-gantt": ActionGantt
  },
  directives: {
    dragscroll
  },
  data() {
    return {
      mounted: false,
      sidebarActive: false,
      modalStatus: false,
      format: "DD/MM/YY",
      mobileAlertEnabled: false,
      stepsList: [
        {
          target: "#list__title",
          content:
            "Welcome to the Brandollo Planning Tool. This is your control center to create and manage your Marketing plans",
          params: {
            placement: "bottom"
          }
        },
        {
          target: "#sidebar__toggler",
          content:
            "This button will open the sidebar. The place to manage your plans and team.",
          params: {
            placement: "bottom"
          }
        },
        {
          target: "#sidebar__video",
          content: "You can rewatch the tutorial over here",
          params: {
            placement: "bottom"
          }
        },
        {
          target: "#sidebar__team",
          content:
            "Add more team members. With more persons in your team you can assign and discuss your marketing actions",
          params: {
            placement: "right"
          }
        },
        {
          target: "#sidebar__addplan",
          content: "You can create more plans over here",
          params: {
            placement: "right"
          }
        },
        {
          target: ".action-col",
          content:
            "Once you choose one of these plans and answer the questions, Brandollo creates a plan made of multiple steps for your business",
          params: {
            placement: "top"
          }
        },
        {
          target: ".action-col",
          content:
            "These are actions. Clicking on one shows you how to complete this task, and if you are collaborating with a team member dicuss ideas and progress.",
          params: {
            placement: "top"
          }
        },
        {
          target: "#detail__title",
          content:
            "Here you can see who is assigned to the action, when is it due, and collaborate and leave notes.",
          params: {
            placement: "right"
          }
        }
      ],
      steps: [
        {
          target: "#header__title",
          content:
            "Welcome to the Brandollo Planning Tool. This is your control center to create and manage your Marketing plans",
          params: {
            placement: "bottom"
          }
        },
        {
          target: "#sidebar__toggler",
          content:
            "Click here will open the sidebar. The place to manage your plans and team.",
          params: {
            placement: "bottom"
          }
        },
        {
          target: "#sidebar__video",
          content: "You can get help by clicking on the video Icon",
          params: {
            placement: "bottom"
          }
        },
        {
          target: "#sidebar__team",
          content: "Click here to add colleagues to your team",
          params: {
            placement: "right"
          }
        },
        {
          target: "#sidebar__addplan",
          content: "You can pick a plan to work on by clicking here",
          params: {
            placement: "right"
          }
        },
        {
          target: "#sidebar__planPicker",
          content:
            "Once you choose one of these plans and answer the questions, Brandollo creates a plan made of multiple steps for your business",
          params: {
            placement: "top"
          }
        },
        {
          target: ".timeline2",
          content:
            "These are actions. You can move them around the timeline, and also click on their title to reveal more information.",
          params: {
            placement: "top"
          }
        },
        {
          target: "#detail__title",
          content:
            "Here you can see who is assigned to the action, when is it due, and collaborate and leave notes.",
          params: {
            placement: "right"
          }
        }
      ],
      stepCallback: {
        onNextStep: this.nextTourStep
      }
    };
  },
  computed: {
    ...mapState({
      dragMode: s => s.timeline.dragMode,
      teamStoreReady: s => s.teamStore.teamStoreReady,
      actionStoreReady: s => s.actionStore.actionStoreReady,
      pendingOperation: s => !s.actionStore.isOperationReady
    }),
    ...mapGetters({
      teamDetails: "currentTeam",
      currentTeamId: "currentTeamId",
      getActionById: "getActionbyId"
    }),
    splitViewMobile() {
      return this.$route.params.actionId && window.innerWidth < 576;
    },
    mobileAlertVisible() {
      return this.isMobile && this.mobileAlertEnabled;
    },
    isMobile() {
      return window.innerWidth < 700;
    }
  },
  mounted() {
    let that = this;

    if (this.currentTeamId) {
      this.checkOnboardingStatus();
      this.initAction();
    }

    that.mounted = true;
  },
  methods: {
    ...mapActions({
      initAction: "initAction",
      getTeam: "getTeam",
      createAction: "createAction",
      addDummyAction: "createUnsavedAction"
    }),
    addAction() {
      this.addDummyAction().catch(() => {
        this.$swal({
          text:
            "All Activities must be part of the plan and at the moment you have none. You will need to create a plan first.",
          type: "warning",
          confirmButtonText: "Create Plan"
        }).then(() => {
          this.$router.push({
            path: `/${this.currentTeamId}/plan/create-more`
          });
        });
      });
      //this.$refs.actionList.createDummyAction();
    },

    startTour() {
      this.$tours["actionToolIntro"].start();
    },
    nextTourStep(currentStep) {
      if (currentStep == 1) {
        this.$refs.actionSidebar.active = true;
      }
      if (currentStep == 4) {
        this.$refs.actionSidebar.createPlan();
      }
      if (currentStep == 5) {
        this.$refs.actionSidebar.$refs.newPlan.hide();
      }
      if (currentStep == 6) {
        this.$refs.actionList.showFirstAction();
      }
    },
    toggleSidebar(state) {
      this.sidebarActive = state;
    },
    detailHidden() {
      this.$router.push({
        name: this.$route.name,
        params: {
          team: this.team,
          actionId: null,
          disableTimeline: this.disableTimeline
        }
      });
    },
    checkOnboardingStatus() {
      let that = this;
      checkHasFormData({ teamId: this.currentTeamId, formId: 1 }).then(r => {
        if (!r) {
          that
            .$swal({
              title: "One last step",
              text:
                "You have to complete your profile before using the plan builder",
              confirmButtonText: "Ok",
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2"
            })
            .then(() => {
              that.$router.push({
                path: "/questions/1"
              });
            });
        }
      });
    }
  },

  watch: {
    currentTeamId(newVal, oldVal) {
      if (newVal && newVal != oldVal) {
        this.checkOnboardingStatus();
        this.initAction();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.containerWithSidebar {
  display: flex;
  align-items: stretch;

  margin-left: 0;
  padding-left: 0;
  background-color: white;

  height: 100%;
  .header__row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 15px;
    width: 100%;

    h4 {
      font-family: Roboto;
      font-style: normal;
      font-weight: bold;
      line-height: normal;
      font-size: 18px;
      text-transform: uppercase;
      color: #2b2b2b;
    }

    .create-button {
      margin-left: 13px;
      display: flex;
      align-items: flex-start;
    }
  }

  .sidebar {
    position: fixed;
  }
}
.main {
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-left: 50px;
  transition: margin 0.5s;

  .alert {
    width: 88vw;
  }
}

.side-bar-open {
  margin-left: 414px;
}

.main-bottom {
  flex-grow: 2;
  display: flex;
  flex-direction: row;
}

.v-step {
  z-index: 100;
}

/*  Mobile styles */
@media (max-width: 576px) {
  .main {
    margin-left: 0;
    width: 100%;
  }

  .containerWithSidebar {
    .header__row {
      flex-wrap: wrap;
      width: auto;

      .create-button {
        margin-top: 10px;
        margin-left: 0px;
        width: 100%;
        justify-content: flex-start;
      }
    }
  }
}
</style>

<style scoped>
div >>> .v-step {
  z-index: 10000;
}
</style>
