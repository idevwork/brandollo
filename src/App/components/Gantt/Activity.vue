<template>
  <svg
    :x="boxX"
    :y="boxY"
    :width="boxWidth"
    :height="boxHeight"
    class="layout-activity"
    @mousedown="startMove($event, activity.object.id)"
    
  >
  <!-- @mouseleave="endMove" -->
    <defs>
      <!-- <pattern
        id="diagonalHatch"
        width="20"
        height="20"
        patternTransform="rotate(45 0 0)"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="20"
          class="chart-row-progress-bar-line"
          style="stroke: rgba(255, 255, 255, 0.145); stroke-width: 20;"
        ></line>
      </pattern>-->

      <pattern
        :id="'pattern'+activity.object.id"
        patternUnits="userSpaceOnUse"
        width="20"
        height="20"
      >
        <rect width="100%" height="100%" :style="boxStyle.fill"></rect>
        <path
          v-if="activity.subAction"
          d="M 0 0 L 20 20 M 10 -10 L 30 10 M -10 10 L 10 30"
          :style="boxStyle.stroke"
        ></path>
      </pattern>
    </defs>

    <!-- <path d="M0,0 h50 v10 h-50 z" :style="boxStyle" :class="{sub: activity.subAction}" /> -->
    <rect
      v-if="!activity.subAction && activity.expanded"
      width="100%"
      height="25%"
      y="50%"
      :class="{sub: activity.subAction}"
      :fill="'url(#pattern'+activity.object.id + ')'"
    ></rect>
    <rect
      width="100%"
      height="50%"
      y="25%"
      rx="15"
      ry="15"
      :fill="'url(#pattern'+activity.object.id + ')'"
    ></rect>
    <!-- <text x="50%" y="50%">{{activity.label}}</text> -->
    <g
      class="caret-left"
      transform="translate(5, 16)"
      @mousedown.stop.prevent="startResize($event, activity.object.id, 'left')"
    >
      <path
        style=" stroke:none;fill-rule:nonzero;fill-opacity:1;"
        d="M 10 6.464844 L 10 19.535156 C 10 20.4375 8.878906 20.890625 8.222656 20.25 L 1.519531 13.71875 C 1.113281 13.320312 1.113281 12.679688 1.519531 12.28125 L 8.222656 5.75 C 8.878906 5.109375 10 5.5625 10 6.464844 Z M 10 6.464844 "
      ></path>
    </g>
    <g
      class="caret-right"
      :transform="transformCaretRight"
      @mousedown.stop.prevent="startResize($event, activity.object.id, 'right')"
    >
      <path
        style=" stroke:none;fill-rule:nonzero;fill-opacity:1;"
        d="M 11.453125 6.847656 L 4.882812 0.277344 C 4.699219 0.09375 4.476562 0 4.222656 0 C 3.96875 0 3.75 0.09375 3.5625 0.277344 C 3.378906 0.464844 3.285156 0.683594 3.285156 0.9375 L 3.285156 14.078125 C 3.285156 14.332031 3.378906 14.554688 3.5625 14.738281 C 3.75 14.925781 3.96875 15.019531 4.222656 15.019531 C 4.476562 15.019531 4.699219 14.925781 4.882812 14.738281 L 11.453125 8.167969 C 11.640625 7.984375 11.734375 7.761719 11.734375 7.507812 C 11.734375 7.253906 11.640625 7.035156 11.453125 6.847656 Z M 11.453125 6.847656 "
      ></path>
    </g>
  </svg>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import DateLib from "@/Common/functions/Dates";

export default {
  name: "Timeline-Activity",
  components: {},
  props: ["activity"],
  data() {
    return {
      offset: {
        x: 0,
        y: 0
      },
      dragX: null
    };
  },
  computed: {
    ...mapState({
      dayWidth: s => s.timeline.options.unit,
      startingHeight: s => s.timeline.options.activities.heightStart,
      rowHeight: s => s.timeline.options.activities.height,
      changingAction: s => s.timeline.changingAction,
    }),
    ...mapGetters({
      actions: "actions", 
      timelineBounds: "timeline/dateBounds",
    }),
    transformCaretRight() {
      if (
        this.changingAction &&
        this.activity &&
        this.activity.object &&
        this.activity.object.id
      ) {
        return `translate(${(this.activity.object.id === this.changingAction.id
          ? this.changingAction.width
          : this.activity.width) - 20}, 22)`;
      } else if (this.activity) {
        return `translate(${this.activity.width - 20}, 22)`;
      }
    },
    boxX() {
      return this.changingAction &&
        this.changingAction.x &&
        this.changingAction.id === this.activity.object.id
        ? this.changingAction.x
        : this.activity.x;
    },
    boxY() {
      return this.activity.y;
    },
    boxWidth() {
      return this.changingAction &&
        this.activity.object.id === this.changingAction.id
        ? this.changingAction.width
        : this.activity.width;
    },
    boxHeight() {
      return this.activity.height;
    },
    boxStyle() {
      // return `fill: ${this.activity.color};`;
      return {
        fill: this.activity.subAction
          ? `fill: ${this.activity.color}; opacity: 0.5`
          : `fill: ${this.activity.color};`,
        stroke: `stroke: ${this.activity.color}; stroke-width:8;`
      };
    }
  },
  methods: {
    ...mapActions({
      dragStarted: "timeline/dragStarted",
      dragEnded: "timeline/dragEnded",
      planAction: "planAction",
      startChange: "timeline/startChange",
    }),

    getMousePosition(evt) {
      //TODO better way to get parent transformation matrix
      let canvas = document.getElementById("timeline-canvas");
      var CTM = canvas.getScreenCTM();
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    },

    // TODO: Do not allow negative resize
    // Start the resize
    startResize(evt, id, caret) {
      // Disable right click
      if (evt.button === 2) {
        return;
      }
      this.dragX = null;


      let payload = {
        id,
        x: this.getMousePosition(evt).x,
        type: caret,
      }
      this.startChange(payload);
    },

    startMove(evt, id) {
      this.offset = this.getMousePosition(evt);
      this.offset.x -= parseFloat(this.$el.getAttributeNS(null, "x"));

      let payload = {
        id,
        x: this.offset.x,
        type: "move",
      }

      this.startChange(payload);
    },

    updateActivityDates(activity, newStart) {
      let n = DateLib.moveDates(activity.planStart, activity.planFinish, newStart);

      const payload = {
        id: activity.id,
        userFormId: activity.userFormId,
        planStart: n.s,
        planFinish: n.e,
        planLane: activity.planLane,
        teamId: activity.teamId,
        parentId: activity.parentId,
        actions: activity.actions,
      };

      return payload;
    },

    getDateFromX(index) {      
      return DateLib.addDays(this.timelineBounds.start,index); 
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-activity {
  rect {
    // fill: blue;
    // stroke: red;
    // stroke-width: 1;
    cursor: move;

    &.sub {
      stroke: blue;
    }
  }
  text {
    fill: black;
    dominant-baseline: middle;
    text-anchor: middle;
    cursor: move;
    text-overflow: ellipsis;
  }

  .caret-left {
    font-size: 10px;
    cursor: w-resize;
    fill: white;
  }

  .caret-right {
    font-size: 10px;
    cursor: e-resize;
    fill: white;
  }
}
</style>
