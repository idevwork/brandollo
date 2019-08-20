<template>
  <div class="action-details">
    <div
      class="row-flex pl-1 pl-sm-3 pr-1 pr-sm-0 flex-column flex-sm-row align-items-sm-center meta"
    >
      <!-- Assign task -->
      <AssignTaskPopover
        class="assign"
        :permission="permissions.changestatus"
        :members="members"
        :action="action"
        :showAssignText="true"
        :details-mode="true"
        @assignMember="assignMember"
      />

      <!-- Pick dates -->
      <div :class="['date', {'disabled': action && action.completed}]">
        <DatePicker
          ref="picker"
          class="date_range"
          v-if="actionStartDate && actionFinishDate"
          :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"
          :minDate="dateToday"
          v-model="actionDateRange"
          :ranges="false"
          :auto-apply="true"
          @update="updateDatePicker"
          @toggle="userAllowedChange"
        >
          <div slot="input" slot-scope="picker" class="date_picker">
            <div>{{ picker.startDate ? picker.startDate.toLocaleDateString() : "Select Date"}}</div>
            <div class="date_picker_divider">
              <font-awesome-icon icon="angle-right" />
            </div>
            <div>{{ picker.endDate ? picker.endDate.toLocaleDateString() : "Select Date"}}</div>
            <div class="daterange_caret">
              <font-awesome-icon
                class="daterange_caret_icon"
                icon="caret-down"
                style="color: gray; font-size: 16px"
              />
            </div>
          </div>
        </DatePicker>
      </div>

      <div class="plan_dropdown">
        <div class="plan_dropdown" v-if="!action.parentId">
          <span class="d-flex align-items-center font-weight-bold">Plan:</span>
          <PlanDropdown :action="action" :right="true" class="ml-1" />
        </div>
      </div>

      <!-- Delete action -->
      <!-- <i
        style="color: gray"
        @click="deleteAction(action)"
        variant="link"
        title="Delete action"
        class="fa fa-trash"
      ></i>-->
    </div>

    <!-- Plan dropdown
    <div class="d-flex mt-0 mt-sm-3 pl-1 pl-sm-4">
      <span class="d-flex align-items-center font-weight-bold">Plan:</span>
      <PlanDropdown :action="action" :right="true" class="ml-1" />
    </div>-->

    <hr />

    <div v-if="action && action.actionTask && action.actionTask.length > 0" class="col-flex tasks">
      <SidebarCategory :title="'Tasks'">
        <b-row class="sidebar__link" v-for="(task, index) in action.actionTask" :key="index">
          <b-col class="sidebar__link-title">
            <span class="blue-circle"></span>
            &nbsp; &nbsp; {{task.title}}
          </b-col>
        </b-row>
      </SidebarCategory>
    </div>

    <hr v-if="action && action.actionTask && action.actionTask.length > 0" />

    <!-- Comments -->
    <div class="col-flex comments">
      <h5 class="pl-1 pl-sm-5">Discussion</h5>
      <div
        id="comments"
        style="max-height: 390px; overflow: auto"
        class="pl-1 pl-sm-5"
        v-if="comments && comments.length > 0"
      >
        <!-- Comment -->
        <div v-for="(comment, index) in comments" :key="index" class="comment row-flex">
          <Avatar
            v-if="comment.userId"
            style="margin-right:15px;"
            :name="getUser(comment.userId)"
            size="tiny"
          />&nbsp;
          <!-- Comment body -->
          <div class="col-flex comment-body">
            <div class="comment-meta">
              <span class="font-weight-bold">{{getUser(comment.userId)}}</span> &nbsp;
              <span class="time">{{comment.createdOn | fromNow}}</span>
              <span class="buttons" v-if="userId === comment.userId">
                <a href @click.prevent="editModeToggle(comment.id)">Edit</a> &nbsp;
                <a href @click.prevent="deleteComment(comment.id)">Delete</a>
              </span>
            </div>
            <p v-if="!comment.editMode" class="comment-text" v-html="comment.commentText"></p>

            <!-- WHAT TAKES IN COMMENT FOR EDITING -->
            <input
              v-else
              type="text"
              class="comment-text"
              :value="comment.rawCommentText"
              @click.stop
              @keydown="editComment(comment, $event)"
            />

            <div v-if="comment.videoYoutube" class="d-flex" flex-wrap>
              <video-player
                :source="comment.videoYoutube"
                class="player-div"
                width="300"
                height="200"
              ></video-player>
            </div>
            <div v-if="comment.videoVimeo" class="d-flex" flex-wrap>
              <video-player
                :source="comment.videoVimeo"
                class="player-div"
                width="300"
                height="200"
              ></video-player>
            </div>

            <!-- Attachments -->
            <div class="d-flex flex-wrap">
              <a
                v-for="(attachment, index) in comment.attachedOthers"
                :key="attachment.id"
                :href="attachment.signedUrl"
                class="comment-attachment"
              >{{ `attachment_${index + 1}` }}</a>
            </div>

            <!-- Inline images -->
            <div class="d-flex flex-wrap">
              <img
                v-for="(image,ix) in comment.attachedImages"
                :key="'img'+ ix"
                :src="image.signedUrl"
                class="attached-image"
                @click="setLightboxData({ images: [image.signedUrl], visible: true })"
              />
            </div>
          </div>
        </div>
      </div>
      <span class="pl-1 pl-sm-5" v-else>No comments...</span>

      <!-- Comment box -->
      <CommentBox :members="members" :action="action" @add-comment="addComment" />
    </div>
  </div>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";

import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { map, clone, findIndex } from "lodash";

import commentService from "@/Common/services/CommentService";
import TeamService from "@/Common/services/TeamService";
import notificationMixin from "@/Common/mixins/Notification";
import VideoPlayer from "@/Common/components/VideoPlayer";
import DateLib from "@/Common/functions/Dates";

import AssignTaskPopover from "../../components/Shared/popovers/AssignTaskPopover";
import PlanDropdown from "../../components/Plans/PlanDropdown";
import Avatar from "../../components/Shared/Avatar";
import SidebarCategory from "../../components/Actions/sidebar/SidebarCategory";
import CommentBox from "../../components/Shared/CommentBox";

export default {
  name: "DetailsView",
  mixins: [notificationMixin],
  props: ["action", "format"],
  components: {
    AssignTaskPopover,
    PlanDropdown,
    Avatar,
    SidebarCategory,
    CommentBox,
    DatePicker: DateRangePicker,
    VideoPlayer
  },
  data() {
    return {
      actionStartingDate: null,
      datePickerFormat: {
        night: "Day",
        nights: "Days",
        "day-names": ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
        "check-in": "Start-Date",
        "check-out": "End-Date",
        "month-names": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ]
      },
      rawComments: [],

      dateToday: new Date()
    };
  },
  computed: {
    ...mapState({
      members: state => state.teamStore.currentTeam.members,
      permissions: state => state.teamStore.currentPermissions,
      user: state => state.userStore.user,
      pendingOperation: s => !s.actionStore.isOperationReady,
      zoneName: s => s.userStore.user.profile.zoneinfo
    }),
    ...mapGetters({
      getUser: "getTeamMemberName",
      teamId: "currentTeamId",
      getPlanColor: "getPlanColor",
      userId: "userId"
    }),

    /**
     * Getters for action dates
     */
    actionStartDate() {
      if (!this.action || !this.action.planStart) {
        let d = DateLib.getUtcNow();
        return DateLib.getUserJsDate(this.zoneName, d);
      }
      var d = DateLib.getUserJsDate(this.zoneName, this.action.planStart);
      return d;
    },

    actionFinishDate() {
      if (!this.action || !this.action.planFinish || !this.action.planStart) {
        let d = DateLib.getUtcNow();
        d = DateLib.addDays(d, 1);
        return DateLib.getUserJsDate(this.zoneName, d);
      }
      var d = DateLib.getUserJsDate(this.zoneName, this.action.planFinish);
      return d;
    },

    actionDateRange: {
      get() {
        let d = {
          startDate: null,
          endDate: null
        };

        if (this.action.planStart) {
          d.startDate = DateLib.getUserJsDate(
            this.zoneName,
            this.action.planStart
          );
        }

        if (this.action.planFinish) {
          d.endDate = DateLib.getUserJsDate(
            this.zoneName,
            this.action.planFinish
          );
        }

        if (!this.action || !this.action.planFinish || !this.action.planStart) {
          let d = {
            startDate: DateLib.getUtcNow(),
            endDate: DateLib.addDays(DateLib.getUtcNow(), 1)
          };
        }

        return d;
      },
      set(value) {
        return value;
      }
    },

    comments() {
      let cc = map(this.rawComments, c => {
        let out = clone(c);

        if (c.attachment) {
          out.attachedImages = c.attachment.filter(a => {
            const pathname = new URL(a.signedUrl).pathname;
            return /\.(gif|jpe?g|tiff|png)$/i.test(pathname);
          });

          out.attachedOthers = c.attachment.filter(a => {
            const pathname = new URL(a.signedUrl).pathname;
            return !/\.(gif|jpe?g|tiff|png)$/i.test(pathname);
          });
        }

        if (c.commentText) {
          out.rawCommentText = c.commentText;

          var p = /(^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))(\w|-){11})(?:\S+)?$/;
          out.videoYoutube = c.commentText.match(p) ? RegExp.$1 : null;
          let vreg = /(https?:\/\/(?:www\.)?vimeo.com\/\d+)/;
          out.videoVimeo = c.commentText.match(vreg) ? RegExp.$1 : null;

          out.commentText = c.commentText.replace(
            /(@[a-zA-Z]+)/g,
            "<span style='color:rgb(40, 117, 218)'>$1</span>&nbsp"
          );
        }

        return out;
      });
      return cc;
    }
  },
  created() {
    // Populate comments from the backend
    commentService.getComments(this.action.id).then(res => {
      res.forEach(comment => (comment.editMode = false));
      this.rawComments = res;
    });
  },
  methods: {
    ...mapActions({
      assignTaskFromStore: "assignTask",
      removeAction: "removeAction",
      planActionFromStore: "planAction"
    }),
    ...mapMutations({
      setLightboxData: "SET_LIGHTBOX_DATA"
    }),

    // Add comment
    addComment(comment) {
      this.rawComments.push(comment);
    },
    // Assign member
    assignMember({ action, member }) {
      this.dismissPopper();

      const payload = {
        id: action.id,
        teamId: this.teamId,
        assignedUserId: member
      };

      this.assignTaskFromStore(payload)
        .then(() => {
          this.showToast(!member ? "Task unassigned!" : "Task assigned!");
        })
        .catch(error => {
          this.showToast(error.Message, "error");
        });
    },

    /**
     * Functions to update dates
     */

    updateActionStartDate: function(event) {
      if (event != null) {
        this.actionStartingDate = new Date(event);
      }
    },

    updateActionEndDate: function(event) {
      if (event != null) {
        let planStart = DateLib.getUtcFromJsDate(this.actionStartingDate);
        let planFinish = DateLib.getUtcFromJsDate(new Date(event));

        this.planActionFromStore({ ...this.action, planStart, planFinish });
      }
    },

    updateDatePicker(e) {
      if (e != null) {
        let planStart = DateLib.getUtcFromJsDate(e.startDate);
        let planFinish = DateLib.getUtcFromJsDate(e.endDate);

        this.planActionFromStore({ ...this.action, planStart, planFinish });
      }
    },

    userAllowedChange(event, toggle) {
      let role = this.members.find(m => m.userId === this.userId).role;

      if (this.action.completed || role === "member") {
        toggle(false);
      }
    },

    currentDate() {
      return new Date();
    },

    /**
     * functions to delete and edit comments
     */
    deleteComment(commentId) {
      this.$swal({
        text: "Are you sure you want to delete?",
        showConfirmButton: true,
        showCloseButton: true,
        showCancelButton: true
      }).then(data => {
        if (!data.dismiss) {
          commentService.deleteComment({ id: commentId }).then(d => {
            let toRemove = findIndex(this.rawComments, c => c.id == commentId);
            this.rawComments.splice(toRemove, 1);
            this.showToast("Comment deleted!", "success");
          });
        }
      });
    },
    editComment(comment, event) {
      if (event.key === "Enter") {
        comment.commentText = event.target.value;

        // find any tagged users and put them into comment to send off!
        let tagged = comment.commentText.match(/@([a-zA-Z]+)/g);

        let taggedUserNames = [];
        if (tagged) {
          taggedUserNames = tagged.map(name => name.substring(1));
        }

        let taggedUsers = this.members.filter(member => {
          return taggedUserNames.find(tagged => {
            return (
              tagged.toLowerCase() === member.userDetailsFirstName.toLowerCase()
            );
          });
        });

        comment.taggedUser = taggedUsers.map(user => user.userId);

        return new Promise((resolve, reject) => {
          commentService.updateComment(comment).then(() => {
            comment.editMode = false;
            let index = this.rawComments.findIndex(c => c.id === comment.id);
            this.rawComments.splice(index, 1, comment);
            this.showToast("Comment edited!", "success");
          });
        });
      }
    },
    editModeToggle(cId) {
      let index = this.rawComments.findIndex(comment => comment.id === cId);

      let editComment = this.rawComments[index];
      editComment.editMode = !editComment.editMode;

      this.rawComments.splice(index, 1, editComment);
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
            this.closeActionDetails();
            this.showToast("Action deleted!", "success");
          });
        }
      });
    },

    // Dismiss Popper
    dismissPopper() {
      document.body.click();
      const modal = document.querySelector(".modal.fade.show");
      if (modal) {
        modal.click();
      }
    },

    // Navigate back to the list
    closeActionDetails() {
      if (this.$route.query.p == "timeline") {
        this.$router.push({ name: "gantt-timeline" });
        return;
      }
      this.$router.push({ name: "actions-list" });
    }
  },
  watch: {
    // Action changed - update comments
    action(act) {
      commentService.getComments(act.id).then(res => (this.rawComments = res));
    },

    // Handle comments everytime they change
    comments() {
      // Scroll comments section
      const container = document.getElementById("comments");
      if (container) {
        setTimeout(() => (container.scrollTop = container.scrollHeight), 1000);
      }
    }
  },
  filters: {
    fromNow: date => {
      return DateLib.ago(date);
    }
  }
};
</script>

<style lang="scss" scoped>
.row-flex {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.col-flex {
  display: flex;
  flex-direction: column;
}

.fa-trash {
  font-size: 20px;
  color: rgb(236, 103, 103);
  cursor: pointer;
  padding-right: 20px;

  &:hover {
    color: rgb(223, 75, 75);
  }
}

.meta {
  justify-content: space-between;

  .date {
    display: flex;
    width: auto;

    .date_range {
      height: 24px;
      margin: 0 24px;

      display: flex;
      justify-content: center;
      align-items: center;

      .date_picker {
        padding-left: 24px;
        font-family: Roboto;
        font-weight: normal;
        font-size: 16px;

        display: flex;
        justify-content: center;
        align-items: center;

        .date_picker_divider {
          padding: 0 16px;
          font-size: 16px;
        }

        .daterange_caret {
          padding-left: 16px;
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
  }

  .plan_dropdown {
    display: flex;
    width: auto;
  }
}

.tasks > ul {
  padding-left: 15px;

  li {
    margin-top: 5px;
    list-style-type: circle;
  }
}

.comments {
  > h5 {
    margin-bottom: 20px;
  }

  .time {
    color: rgb(158, 158, 158);
  }

  p {
    color: rgb(73, 73, 73);
    word-wrap: break-word;

    span {
      color: red !important;
    }
  }

  .comment {
    padding-top: 10px;

    &-body {
      flex-grow: 1;

      .comment-attachment {
        margin-right: 5px;
      }
      .buttons {
        padding-left: 40px;
        display: none;
      }
      &:hover {
        .buttons {
          display: inline-block;
        }
      }
    }
  }
}

.blue-circle {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: #3cb5ff;
  display: inline-block;
  vertical-align: middle;
}

.comment-text {
  margin-bottom: 0;
}

.attached-image {
  margin-top: 5px;
  margin-right: 15px;
  width: 100px;
  height: 50px;
  object-fit: contain;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .meta {
    flex-direction: column !important;
    padding: 0 24px 0 0;

    .plan_dropdown {
      display: flex;
      padding-left: 32px;
    }

    .date {
      padding: 8px 0;
    }
  }
}

/* Mobile styles */
@media (max-width: 576px) {
  .meta {
    align-items: center;

    .date {
      width: 100%;
      margin: 15px 0;
      justify-content: center !important;

      .date_range {
        // justify-content: center;
        margin: 0 !important;

        .date_picker {
          // justify-content: center;
          margin-left: -10px;
        }
      }
    }
  }
}
</style>

<style>
</style>
