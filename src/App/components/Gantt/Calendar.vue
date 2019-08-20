<template>
  <g class="timeline-calendar">
    <g class="calendar-month-row">
      <svg
        v-for="(m,i) in months"
        :key="m.label + i"
        :x="m.x"
        :y="m.y"
        :width="m.width"
        :height="m.height"
      >
        <rect width="100%" height="100%"></rect>
        <text x="50%" y="50%">{{m.label}}</text>
      </svg>
    </g>

    <g class="calendar-date-row">
      <svg v-for="(d,i) in dates" :key="i" :x="d.x" :y="d.y" :width="d.width" :height="d.height">
        <rect class="filler" width="100%" height="100%"></rect>
        <rect v-if="d.isToday" width="100%" height="100%"></rect>
        <text x="50%" y="50%">{{d.label}}</text>
        <line :x1="d.width" :y1="0" :x2="d.width" :y2="d.height"></line>
      </svg>
    </g>

    <g class="calendar-day-row">
      <svg v-for="(d,i) in days" :key="i" :x="d.x" :y="d.y" :width="d.width" :height="d.height">
        <rect class="filler" width="100%" height="100%"></rect>
        <rect v-if="d.isToday" width="100%" height="100%"></rect>
        <text x="50%" y="50%">{{d.label}}</text>
        <line :x1="d.width" :y1="0" :x2="d.width" :y2="d.height"></line>
        <line x1="0" :y1="d.height" :x2="d.width" :y2="d.height"></line>
      </svg>
    </g>
  </g>
</template>

<script>
import { DateTime, IANAZone } from "luxon";
import { map } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";

import DateLib from "@/Common/functions/Dates";
import Debounce from "@/Common/functions/Debounce";

export default {
  name: "Calendar",
  components: {},

  data() {
    return {
      // scrollY: 0
    };
  },
  mounted() {
    var timer = null;
    window.addEventListener("scroll", this.smoothScroll());
  },
  destroyed() {
    window.removeEventListener("scroll", this.smoothScroll());
  },
  computed: {
    ...mapState({
      rowHeight: s => s.timeline.options.calendar.rowHeight,
      dayWidth: s => s.timeline.options.unit,
      zoneName: s => s.userStore.user.profile.zoneinfo,
      scrollY: s => s.timeline.scrollY,
    }),
    ...mapGetters({
      totalHeight: "timeline/height",
      timelineBounds: "timeline/dateBounds",
      viewWindow: "timeline/viewWindow",
    }),
    minirow() {
      return this.rowHeight / 3;
    },
    scrollHeight() {
      return this.scrollY < 102 ? 0 : this.scrollY - 64;
    },
    months() {
      let start = DateTime.fromISO(this.timelineBounds.start);
      let end = DateTime.fromISO(this.timelineBounds.end);
      let months = end.diff(start, "months").toObject();

      let output = [];
      let c = start;
      let monthStart = 0;
      for (let i = 0; i < Math.ceil(months.months); i++) {
        let name = c.monthLong;
        let len = c
          .endOf("month")
          .diff(c.startOf("month"), "days")
          .toObject().days;

        // if  start date is not 1st of month truncate extra
        if (c.month == start.month) {
          len = len - c.diff(start.startOf("month"), "days").toObject().days;
        }

        output.push({
          label: name,
          days: len,
          x: monthStart,
          y: this.scrollHeight,
          width: len * this.dayWidth,
          height: this.minirow
        });
        monthStart = monthStart + len * this.dayWidth;
        c = c.plus({ month: 1 });
      }
      return output;
    },
    dates() {
      const zone = new IANAZone("Australia/Melbourne");

      let start = DateTime.fromISO(this.timelineBounds.start);
      let end = DateTime.fromISO(this.timelineBounds.end);
      let months = end.diff(start, "days").toObject();
      let today = DateTime.utc().setZone(zone);
      let output = [];
      let c = start;
      let dayStart = 0;
      for (let i = 0; i <= Math.ceil(months.days); i++) {
        output.push({
          label: c.day,
          x: dayStart,
          y: this.minirow + this.scrollHeight,
          width: this.dayWidth,
          height: this.minirow,
          isToday: today.day == c.day && today.month == c.month
        });
        c = c.plus({ day: 1 });
        dayStart = dayStart + this.dayWidth;
      }
      return output;
    },
    days() {
      const zone = new IANAZone("Australia/Melbourne");

      let start = DateTime.fromISO(this.timelineBounds.start);
      let end = DateTime.fromISO(this.timelineBounds.end);
      let months = end.diff(start, "days").toObject();

      let today = DateTime.utc().setZone(zone);

      let output = [];
      let c = start;
      let dayStart = 0;
      for (let i = 0; i <= Math.ceil(months.days); i++) {
        output.push({
          label: c.weekdayShort[0],
          x: dayStart,
          y: this.minirow + this.minirow + this.scrollHeight,
          width: this.dayWidth,
          height: this.minirow,
          isToday: today.day == c.day && today.month == c.month
        });
        c = c.plus({ day: 1 });
        dayStart = dayStart + this.dayWidth;
      }
      return output;
    },
    today() {
      const zone = new IANAZone("Australia/Melbourne");

      let start = DateTime.fromISO(this.timelineBounds.start, { zone: zone });
      let today = DateTime.utc().setZone(zone);
      //test day break
      // let today = DateTime.fromISO('2019-06-07T13:00:00',{zone: 'utc'}).setZone(zone);
      let period = today.diff(start, "days").toObject();

      return {
        x: Math.floor(period.days) * this.dayWidth,
        y: this.minirow,
        width: this.dayWidth,
        height: this.totalHeight
      };
    }
  },
  methods: {
    ...mapActions({
      updateScrollY: "timeline/updateScrollY"
    }),
    smoothScroll() {
         return Debounce(() => {
          this.updateScrollY(window.scrollY);
      }, 50);
    }
  }
};
</script>


<style lang="scss" scoped>
.timeline-calendar {
  .calendar-month-row {
    rect {
      fill: #f8f8f8;
      stroke: gray;
      stroke-width: 0, 5;
    }

    text {
      fill: black;
      dominant-baseline: middle;
      text-anchor: middle;
    }
  }

  .calendar-date-row {
    rect.filler {
      fill: white;
    }

    rect {
      fill: #3aa7cf42;
    }

    text {
      fill: black;
      dominant-baseline: middle;
      text-anchor: middle;
    }
    line {
      fill: white;
      stroke: gray;
      stroke-width: 1;
    }
  }

  .calendar-day-row {
    rect.filler {
      fill: white;
    }
    rect {
      fill: #3aa7cf42;
    }
    text {
      fill: black;
      dominant-baseline: middle;
      text-anchor: middle;
      font-weight: bold;
    }
    line {
      fill: white;
      stroke: gray;
      stroke-width: 1;
    }
  }
}
</style>

