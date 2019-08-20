<template>
  <div>
    <!-- Action -->
    <div
      v-if="!activity.unsaved"
      :class="['action-row', {'action-row-active': $route.params.actionId === activity.id}]"
      :style="rowStyle(activity.planId)"
    >
      <!-- Action status -->
      <div :id="'status'+idx" class="pointer status-item grid-col" :class="status(activity)">
        <!-- Grip icon -->
        <div class="drag-grip" v-if="allowDrag">
          <font-awesome-icon
            style="color: gray; font-size: 32px;"
            class="show-hover"
            title="Reorder actions"
            icon="grip-vertical"
          />
        </div>

        <div class="expand-caret">
          <div
            v-if="activity.actions && activity.actions.length"
            @click.stop="expandActivity(activity)"
          >
            <font-awesome-icon
              :class="{
                'caret-down': activity.expanded,
                'caret-right': !activity.expanded,
              }"
              icon="angle-right"
            />
          </div>
        </div>

        <!-- Complete Button -->
        <status-popover
          :action="activity"
          :permission="permissions.changestatus"
          :circleStatus="false"
        ></status-popover>
      </div>

      <!-- Action title -->
      <div class="action-name action-col" @click="showDetail(activity.id)">
        <!-- Edit mode input -->
        <input
          v-if="editMode(activity.id)"
          :value="activity.title"
          type="text"
          :ref="'input' + activity.id"
          @blur="saveEdit(activity.id, $event.target.value)"
          @keydown.enter="handleEnterEditTitle(activity.id)"
          @click.stop
        />

        <!-- Normal mode -->
        <template v-else>
          <!-- Expand activity -->

          <a
            class="activity-title pointer setIconRight"
            v-if="activity.actions && activity.actions.length"
          >
            <span
              class="textBreak80"
            >{{activity.title}} {{activity.actions && activity.actions.length ? `(${activity.actions.length})` : ""}}</span>
            <div class="takeRight" style="width: 72px; height: 20px;">
              <span
                class="add-subaction-icon show-hover"
                @click.stop="createDummyAction(activity.id, true)"
                style="font-size: 24px;"
              >+</span>

              <font-awesome-icon
                @click.stop="setEditModeFocus(activity.id)"
                style="color: gray; font-size: 24px"
                title="Change action title"
                class="show-hover"
                icon="pencil-alt"
              />
              <font-awesome-icon
                style="color: gray; font-size: 24px"
                @click.stop="deleteAction(activity)"
                title="Delete action"
                icon="trash"
                class="show-hover"
              />
            </div>
          </a>

          <!-- Show details -->
          <a v-else class="activity-title pointer setIconRight">
            <span class="textBreak80">{{activity.title}}</span>
            <div class="takeRight" style="width: 72px; height: 20px; font-size: 24px">
              <span
                class="add-subaction-icon show-hover"
                @click.stop="createDummyAction(activity.id, true)"
              >+</span>

              <font-awesome-icon
                @click.stop="setEditModeFocus(activity.id)"
                style="color: gray;"
                title="Change action title"
                class="show-hover"
                icon="pencil-alt"
              />
              <font-awesome-icon
                style="color: gray;"
                @click.stop="deleteAction(activity)"
                title="Delete action"
                icon="trash"
                class="show-hover"
              />
            </div>
          </a>
        </template>
      </div>

      <!-- Learn block -->
      <div class="grid-col toggle-timeline-column">
        <div class="icon-container">
          <font-awesome-icon
            v-if="activity.contentResourceId"
            style="color: gray"
            @click="showDetail(activity.id, 'learn')"
            title="Learn action"
            icon="play-circle"
            class="learn_icon"
          />
        </div>
      </div>

      <!-- Plan progress dropdown -->
      <div class="plan-col toggle-column toggle-column-mobile">
        <PlanDropdown :action="activity" class="planname plan-col" />
      </div>

      <!-- Start Date  REMOVED TO ALIGN WITH UX DESIGN-->
      <!-- <div class="grid-col toggle-column d-none d-sm-flex">
        <datetime
          v-if="activity.completed == null && permissions.changestatus"
          placeholder="Select Date"
          @close="updateAction(activity)"
          :format="format"
          v-model="activity.planStart"
          :min-datetime="minDate(null)"
          value-zone="utc"
          :zone="zoneName"
        ></datetime>
        <span v-else>{{activity.planStart | formattedDate}}</span>
      </div>-->

      <!-- Finish Date -->
      <div class="grid-col toggle-column d-none d-sm-flex">
        <DatePicker
          ref="picker"
          v-if="activity.completed == null && permissions.changestatus"
          :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"
          v-model="activityDateRange"
          opens="left"
          :minDate="dateToday"
          :ranges="false"
          :auto-apply="true"
          @update="updateDatePicker(activity, $event)"
          @toggle="toggleDatePicker"
          class="daterange_selector"
        >
          <div slot="input" slot-scope="picker">
            <div class="daterange_picker">
              <div>{{ picker.endDate ? picker.endDate.toLocaleDateString() : "Select Date"}}</div>
              <div class="daterange_caret">
                <font-awesome-icon
                  class="daterange_caret_icon"
                  icon="caret-down"
                  style="color: gray; font-size: 16px"
                />
              </div>
            </div>
          </div>
        </DatePicker>
      </div>

      <!-- Owner -->
      <div class="pointer grid-col owner-col">
        <!-- Attachment Icon -->
        <div class="attachment-icon" @click="showDetail(activity.id)">
          <font-awesome-icon
            v-if="activity.hasAttachment"
            title="Attachment Icon"
            icon="paperclip"
          />
        </div>

        <!-- Task Owner -->
        <div class="assign-task">
          <assign-task
            :permission="permissions.changestatus"
            :members="members"
            :action="activity"
            @assignMember="assignMember"
          ></assign-task>
        </div>

        <!-- Comment Icon -->
        <div class="comment" @click="showDetail(activity.id)">
          <div v-if="activity.unreadComments">
            <font-awesome-icon class="unread-comment-icon" title="New Comment Icon" icon="comment" />
          </div>

          <font-awesome-icon
            v-else-if="activity.totalComments && !activity.unreadComments"
            class="comment-icon"
            title="New Comment Icon"
            icon="comment"
          />
        </div>
      </div>
    </div>

    <!-- Dummy action -->
    <div v-else class="action-row dummy-action-row" :style="rowStyle(activity.planId)">
      <!-- Status checkbox -->
      <div :id="'status' + idx" class="pointer status-item grid-col" :class="status(activity)">
        <status-popover
          :action="activity"
          :permission="permissions.changestatus"
          :circleStatus="false"
        ></status-popover>
      </div>

      <!-- Action name -->
      <div class="action-name action-col">
        <input
          type="text"
          name="action-title"
          @input="changeDummyActionTitle({ id: activity.transitionId, title: $event.target.value})"
          :ref="'actionTitleInput' + activity.transitionId"
          :id="'actionTitleInput' + activity.transitionId"
          placeholder="type name of activity"
          @blur="saveDummyAction(activity.transitionId)"
          @keyup.enter.prevent="createDummyAction(null, true)"
          @keypress.enter.stop
        />
      </div>

      <!-- Learn how column -->
      <div class="grid-col"></div>

      <!-- Plan progress -->
      <div
        class="planname plan-col toggle-column d-none d-sm-flex"
        :style="planProgressStyle(activity.planId)"
      >
        <div>{{activity.planName}}</div>
      </div>

      <!-- Empty dates REMOVED START DATE TO ALIGN WITH UX DESIGN -->
      <!-- <div class="grid-col toggle-column d-none d-sm-flex">-</div> -->
      <div class="grid-col toggle-column d-none d-sm-flex">-</div>

      <!-- Assign to member -->
      <div class="pointer grid-col">
        <assign-task
          :permission="permissions.changestatus"
          :members="members"
          :action="activity"
          @assignMember="assignMember"
        ></assign-task>
      </div>
    </div>

    <!-- Sub actions -->
    <draggable
      :value="activity.actions"
      :options="draggableOptions"
      @end.stop="changeOrder($event, activity.id)"
    >
      <div
        v-if="activity.expanded"
        v-for="(action, i) in activity.actions"
        :class="['sub-list', {'action-row-active': action.id && $route.params.actionId === action.id}]"
        :key="action.transitionId"
      >
        <!-- Sub action -->
        <div
          v-if="!action.unsaved"
          :class="['action-row', {'action-row-active': $route.params.actionId === action.id}]"
        >
          <!-- Status -->
          <div :id="'status'+idx" class="pointer status-item grid-col" :class="status(action)">
            <div class="drag-grip">
              <font-awesome-icon
                style="color: gray; font-size: 32px;"
                title="Reorder actions"
                class="show-hover"
                icon="grip-vertical"
              />
            </div>

            <!-- Completed Button -->
            <status-popover :action="action" :permission="permissions.changestatus"></status-popover>
          </div>

          <!-- Subaction title -->
          <div class="action-name action-col action-title" @click="showDetail(action.id)">
            <!-- Edit mode input -->
            <input
              v-if="editMode(action.id)"
              :value="action.title"
              class="subaction-input"
              type="text"
              :ref="'input' + action.id"
              @blur="saveEdit(action.id, $event.target.value)"
              @keydown.enter="handleEnterEditTitle(action.id)"
              @click.stop
            />

            <!-- Normal mode -->
            <template v-else>
              <a class="action-title pointer subContent">
                <span>{{action.title}}</span>
                <div class="subContentRight">
                  <!-- Edit subaction icon -->
                  <font-awesome-icon
                    @click.stop="setEditModeFocus(action.id)"
                    style="color: gray"
                    title="Change action title"
                    class="show-hover"
                    icon="pencil-alt"
                  />
                  <!-- Delete subaction icon -->
                  <font-awesome-icon
                    style="color: gray"
                    @click.stop="deleteAction(action)"
                    title="Delete action"
                    icon="trash"
                    class="show-hover"
                  />
                </div>
              </a>
            </template>
          </div>

          <!-- Learn block -->
          <div class="grid-col toggle-timeline-column">
            <div class="icon-container">
              <font-awesome-icon
                v-if="action.contentResourceId"
                style="color: gray"
                @click="showDetail(action.id, 'learn')"
                title="Learn action"
                icon="play-circle"
                class="learn_icon"
              />
            </div>
          </div>

          <!-- Plan progress -->
          <div class="plan-col toggle-column text-left d-none d-sm-block"></div>

          <!-- Plan progress dropdown -->
          <!-- <PlanDropdown :action="action" class="planname plan-col toggle-column d-none d-sm-flex"/> -->

          <!-- Dates -->

          <!-- Start Date REMOVED TO ALIGN WITH UX DESIGN-->
          <!-- <div class="grid-col toggle-column d-none d-sm-flex">
            <datetime
              v-if="action.completed == null && permissions.changestatus"
              @close="updateAction(action)"
              placeholder="Select Date"
              :format="format"
              v-model="action.planStart"
              :min-datetime="minDate(null)"
              value-zone="utc"
              :zone="zoneName"
            ></datetime>
            <span v-else>{{action.planStart | formattedDate}}</span>
          </div>-->

          <!-- Finish Date -->
          <div class="grid-col toggle-column d-none d-sm-flex">
            <DatePicker
              ref="picker"
              v-if="action.completed == null && permissions.changestatus"
              :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"
              v-model="actionDateRanges[i]"
              opens="left"
              :minDate="dateToday"
              :ranges="false"
              :auto-apply="true"
              @update="updateDatePicker(action, $event)"
              @toggle="toggleDatePicker"
              class="daterange_selector"
            >
              <div slot="input" slot-scope="picker">
                <div class="daterange_picker">
                  <div>{{ picker.endDate ? picker.endDate.toLocaleDateString() : "Select Date"}}</div>
                  <div class="daterange_caret">
                    <font-awesome-icon
                      class="daterange_caret_icon"
                      icon="caret-down"
                      style="color: gray; font-size: 16px"
                    />
                  </div>
                </div>
              </div>
            </DatePicker>
          </div>

          <!-- Owner -->
          <div class="pointer grid-col owner-col" @click="showDetail(activity.id)">
            <!-- Attachment Icon -->
            <div class="attachment-icon toggle-column">
              <font-awesome-icon
                v-if="action.hasAttachment"
                title="Attachment Icon"
                icon="paperclip"
              />
            </div>

            <!-- Task Owner -->
            <div class="assign-task">
              <assign-task
                :permission="permissions.changestatus"
                :members="members"
                :action="action"
                @assignMember="assignMember"
              ></assign-task>
            </div>

            <!-- Comment Icon -->
            <div class="comment toggle-column" @click="showDetail(activity.id)">
              <div v-if="action.unreadComments">
                <font-awesome-icon
                  class="unread-exclamation-icon"
                  v-if="action.unreadComments"
                  title="Comment Icon"
                  icon="exclamation"
                />
                <font-awesome-icon
                  class="unread-comment-icon"
                  title="New Comment Icon"
                  icon="comment"
                />
              </div>

              <font-awesome-icon
                v-else-if="action.totalComments && !action.unreadComments"
                class="comment-icon"
                title="New Comment Icon"
                icon="comment"
              />
            </div>
          </div>
        </div>

        <!-- Dummy sub action -->
        <div v-else class="action-row">
          <!-- Status checkbox -->
          <div :id="'status' + idx" class="pointer status-item grid-col" :class="status(action)">
            <status-popover
              :action="action"
              :permission="permissions.changestatus"
              :circleStatus="false"
            ></status-popover>
          </div>

          <!-- Action name -->
          <div class="action-name action-col action-title">
            <input
              type="text"
              name="action-title"
              class="subaction-input"
              @input="changeDummyActionTitle({ id: action.transitionId, title: $event.target.value})"
              :ref="'actionTitleInput' + action.transitionId"
              :id="'actionTitleInput' + action.transitionId"
              placeholder="type name of activity"
              @blur="saveDummyAction(action.transitionId)"
              @keyup.enter.prevent="createDummyAction(activity.id, false)"
              @keypress.enter.stop
            />
          </div>

          <!-- Learn how column -->
          <div class="grid-col"></div>

          <!-- Plan progress -->
          <div
            class="planname plan-col toggle-column d-none d-sm-flex"
            :style="planProgressStyle(action.planId)"
          >
            <div>{{action.planName}}</div>
          </div>

          <!-- Empty dates REMOVED TO ALIGN WITH UX DESIGN -->
          <!-- <div class="grid-col toggle-column d-none d-sm-flex">-</div> -->
          <div class="grid-col toggle-column d-none d-sm-flex">-</div>

          <!-- Assign to member -->
          <div class="pointer grid-col">
            <assign-task
              :permission="permissions.changestatus"
              :members="members"
              :action="action"
              @assignMember="assignMember"
            ></assign-task>
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import { Datetime } from "vue-datetime";
import TeamService from "@/Common/services/TeamService";
import { AssignTaskPopover, StatusPopover } from "@/App/components/Shared";
import notificationMixin from "@/Common/mixins/Notification";
import PlanDropdown from "@/App/components/Plans/PlanDropdown.vue";
import Draggable from "vuedraggable";
import DateRangePicker from "vue2-daterange-picker";
import DateLib from "@/Common/functions/Dates";

const uuid = require("uuid/v4");

export default {
  mixins: [notificationMixin],
  name: "Action",
  props: ["idx", "activity"],
  components: {
    datetime: Datetime,
    "assign-task": AssignTaskPopover,
    "status-popover": StatusPopover,
    PlanDropdown,
    Draggable,
    DatePicker: DateRangePicker
  },
  computed: {
    ...mapGetters({
      pendingActions: "actions",
      getUser: "getTeamMemberName",
      team: "currentTeamId",
      allActions: "actions",
      getPlanColor: "getPlanColor",
      getActionById: "getActionbyId",
      getActionByTransitionId: "getActionByTransitionId",
      getActionIndexById: "getActionIndexById",
      getActionIndexByTransitionId: "getActionIndexByTransitionId",
      hasSubactions: "hasSubactions",
      editMode: "editMode",
      userId: "userId"
    }),
    ...mapState({
      members: state => state.teamStore.currentTeam.members,
      permissions: state => state.teamStore.currentPermissions,
      userDetails: state => state.userStore.user,
      actions: s => s.actionStore.actions,
      teamId: s => s.teamStore.currentTeamId,
      zoneName: s => s.userStore.user.profile.zoneinfo,
      sortBy: s => s.actionStore.actionFilters.sortBy
    }),
    allowDrag() {
      return this.sortBy === "order";
    },
    isMobile() {
      return window.innerWidth < 576;
    },

    draggableOptions() {
      return this.isMobile ? { handle: ".drag-grip" } : {};
    },
    activityDateRange: {
      get() {
        let d = {
          startDate: DateLib.getUserJsDate(
            this.zoneName,
            this.activity.planStart
          ),
          endDate: DateLib.getUserJsDate(
            this.zoneName,
            this.activity.planFinish
          )
        };

        if (!this.activity.planStart) {
          d.startDate = null;
        }

        if (!this.activity.planFinish) {
          d.endDate = null;
        }

        return d;
      },
      set(d) {
        return d;
      }
    },
    actionDateRanges: {
      get() {
        let ranges = this.activity.actions.map(a => {
          let d = {
            startDate: DateLib.getUserJsDate(this.zoneName, a.planStart),
            endDate: DateLib.getUserJsDate(this.zoneName, a.planFinish)
          };

          if (!a.planStart) {
            d.startDate = null;
          }

          if (!a.planFinish) {
            d.endDate = null;
          }

          return d;
        });

        return ranges;
      },
      set(value) {
        return value;
      }
    }
  },
  data() {
    return {
      format: "dd/MM/yy",
      hideHeader: true,
      dateToday: new Date()
    };
  },
  mounted() {
    if (this.activity.unsaved) {
      this.$refs["actionTitleInput" + this.activity.transitionId].focus();
    }
  },
  methods: {
    ...mapActions({
      planActionFromStore: "planAction",
      assignTaskFromStore: "assignTask",
      toggleActivity: "toggleActivity",
      removeAction: "removeAction",
      createAction: "createAction",
      changeActionTitle: "changeActionTitle",
      setEditMode: "setEditMode",
      addDummyAction: "createUnsavedAction",
      reorderActions: "reorderActions",
      updateUnreadCommentsFromStore: "updateUnreadComments"
    }),
    ...mapMutations({
      changeDummyActionTitle: "CHANGE_ACTION_TITLE",
      updateActionsCopy: "UPDATE_ACTIONS_COPY"
    }),

    // Notify parent to change subactions order
    changeOrder(e, parentId) {
      this.$emit("change-order", {
        oldIndex: e.oldIndex,
        newIndex: e.newIndex,
        parentId
      });
    },

    // Enable edit mode with focus
    setEditModeFocus(actionId) {
      this.setEditMode({ actionId, mode: true });
      this.$nextTick().then(() => {
        const refs = this.$refs["input" + actionId];
        const inputElem = Array.isArray(refs) ? refs[0] : refs;
        inputElem.focus();
      });
    },

    // Save edit
    saveEdit(actionId, title) {
      // Edited action
      const action = this.getActionById(actionId);

      // Do not save if title was not changed
      if (action && action.title === title) {
        this.setEditMode({ actionId, mode: false });
        return;
      }

      const editedAction = { ...action, title };

      this.changeActionTitle(editedAction)
        .then(() => {
          this.showToast("Action has been successfully edited");
        })
        .catch(err => {
          this.showToast(err.Error, "error");
        })
        .finally(() => {
          this.setEditMode({ actionId, mode: false });
        });
    },

    handleEnterEditTitle(actionId) {
      const refs = this.$refs["input" + actionId];
      const inputElem = Array.isArray(refs) ? refs[0] : refs;
      inputElem.blur();
    },

    // Create dummy action or subaction
    createDummyAction(parentId, nativeFocus) {
      let parentAction = this.getActionById(parentId);
      // Commit unsaved to store
      this.addDummyAction(parentId).then(transitionId => {
        // Somehow the subaction ref is not there yet after first nextTick
        this.$nextTick()
          // Expand parent action
          .then(() => {
            if (parentAction && !parentAction.expanded) {
              this.expandActivity(parentAction);
            }
            if (nativeFocus) {
              const input = document.getElementById(
                "actionTitleInput" + transitionId
              );
              if (input) {
                input.focus();
              }
            } else {
              this.$refs["actionTitleInput" + transitionId][0].focus();
            }
          });
      });
    },
    // Split view for action
    showDetail(actionId, tab) {
      let q = { tab: tab ? tab : "details" };
      if (this.$route.name == "gantt-timeline" || this.$route.query.p) {
        q.p = "timeline";
      }

      this.updateUnreadCommentsFromStore(actionId);

      this.$router.push({
        name: "actionDetails",
        params: { actionId },
        query: q
      });
    },

    // Save dummy action
    saveDummyAction(id) {
      // Find dummy action object and save it if title not empty
      const action = this.getActionByTransitionId(id);

      // Save it
      if (action && action.title) {
        const actionWithoutId = { ...action };

        // Save action
        this.createAction(actionWithoutId)
          .then(() => {
            this.showToast("Action has been successfully created");
            this.updateActionsCopy();
          })
          // TODO: What do we want to do here?
          .catch(err => {
            this.showToast(err.Error, "error");
          });
      }
    },

    // Expand subactions for action
    expandActivity(action) {
      let currentStatus = action.expanded;
      this.toggleActivity({ id: action.id, isExpanded: !currentStatus });
    },

    // Delete action
    deleteAction(action) {
      this.$swal({
        text: "Are you sure you want to delete?",
        showConfirmButton: true,
        showCloseButton: true,
        showCancelButton: true
      }).then(data => {
        if (!data.dismiss) {
          this.dismissPopper();
          this.removeAction(action).then(() => {
            if (this.$route.query.p == "timeline") {
              this.$router.push({ name: "gantt-timeline" });
              return;
            }
            this.$router.push({ name: "actions-list" });
            this.showToast("Action deleted!", "success");
            this.updateActionsCopy();
          });
        }
      });
    },

    status: function(action) {
      if (!action.planStart) {
        return "unscheduled";
      }

      if (!action.completed && !action.startedOn) {
        return "pending";
      }

      if (!action.completed && action.startedOn && !action.finishedOn) {
        return "active";
      }

      if (action.completed) {
        return "completed";
      }
    },

    dismissPopper() {
      document.body.click();
    },

    // assign member
    assignMember: function(data) {
      var { action, member } = data;

      this.dismissPopper();

      const payload = {
        id: action.id,
        teamId: this.team,
        assignedUserId: member
      };

      this.assignTaskFromStore(payload).then(() => {
        this.showToast(!member ? "Task unassigned!" : "Task assigned!");
      });
    },

    // update action
    updateAction(act) {
      if (!act.planFinish || act.planStart > act.planFinish) {
        act.planFinish = Date.addDays(act.planStart, 1);
      }
      this.planActionFromStore(act);
    },

    planProgressStyle(planId) {
      return { color: this.getPlanColor(planId) };
    },

    rowStyle(planId) {
      return {
        "border-left": `${this.getPlanColor(planId)} 5px solid`
      };
    },

    updateDatePicker(activity, event) {
      if (event != null) {
        let planStart = DateLib.getUtcFromJsDate(event.startDate);
        let planFinish = DateLib.getUtcFromJsDate(event.endDate);
        
        this.planActionFromStore({ ...activity, planStart, planFinish });
      }
    },

    toggleDatePicker(event, toggle) {
      let role = this.members.find(m => m.userId === this.userId).role;

      if (this.activity.completed || role === "member") {
        toggle(false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-title,
.action-title {
  font-weight: 500;
}

.flex-list {
  &.timeline-view {
    .toggle-timeline-column {
      display: none !important;
    }
  }

  /* Shrink actions table for the split view */
  &.split-view {
    .table {
      width: 60%;
      padding-right: 30px;
    }

    .toggle-column {
      display: none !important;
    }

    .header,
    .action-row {
      padding-right: 20px;
      max-height: 60px;

      /* Rules for shrinked table */
      & > div {
        min-width: auto;
        flex-grow: 0;
        flex-shrink: 0;

        // comment section
        &:first-child {
          width: 10%;
        }

        // action section
        &:nth-child(2) {
          width: 50%;
        }

        &:nth-child(3) {
          width: 5%;
          flex-basis: 20px;
        }

        &:nth-child(4) {
          width: 5%;
          flex-basis: 10px;
        }

        &:nth-child(5) {
          width: 30%;
          flex-basis: 20%;
        }

        .attachment-icon,
        .comment-icon {
          font-size: 14px;
          width: 14px;
          padding: 0;
        }
      }
    }
  }

  .header {
    padding: 10px 20px 10px 5px;

    height: 63px;
    border-bottom: 0.5px solid #d0d0d0;
    justify-content: space-between;
    display: flex;

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
    justify-content: flex-start;
  }
  .grid-col {
    flex-basis: 120px;
  }
  .num-col {
    flex: 0 0 10px;
  }

  .sub-list {
    border-bottom: 1px solid#d0d0d0;
    height: 60px;
    max-height: 60px;

    &.action-row-active {
      background-color: rgb(236, 236, 236);

      .subaction-input {
        background-color: rgb(236, 236, 236);
      }
    }

    &:hover {
      background-color: rgb(236, 236, 236);

      .subaction-input {
        background-color: rgb(236, 236, 236);
      }
    }

    .action-row {
      border-bottom: none;
      padding-left: 5px;
      position: relative;
      max-height: 60px;

      .action-title {
        left: 20px;
      }

      .subaction-input {
        left: 0px;
        padding-left: 0;
      }

      &:hover,
      &.action-row-active {
        background-color: transparent;
      }

      .status-item {
        left: 20px;
      }
    }
  }
  .action-row {
    border-bottom: 1px solid #d0d0d0;
    justify-content: space-between;
    display: flex;
    height: 60px;
    max-height: 60px;
    padding-right: 20px;

    .status-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding-right: 20px;

      .drag-grip {
        width: 24px;
      }

      .expand-caret {
        left: 40px;
        color: gray;
        font-size: 24px;

        .caret-right {
          -webkit-transition: all 0.3s ease;
          -moz-transition: all 0.3s ease;
          -o-transition: all 0.3s ease;
          -ms-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .caret-down {
          transform: rotate(90deg);
          -webkit-transition: all 0.3s ease;
          -moz-transition: all 0.3s ease;
          -o-transition: all 0.3s ease;
          -ms-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }
      }
    }

    .subaction-input {
      padding-left: 20px;
    }

    .activity-title {
      display: flex;
      align-items: center;

      .add-subaction-icon {
        color: gray;
        font-size: 24px;
        margin-left: 10px;
      }
    }

    .setIconRight {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .takeRight {
      justify-content: space-between;
      display: flex;
      align-items: center;
      right: 0;
    }
    .textBreak80 {
      width: 80%;
    }
    .subContent {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .subContentRight {
      align-items: center;
      float: right;
      display: flex;
    }

    .action-title {
      *:first-child {
        margin-left: 10px;
      }
    }

    &:hover,
    &.action-row-active {
      background-color: rgb(236, 236, 236);

      .action-name {
        input {
          background-color: rgb(236, 236, 236);
        }
      }
    }

    .owner-col {
      display: flex;
      justify-content: space-around;
      align-content: center;

      .attachment-icon,
      .comment-icon {
        width: 20px;
        color: gray;
        font-size: 20px;
      }

      .comment {
        width: 20px;
        display: flex;
        align-items: center;

        .unread-comment-icon {
          width: 20px;
          color: red;
          font-size: 20px;
        }

        .assign-task {
          display: flex;
          justify-content: center;
          width: 40px;
        }
      }
    }

    & > div {
      width: calc(100% / 6);
      padding: 0px 5px;
      text-align: center;
      justify-content: center;
      align-self: center;
      min-height: 34px;
      min-width: 118px;
      display: flex;
      align-items: center;

      .planname {
        color: #b359a4;
        display: flex;
        align-items: center;
        position: relative;
      }

      &.planname {
        justify-content: flex-start;
      }
    }

    .action-name {
      display: flex;
      justify-content: space-between;
      text-align: left;

      input {
        border: 0;
        background-color: #f8f8f8;
        width: 100%;
      }
    }
  }

  .dummy-action-row {
    .subaction-input {
      padding-left: 15px;
    }
  }
}

.pointer {
  cursor: pointer;
}

.icon-container {
  i {
    cursor: pointer;
    padding: 10px;
    font-size: 20px;
  }
  i:hover {
    text-shadow: 0px 0px 3px grey;
  }
}

.learn_icon {
  font-size: 25px;
}
.show-hover {
  display: none;
  font-size: 27px;
  padding: 5px;
}

.action-row:hover {
  .show-hover {
    display: inline-block;
  }
}

/* Mobile styles */
@media (max-width: 576px) {
  .toggle-column-mobile {
    display: none !important;
  }

  .flex-list {
    .action-row {
      height: auto;
      padding: 5px 0;

      .status-item {
        .drag-grip {
          display: block;
          left: 0;
        }
      }

      & > div {
        min-width: auto;
        flex-grow: 0;
        flex-shrink: 0;

        &.action-name {
          font-size: 12px;
        }

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

        // learn section
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

.daterange_selector {
  .daterange_picker {
    display: flex;

    .daterange_caret {
      padding-top: 1px;
      padding-left: 2px;
      width: 16px;
      height: 16px;

      .daterange_caret_icon {
        display: none;
      }
    }

    &:hover {
      .daterange_caret_icon {
        display: block;
      }
    }
  }
}

</style>

<style lang="scss">
/* Overwrite checkbox margin */
@media (max-width: 576px) {
  .flex-list {
    .action-row {
      .pretty {
        margin-right: 0;
      }
    }
  }
}
</style>

<style>
.vdatetime-input {
  border: 0px !important;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  text-align: center;
}
</style>

<style>
.form-control.reportrange-text {
  border: none !important;
  background: none !important;
}
</style>