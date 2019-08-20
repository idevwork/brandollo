<template>
  <g class="calendar-today-col">
    <svg :x="today.x" :y="today.y" :width="today.width" :height="today.height">
      <foreignObject>
        <input ref="todcol" />
      </foreignObject>
      <rect width="100%" height="100%" />
    </svg>
  </g>
</template>

<script>
import { DateTime, IANAZone } from "luxon";
import DateLib from "@/Common/functions/Dates";
import { map } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Calendar",
  components: {},

  data() {
    return {
      scrollY: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.todcol.focus();

      let todayViewWindow = {
        minX: this.today.x - 3 * this.dayWidth,
        maxX: this.today.x + 2,
        width: 6
      };

      this.updateViewWindow(todayViewWindow);
    });
  },
  computed: {
    ...mapState({
      rowHeight: s => s.timeline.options.calendar.rowHeight,
      dayWidth: s => s.timeline.options.unit,
      zoneName: s => s.userStore.user.profile.zoneinfo
    }),
    ...mapGetters({
      totalHeight: "timeline/height",
      timelineBounds: "timeline/dateBounds",
      viewWindow: "timeline/viewWindow",
      today: "timeline/todayPosition",
    }),
    minirow() {
      return this.rowHeight / 3;
    },
  },
  methods: {
    ...mapActions({
      updateViewWindow: "timeline/updateViewWindow"
    })
  }
};
</script>


<style lang="scss" scoped>
.calendar-today-col {
  rect {
    fill: #3aa7cf42;
  }
}
</style>

