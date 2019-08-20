<template>
  <aside :class="{ active: active }">
    <b-container>
      <b-row>
        <b-col>
          <div v-if="active" @click="showVideo" class="helper">
            <font-awesome-icon
              v-if="!loadingVideo"
              id="sidebar__video"
              icon="video"
            />
            <font-awesome-icon
              v-else
              id="sidebar__video-spinner"
              icon="spinner"
              spin
            />
          </div>
        </b-col>
        <b-col id="sidebar__toggler" class="sidebar__toggler">
          <b-button :size="'sm'" :variant="'link'" @click="toggleSidebar">
            <font-awesome-icon
              style="color:black; font-size: 20px;"
              icon="bars"
            />
          </b-button>
        </b-col>
      </b-row>

      <!-- Active sidebar -->
      <b-row v-if="active" class="sidebar__content">
        <!-- Sidebar main -->
        <b-col class="sidebar__main fixed-scroll">
          <!-- <ul class="sidebar__block">
            <h4>My Tasks</h4>
          </ul>-->
          <ul class="sidebar__block">
            <b-row>
              <b-col>
                <h4>My Team</h4>
              </b-col>
              <b-col cols="2">
                <template v-if="currentPermissions.changeteam">
                  <b-btn v-b-modal="'add_member_modal'" variant="link">
                    <div>
                      <popper trigger="hover" :options="{ placement: 'top' }">
                        <div class="popper">Invite Team Members</div>
                        <span slot="reference">
                          <h4 id="sidebar__team">
                            <i class="icon-plus"></i>
                          </h4>
                        </span>
                      </popper>
                    </div>
                  </b-btn>
                  <b-modal id="add_member_modal" title="Invite Team Members">
                    <add-team-member-modal :showAdd="true" />
                    <div slot="modal-footer"></div>
                  </b-modal>
                </template>
              </b-col>
            </b-row>
            <!-- Team member popover -->
            <b-row v-if="currentTeam">
              <b-col class="team__member-popovers">
                <popper
                  v-for="member in currentTeam.members"
                  :key="member.userId"
                  :member="member"
                  trigger="hover"
                  :options="{ placement: 'bottom-end' }"
                >
                  <div class="popper">
                    <team-member-popover :member="member" />
                  </div>
                  <div slot="reference">
                    <avatar
                      :name="member.userDetailsFirstName"
                      size="small"
                      :order="member.position"
                    />
                  </div>
                </popper>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col>
                <div class="add-notify">
                  You don't have any team members yet. tap the + to add your
                  team.
                </div>
              </b-col>
            </b-row>
            <!-- <div class="team-members">
                            <div  v-for="(member, idx) in currentTeam.members" :key="member.userId" style="padding:5px;">
                              <avatar :name="member.userDetailsFirstName" size="small" :order="member.position"/>   
                            </div>        
            </div>-->
          </ul>
          <ul class="sidebar__block" style="border-bottom:0; padding-bottom:0">
            <b-row>
              <b-col>
                <h4>Actions</h4>
              </b-col>
              <b-col cols="2">
                <b-btn @click="addAction" variant="link">
                  <div>
                    <popper trigger="hover" :options="{ placement: 'top' }">
                      <div class="popper">Create new Action</div>
                      <span slot="reference">
                        <h4>
                          <i class="icon-plus"></i>
                        </h4>
                      </span>
                    </popper>
                  </div>
                </b-btn>
                <!-- <create-action-modal :id="'create_action_modal'" title="Create new Action"/> -->
              </b-col>
            </b-row>
          </ul>

          <ul class="sidebar__block">
            <b-row>
              <b-col>
                <input
                  class="sidebar__filter"
                  type="text"
                  placeholder="search"
                  v-model="planActionFilter"
                />
              </b-col>
            </b-row>
          </ul>
          <ul
            v-for="(c, k) in filteredPlanActions"
            :key="k"
            class="sidebar__block"
          >
            <sidebar-category :title="k">
              <b-row v-for="(a, i) in c" :key="i" class="sidebar__link">
                <b-col class="sidebar__link-title">{{
                  a.resource.title
                }}</b-col>
                <b-col cols="1" class="sidebar__link-learn-action"></b-col>
                <b-col cols="1" class="sidebar__submenu__plus">
                  <span
                    class="icon-plus plan__action__add__button"
                    @click="addPlanAction(a)"
                    title="add action"
                  ></span>
                </b-col>
              </b-row>
            </sidebar-category>
          </ul>
        </b-col>
      </b-row>
    </b-container>

    <!-- Sidebar left side -->
    <div class="sidebar__plans">
      <div class="sidebar__plans-item">
        <p class="sidebar__plans-title">Plans</p>
      </div>
      <div v-for="plan in plans" :key="plan.id" class="sidebar__plans-item">
        <popper trigger="hover" :options="{ placement: 'left' }">
          <div class="popper">
            <plan-details :plan="plan" />
          </div>
          <a slot="reference" @click="filter(plan)">
            <avatar
              :name="plan.label"
              size="medium"
              :class="[
                'plan-avatar',
                plan.filterBy ? 'filter-active' : '',
                'button-shadow'
              ]"
              :order="plan.position"
              :palette="1"
            />
          </a>
        </popper>
      </div>
      <div class="sidebar__plans-item">
        <div>
          <popper trigger="hover" :options="{ placement: 'bottom' }">
            <div class="popper">Add a new plan</div>
            <span slot="reference">
              <router-link
                id="sidebar__addplan"
                v-if="currentPermissions.changeteam"
                :to="'/' + teamId + '/plan/create-more'"
              >
                <font-awesome-icon style="font-size:40px" icon="plus-square" />
              </router-link>
            </span>
          </popper>
        </div>
      </div>
    </div>

    <b-modal centered ref="newPlan">
      <plan-picker v-on:plan-selected="planSelected" />
      <div slot="modal-footer"></div>
    </b-modal>

    <b-modal centered size="lg" ref="planQuestions">
      <plan-questions :formId="selectedPlan" v-on:plan-created="planCreated" />
      <div slot="modal-header"></div>
      <div slot="modal-footer"></div>
    </b-modal>

    <b-modal ref="learnModal" size="lg">
      <learn-modal :resource="selectedResource" />
      <div slot="modal-header"></div>
      <div slot="modal-footer"></div>
    </b-modal>

    <b-modal
      ref="videoIntro"
      size="lg"
      style="text-align:center; margin:auto"
      v-on:hidden="hideVideo"
      :lazy="true"
    >
      <video-player
        :source="videoUrl"
        class="player-div"
        width="700"
        title="hello"
        :ready="showTutorial"
      ></video-player>

      <button @click="triggerProductTour" class="circle-button">
        Would you like a quick tour?
      </button>

      <div slot="modal-title">
        <h3>Brandollo Quick Start</h3>
      </div>

      <div slot="modal-footer"></div>
    </b-modal>
  </aside>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { filter, forEach } from "lodash";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/css/vue-popper.css";

import { Avatar } from "@/App/components/Shared";
import SidebarCategory from "@/App/components/Actions/sidebar/SidebarCategory.vue";
import PlanDetails from "@/App/components/Actions/sidebar/PlanDetails.vue";

import LearnModal from "@/App/components/Shared/modals/LearnView.vue";
import AddTeamMemberModal from "@/App/components/Shared/modals/AddTeamMemberModal.vue";
import TeamMemberPopover from "@/App/components/Shared/popovers/TeamMemberPopover.vue";
import VideoWidget from "@/Common/components/VideoWidget";

import PlanPicker from "@/App/components/Plans/PlanPicker.vue";
import PlanQuestions from "@/App/components/Plans/PlanQuestions.vue";
import { getSingleContent } from "@/Common/services/LearnService";
import VideoPlayer from "@/Common/components/VideoPlayer";

export default {
  name: "action-sidebar",

  components: {
    popper: Popper,
    avatar: Avatar,
    sidebarCategory: SidebarCategory,
    learnModal: LearnModal,
    addTeamMemberModal: AddTeamMemberModal,
    teamMemberPopover: TeamMemberPopover,
    "video-widget": VideoWidget,
    "plan-picker": PlanPicker,
    "plan-questions": PlanQuestions,
    "plan-details": PlanDetails,
    "video-player": VideoPlayer
  },
  data() {
    return {
      active: false,
      selectedPlan: null,
      selectedResource: null,
      showTutorial: false,
      videoUrl: null,
      loadingVideo: false,
      planActionFilter: ""
    };
  },
  created(vm) {
    if (this.$route.query.sidebar) {
      this.active = true;
    }
    if (this.$route.query.video) {
      this.$nextTick(_ => {
        this.showVideo();
      });
    }
  },
  mounted() {},
  computed: {
    ...mapState({
      teamId: s => s.teamStore.currentTeamId,
      //  plans: s=> s.actionStore.plans
      currentPermissions: state => state.teamStore.currentPermissions
    }),
    ...mapGetters({
      planActions: "planActionsByCategory",
      currentTeam: "currentTeam",
      plans: "plans",
    }),
    filteredPlanActions() {
      let that = this;
      if (this.planActionFilter.trim() == "") {
        return this.planActions;
      }
      let result = {};
      forEach(this.planActions, (resources, cat) => {
        var fr = filter(resources, r => {
          return (
            r.resource.title
              .toLowerCase()
              .indexOf(that.planActionFilter.toLowerCase()) != -1
          );
        });
        if (fr.length > 0) {
          result[cat] = fr;
        }
      });

      return result;
    }
  },
  methods: {
    ...mapActions({
      createAction: "createAction",
      createActionFromPlan: "createActionFromPlan",
      filterPlan: "togglePlanFilter",
      refreshActions: "refreshActionStore",
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
            path: "/plan/create"
          });
        });
      });
    },
    toggleSidebar(e) {
      e.preventDefault();
      this.active = !this.active;
      this.$emit("toggle-sidebar", this.active);
    },
    addPlanAction(a) {
      let payload = {
        teamId: this.teamId,
        title: a.resource.title,
        planActionId: a.id,
        assignedUserId: null,
        planLane: 2
      };
      console.log(payload);
      this.createActionFromPlan(payload);
    },
    filter(plan) {
      this.filterPlan(plan.id);
    },
    createPlan() {
      // this.$refs.newPlan.show();
    },
    planSelected(plan) {
      this.$refs.newPlan.hide();
      this.selectedPlan = plan.planId;
      this.$refs.planQuestions.show();
    },
    planCreated(plan) {
      this.refreshActions(this.teamId);
      this.$refs.planQuestions.hide();
    },
    showLearn: function(planAction) {
      this.selectedResource = planAction.resource;
      this.$refs.learnModal.show();
    },
    showVideo() {
      this.loadingVideo = true;
      getSingleContent({ name: "dashboard-video" }).then(d => {
        this.videoUrl = d.url;
        this.$refs.videoIntro.show();
        this.showTutorial = true;
        this.loadingVideo = false;
      });
    },
    hideVideo() {
      this.showTutorial = false;
    },
    triggerProductTour() {
      this.$refs.videoIntro.hide();
      this.$emit("start-tour");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/dashboard/variables";

$aside-width: 60px;

.team-members {
  display: flex;
}
.modal-title {
  flex: 1;
}
aside {
  z-index: 10;
  display: block;
  width: $aside-width;
  min-width: $aside-width;
  padding-top: 15px;
  // background: #cecece;
  background: #ededed;
  min-height: 100vh;
  transition: width 0.5s, min-width 0.5s;

  .sidebar__plans {
    padding: 10px;
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: $aside-width;
    top: 50px;
    height: 100vh;

    #sidebar__addplan {
      color: $custom;
    }

    .sidebar__plans-item {
      .plan-avatar {
        border-radius: 5px;
        text-transform: uppercase;
      }

      .sidebar__plans-title {
        font-family: Rubik;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        font-size: 16px;
        text-align: center;
        color: #2b2b2b;
      }
      &:not(:first-child) {
        margin-top: 10px;
      }
      &:last-child {
        margin-top: 25px;
      }
      .icon-plus {
        color: #45ace1;
      }
      i:hover {
        text-shadow: 3px 3px 6px grey;
      }
    }
    .button-shadow:hover {
      box-shadow: 5px 5px 6px grey;
    }
  }

  .helper {
    margin-left: 70px;
    & > * {
      color: #79bcdf;
      font-size: 35px;
      cursor: pointer;
    }
    & > *:hover {
      text-shadow: 5px 5px 6px grey;
    }
  }
  .sidebar__toggler {
    padding: 0 !important;
  }

  .container {
    height: 100%;
    .sidebar__content {
      display: flex;
      flex-direction: row;
      height: 100%;
      .sidebar__main {
        .sidebar__block {
          padding: 15px 0;
          // border-bottom: 0.25px solid #bbbbbb;

          &:last-child {
            border: none;
          }
          .add-notify {
            font-family: Roboto;
            font-style: italic;
            font-weight: normal;
            line-height: 20px;
            font-size: 12px;
            color: #636363;
            padding-left: 15px;
            padding-right: 60px;
          }
          .popover.add-member {
            border: 0px;
          }
        }
      }

      .fixed-scroll {
        overflow-y: scroll;
        position: absolute;
        height: 100%;
        margin-left: 70px;
        width: 83%;
      }
    }
  }

  .btn {
    display: block !important;
    margin: 0 auto !important;
    padding-top: 0;
    padding-bottom: 0;
  }

  &.active {
    min-width: 413px;

    .btn {
      float: right;
      margin-right: 5px !important;
    }

    .sidebar__block {
      .btn-link {
        &:hover,
        &:visited,
        &:focus {
          text-decoration: none;
        }
      }

      .team__member-popovers {
        display: flex;

        & > span {
          padding: 5px;
        }
      }
    }

    .sidebar__plans {
      margin-bottom: 29px;
    }
  }

  .plan__action__add__button {
    cursor: pointer;
    color: #45ace1;
  }

  .sidebar__submenu {
    .sidebar__link {
      padding-top: 15px;

      &:hover {
        //  background-color: darken(#a5aabc, 2%);
      }

      .sidebar__link-learn-action {
        padding: 0;

        .btn {
          padding: 0;
        }
      }
      &-title {
        padding-left: 0px;
      }
    }
    .sidebar__submenu__plus {
      padding-top: 3px;
    }
  }

  .filter-active {
    border: 2px solid black;
  }

  .sidebar__filter {
    width: 100%;
  }

  button.circle-button {
    margin: 15px;
    border: none;
    width: 300px !important;
    height: 30px;
    font-size: 15px !important;
    border-radius: 24px;
    color: white;
    padding-top: 5px !important;
    text-align: center;
    cursor: pointer;
    background-color: #40a5e4;
  }
}

/* Mobile styles */
@media (max-width: 576px) {
  aside {
    display: none !important;
  }
}
</style>
