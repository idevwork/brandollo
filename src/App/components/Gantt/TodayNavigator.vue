<template>
  <g class="calendar-today-col" ref="navigator">
    <svg
      v-if="leftOfView"
      :x="leftX"
      :y="boxY"
      :width="boxWidth"
      :height="boxHeight"
      @click="focusOn"
      style="cursor: pointer"
    >
      <g class="caret-left" transform="translate(0,0)">
        <rect width="100%" height="100%" :style="{'fill': '#f8f8f8'}" />
        <g transform="translate(3,0)">
          <path
            transform="translate(0,-4)"
            style=" stroke:none;fill-rule:nonzero;fill-opacity:1; cursor: pointer"
            :style="{'fill': '#45ace1'}"
            d="M 10 6.464844 L 10 19.535156 C 10 20.4375 8.878906 20.890625 8.222656 20.25 L 1.519531 13.71875 C 1.113281 13.320312 1.113281 12.679688 1.519531 12.28125 L 8.222656 5.75 C 8.878906 5.109375 10 5.5625 10 6.464844 Z M 10 6.464844 "
          />
          <rect style="fill: 45ace1" transform="translate(9,1.4)" width="80%" height="85%" />
          <text
            style="fill: #ffffff"
            transform="translate(4, 1.5)"
            x="20%"
            y="60%"
            font-size="12"
          >today</text>
        </g>
      </g>
    </svg>
    <svg
      v-if="rightOfView"
      :x="rightX"
      :y="boxY"
      :width="boxWidth"
      :height="boxHeight"
      @click="focusOn"
      style="cursor: pointer"
    >
      <!-- <g class="caret-right" transform="translate(5, 2)">
        <path
          @click="focusOn"
          style=" stroke:none;fill-rule:nonzero;fill-opacity:0.5; cursor: pointer"
          :style="{'fill': '#000000'}"
          d="M 11.453125 6.847656 L 4.882812 0.277344 C 4.699219 0.09375 4.476562 0 4.222656 0 C 3.96875 0 3.75 0.09375 3.5625 0.277344 C 3.378906 0.464844 3.285156 0.683594 3.285156 0.9375 L 3.285156 14.078125 C 3.285156 14.332031 3.378906 14.554688 3.5625 14.738281 C 3.75 14.925781 3.96875 15.019531 4.222656 15.019531 C 4.476562 15.019531 4.699219 14.925781 4.882812 14.738281 L 11.453125 8.167969 C 11.640625 7.984375 11.734375 7.761719 11.734375 7.507812 C 11.734375 7.253906 11.640625 7.035156 11.453125 6.847656 Z M 11.453125 6.847656 "
        />
      </g>-->
      <g class="caret-left" transform="translate(0,0)">
        <rect width="100%" height="100%" :style="{'fill': '#f8f8f8'}" transform="translate(0,0)" />
        <g transform="translate(0,0)">
          <path
            transform="translate(38,1)"
            style=" stroke:none;fill-rule:nonzero;fill-opacity:1; cursor: pointer"
            :style="{'fill': '#45ace1'}"
            d="M 11.453125 6.847656 L 4.882812 0.277344 C 4.699219 0.09375 4.476562 0 4.222656 0 C 3.96875 0 3.75 0.09375 3.5625 0.277344 C 3.378906 0.464844 3.285156 0.683594 3.285156 0.9375 L 3.285156 14.078125 C 3.285156 14.332031 3.378906 14.554688 3.5625 14.738281 C 3.75 14.925781 3.96875 15.019531 4.222656 15.019531 C 4.476562 15.019531 4.699219 14.925781 4.882812 14.738281 L 11.453125 8.167969 C 11.640625 7.984375 11.734375 7.761719 11.734375 7.507812 C 11.734375 7.253906 11.640625 7.035156 11.453125 6.847656 Z M 11.453125 6.847656 "
          />
          <rect style="fill: 45ace1" transform="translate(-4,1.0)" width="80%" height="84.5%" />
          <text
            style="fill: #ffffff"
            transform="translate(-3, 1)"
            x="20%"
            y="60%"
            font-size="12"
          >today</text>
        </g>
      </g>
    </svg>
    <svg v-if="rightOfView" :x="rightX" :y="boxY" :width="dayWidth" :height="boxHeight" />
  </g>
</template>

<script>
import { DateTime, IANAZone } from "luxon";
import DateLib from "@/Common/functions/Dates";
import { map } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "TodayNavigator",
  components: {},
  props: [],
  computed: {
    ...mapState({
      rowHeight: s => s.timeline.options.calendar.rowHeight,
      dayWidth: s => s.timeline.options.largeUnit,
      scrollY: s => s.timeline.scrollY
    }),
    ...mapGetters({
      timelineBounds: "timeline/dateBounds",
      viewWindow: "timeline/viewWindow",
      today: "timeline/todayPosition",
    }),
    boxY() {
      return this.scrollY < 102 ? 1 : this.scrollY - 63;
    },
    boxHeight() {
      return this.rowHeight / 3 - 2;
    },
    boxWidth() {
      return this.dayWidth + 8;
    },
    leftX() {
      return this.viewWindow.minX;
    },
    rightX() {
      return this.viewWindow.maxX - this.boxWidth;
    },
    // leftOfView() {
    //   let rightX = this.activity.x + this.activity.width;

    //   return rightX < this.viewWindow.minX ? true : false;
    // },
    leftOfView() {
      let rightX = this.today.x + this.today.width;

      return rightX < this.viewWindow.minX ? true : false;
    },
    // rightOfView() {
    //   let leftX = this.activity.x;

    //   return leftX > this.viewWindow.maxX ? true : false;
    // },
    rightOfView() {
      let leftX = this.today.x;

      return leftX > this.viewWindow.maxX ? true : false;
    }
  },
  methods: {
    ...mapActions({
      updateViewWindow: "timeline/updateViewWindow"
    }),
    focusOn() {
      let viewWindow = {
        minX: this.today.x - 5 * this.dayWidth,
        maxX: this.today.x + this.viewWindow.width - 5 * this.dayWidth,
        width: this.viewWindow.width
      };

      this.updateViewWindow(viewWindow);
    },
  }
};
</script>


<style lang="scss" scoped>
.calendar-today-col {
  path {
    fill: #ff0000a6;
  }
}
</style>

