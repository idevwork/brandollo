<template>
  <div
    class="timeline2 text-white"
    :style="style"
    @mousedown.left.prevent.stop="mousedown('drag', $event)"
  >
    <div :class="contentClass" ref="content">
      <div class="frow">
        <div class="title">
          <a @click="showDetails(timeline.id)">{{timeline.text}}</a>
        </div>
      </div>
      <div class="frow avatar-container">
        <avatar
          v-if="timeline.user"
          style="margin:5px"
          :name="getTeamMember(timeline.user).userDetailsFirstName"
          size="tiny"
          :order="getTeamMember(timeline.user).position"
        />
        <div>
          <popper trigger="hover" :options="{placement: 'top-end'}">
            <div class="popper" style="min-width:200px">
              You have some overlapping actions over here. Spread them out the lanes below for better
              visibility!
            </div>
            <span slot="reference">
              <avatar
                v-if="timeline.overlap > 1"
                style="margin:5px"
                :name="timeline.overlap.toString()"
                :palette="2"
                size="tiny"
              />
            </span>
          </popper>
        </div>
      </div>
    </div>
    <div class="resize-handle" @mousedown.left.prevent.stop="mousedown('resize', $event)"></div>
  </div>
</template>

<style lang="scss">
.timeline-designer-layout {
  .timeline2 {
    // padding: 5px;
    position: absolute;
    border: black 1px solid;

    .content,
    .close {
      display: flex;
      flex-direction: column;
      padding-top: 5px;
      padding-left: 5px;
      margin-right: 4px;
      cursor: move;
      .frow {
        margin: 0;
        display: flex;
        padding-left: 10px;
        padding-right: 10px;
        -ms-flex-wrap: wrap;
        &.avatar-container {
          padding-left: 0px;
          position: absolute;
          bottom: 1px;
        }
        .title {
          color: white;
          width: 85%;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          padding: 2px;
        }
        .learn {
          width: 10%;
          text-align: right;
          padding-right: 5px;
        }
        [class^="avatar-circle"] {
          position: relative;
          bottom: 3px;
        }
      }
    }

    .content {
      height: 100%;
      border-radius: 9px;
      &::before {
        content: "";
        position: absolute;
        height: 100%;
        width: 6px;
        top: 0px;
        left: -1px;
        border-radius: 9px 0px 0px 9px;
      }
      &::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 80px;
        background: white;
        right: 8px;
        top: 12px;
        opacity: 0.5;
      }
    }

    .menu {
      position: absolute;
      bottom: 15px;
      right: 5px;
      height: 8px;
      line-height: 0;
      z-index: 100;
      span {
        color: white;
        font-size: 20px;
      }
      .dropdown-menu.show {
        left: 30px !important;
      }
      .dropdown-item {
        padding: 20px 20px;
      }
    }
    .close {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 23px;
      height: 23px;
      background: #fff;
      border: 1px solid #ccc;
      border-bottom-left-radius: 5px;

      &::before,
      &::after {
        content: "";
        position: absolute;
        height: 2px;
        top: 50%;
        left: 2px;
        right: 2px;
        margin-top: -1px;
        background: #ccc;
      }
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }

      &:hover {
        background-color: rgba(128, 128, 128, 0.1);
        &::before,
        &::after {
          background: #999;
        }
      }
    }

    .resize-handle {
      position: absolute;
      right: 0;
      width: 10px;
      cursor: e-resize;
      height: 100%;
      top: 0;

      &:hover {
        background-color: rgba(128, 128, 128, 0.1);
      }
    }
  }

  &.interact .timeline {
    transition-property: top, left, width, height;
    transition-duration: 0.4s;
  }
  .icon-container {
    height: calc(100% - 5px);
    width: calc(100% - 20px);
    top: 0;
    position: absolute;
    overflow: hidden;
  }
  @import "../../scss/dashboard/_variables.scss";
  .status-complete {
    background-color: $complete;
    border-radius: "3px";
    border: 1px solid $complete;
  }
  .status-pending {
    background-color: $pending;
    border-radius: "3px";
    border: 1px solid $pending;
    color: black;
  }
  .status-paused {
    background-color: $paused;
    border-radius: "3px";
    border: 1px solid $paused;
  }
  .status-started {
    background-color: $started;
    border-radius: "3px";
    border: 1px solid $started;
    color: black;
  }

  .plan-color-0::before {
    background: #b359a4;
  }
  .plan-color-1::before {
    background: #2389c7;
  }
  .plan-color-2::before {
    background: #82b960;
  }
  .plan-color-3::before {
    background: #de8e30;
  }
  .plan-color-4::before {
    background: #e1c014;
  }
  .plan-color-5::before {
    background: #b54e4e;
  }
}
</style>

<script>
import { Avatar } from "@/App/components/Shared";
import { mapGetters, mapActions } from "vuex";

import Popper from "vue-popperjs";
import "vue-popperjs/dist/css/vue-popper.css";

export default {
  name: "timeline",
  props: ["layout", "timeline", "units", "canassign"],
  components: {
    avatar: Avatar,
    popper: Popper
  },
  computed: {
    style() {
      //  let baseOverlap = this.timeline.overlap ? this.timeline.overlap + 1 : 1;
      //  let height = (this.timeline.h * this.units.v) / 1;

      return {
        top: this.timeline.y * this.units.v + "%",
        left: this.timeline.x * this.layout.colWidth + "px",
        width: this.timeline.w * this.layout.colWidth + "px",
        height: "100px", //this.timeline.h * this.units.v + "%",
        border: 0
      };
    },
    contentClass() {
      let classOutput = "";
      if (this.timeline.status == "pending") {
        classOutput = "content status-pending";
      }
      if (this.timeline.status == "complete") {
        classOutput = "content status-complete";
      }
      if (this.timeline.status == "started") {
        classOutput = "content status-started";
      }
      if (this.timeline.status == "paused") {
        classOutput = "content status-paused";
      }

      let plan = this.getPlanbyId(this.timeline.plan);
      if (plan) {
        classOutput = classOutput + " plan-color-" + plan.position;
      }

      return classOutput;
    },
    ...mapGetters({
      getTeamMember: "getTeamMember",
      getPlanbyId: "getPlanbyId"
    })
  },
  methods: {
    mousedown(name, e) {
      let outer = document.defaultView.getComputedStyle(this.$el);
      let inner = document.defaultView.getComputedStyle(this.$refs.content);

      this.$emit(name, {
        timeline: this.timeline,
        event: e,
        initialPos: {
          left:
            parseFloat(outer.getPropertyValue("left")) +
            parseFloat(outer.getPropertyValue("padding-left")) +
            parseFloat(outer.getPropertyValue("border-left-width")),
          top:
            parseFloat(outer.getPropertyValue("top")) +
            parseFloat(outer.getPropertyValue("padding-top")) +
            parseFloat(outer.getPropertyValue("border-top-width")),
          width: parseFloat(inner.getPropertyValue("width")),
          height: parseFloat(inner.getPropertyValue("height"))
        }
      });
    },
    start(actionId) {
      this.$emit("state-changed", {
        type: "start",
        id: actionId
      });
    },
    finish(actionId) {
      this.$emit("state-changed", {
        type: "finish",
        id: actionId
      });
    },
    cancel(actionId) {
      this.$emit("state-changed", {
        type: "cancel",
        id: actionId
      });
    },
    assign(actionId) {
      this.$root.$emit("assign-member", {
        actionId
      });
    },
    unassign(actionId) {
      this.$root.$emit("assign-member", {
        actionId,
        process: "unassign"
      });
    },
    remove(actionId) {
      this.$emit("state-changed", {
        type: "remove",
        id: actionId
      });
    },
    // TODO: Handle timeline visibility
    showDetails(actionId) {
      this.$router.push({ name: 'actionDetails', params: { actionId } });
    }
  }
};
</script>
