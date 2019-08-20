<template>
  <timeline-designer
    ref="designer"
    :layout="layout"
    :titles="titles"
    class="main-layout"
    :canassign="canassign"
    :timelines="timelineActions"
    v-on:action-updated="actionUpdated"
    v-on:state-updated="stateUpdated"
    v-dragscroll
  />
</template>


<script>
import TimelineDesigner from "@/App/components/timeline/Designer";
import { DateTime, Duration, Interval } from "luxon";

import { dragscroll } from "vue-dragscroll";
import { map, findIndex, find, min, max, chain, filter } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Action-Timeline",
  components: {
    TimelineDesigner
  },
  data() {
    return {
      timelineActions: [],
      dateRange: []
    };
  },
  directives: {
    dragscroll
  },
  computed: {
    ...mapState({
      canassign: s => s.teamStore.currentPermissions.changestatus
    }),

    ...mapGetters({
      actions: "actions",
      teamId: "currentTeamId"
    }),
    titles() {
      return map(this.dateRange, d => {
        var date = d.s;
        return {
          title: date.toFormat("cccc"),
          subTitle: date.toFormat("dd/LL/yy"),
          focus:
            date
              .startOf("day")
              .diff(DateTime.local().startOf("day"), "minutes") == 0,
          highlight:
            date
              .startOf("day")
              .diff(DateTime.local().startOf("day"), "minutes") == 0
              ? "#BDF9FFFF"
              : date.weekday === 6 || date.weekday === 7
              ? "#EBEBEBFF"
              : null
        };
      });
    },
    layout() {
      return {
        cols: this.titles.length,
        rows: 7,
        colWidth: 100
      };
    }
  },
  watch: {
    actions: {
      handler(v) {
        this.setBounds();
        this.updateTimeline();
      },
      deep: true
    }
  },
  mounted() {
    this.setBounds();
    this.updateTimeline();
  },
  methods: {
    ...mapActions({
      planActionFromStore: "planAction",
      startActionFromStore: "startAction",
      finishActionFromStore: "finishAction",
      cancelActionFromStore: "cancelAction",
      deleteActionFromStore: "removeAction"
    }),
    setBounds() {
      let that = this;
      let periodStart = DateTime.fromISO(
        min(
          chain(that.actions)
            .filter(a => a.planStart && a.planFinish)
            .map(a => {
              return a.planStart;
            })
            .value()
        )
      );
      if (!periodStart) {
        periodStart = DateTime.local().startOf("day");
      }
      periodStart = periodStart.plus({ days: -7 });

      let periodEnd = DateTime.fromISO(
        max(
          chain(that.actions)
            .filter(a => a.planStart && a.planFinish)
            .map(a => {
              return a.planFinish;
            })
            .value()
        )
      );

      if (!periodEnd) {
        periodEnd = periodStart;
      }
      periodEnd = periodEnd.plus({ days: 30 });
      let period = Interval.fromDateTimes(periodStart, periodEnd);

      that.dateRange = Array.from(period.splitBy({ days: 1 }));
    },
    updateTimeline() {
      let that = this;
      that.$nextTick(() => {
        that.timelineActions = chain(that.actions)
          .filter(a => a.planStart && a.planFinish)
          .map(a => {
            return {
              id: a.id,
              x: that.getIndexFromDate(a.planStart),
              y: a.planLane === null ? 1 : a.planLane,
              w: that.calculateDuration(a.planStart, a.planFinish),
              h: 1,
              text: a.title,
              user: a.assignedUserId,
              plan: a.planId,
              color: a.completed
                ? "#0acf97"
                : a.startedOn
                ? "#f1556c"
                : "#f9bc0b",
              status: a.completed
                ? "complete"
                : a.startedOn
                ? "started"
                : "pending",
              available: false
            };
          })
          .value();
      });
    },
    calculateDuration(start, end) {
      if (!start) {
        start = DateTime.local().startOf("day");
      } else {
        start = DateTime.fromISO(start);
      }

      if (!end) {
        end = start.plus({ days: 2 });
      } else {
        end = DateTime.fromISO(end);
      }
      return end.diff(start).as("days") + 1;
    },
    getIndexFromDate(start) {
      let that = this;
      if (!start) {
        start = DateTime.local().startOf("day");
      } else {
        start = DateTime.fromISO(start);
      }
      var index = findIndex(that.dateRange, d => {
        return Math.abs(d.s.diff(start, "days").days) < 0.5;
      });
      return index;
    },
    actionUpdated(payload) {
      const that = this;

      var fullAction = find(that.actions, d => d.id == payload.id);
      const payloadPlan = {
        id: fullAction.id,
        resourceContentId: fullAction.id,
        userFormId: fullAction.userFormId,
        planStart: that.dateRange[payload.x].s.toISO(),
        planFinish: that.dateRange[payload.x + payload.w - 1].s.toISO(),
        planLane: payload.y,
        teamId: that.teamId
      };

      this.planActionFromStore(payloadPlan);
    },
    stateUpdated(payload) {
      let action = find(this.actions, x => x.id == payload.id);
      if (payload.type === "start") {
        this.startActionFromStore(action);
      }
      if (payload.type === "cancel") {
        this.cancelActionFromStore(action);
      }
      if (payload.type === "finish") {
        this.finishActionFromStore(action);
      }
      if (payload.type === "remove") {
        this.deleteActionFromStore(action);
      }
    }
  }
};
</script>

<style scoped>
.title-line {
  border-top: 2px solid #dee2e6;
}

.main-layout {
  height: 840px;
  max-height: 840px;
  cursor: grab;
  width: 95vw; 
}

.main-layout:active {
  cursor: grabbing;
}
</style>
