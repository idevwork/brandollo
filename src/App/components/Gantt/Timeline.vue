<template>
  <div class="timeline">
    <svg
      id="timeline-canvas"
      :width="width"
      :height="height"
      @mousemove="mouseMove"
      @mouseup="endChange"
      @mousedown.shift="createBlock"
      xmlns="http://www.w3.org/2000/svg"
    >
      <grid />
      <today />
      <activity-layout
        :activities="activities"
      />
      <calendar />
      <TodayNavigator />
    </svg>
  </div>
</template>

<script>
import Calendar from "./Calendar";
import Today from "./Today";
import TodayNavigator from "./TodayNavigator";
import ActivityLayout from "./ActivityLayout";
import Grid from "./Grid.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { DateTime } from "luxon";
import DateLib from "@/Common/functions/Dates";

export default {
  name: "Timeline",
  components: {
    Calendar,
    ActivityLayout,
    Grid,
    Today,
    TodayNavigator
  },
  computed: {
    ...mapState({
      dayWidth: s => s.timeline.options.unit,
      rowHeight: s => s.timeline.options.activities.height,
      startingHeight: s => s.timeline.options.activities.heightStart,
      calendarHeight: s => s.timeline.options.calendar.rowHeight,
      changeMode: s => s.timeline.changeMode,
      changingAction: s => s.timeline.changingAction,
      offsetX: s => s.timeline.offsetX,
      initialXPos: s => s.timeline.initialXPos,
    }),
    ...mapGetters({
      getActionById: "getActionbyId",
      getPlanColor: "getPlanColor",
      activities: "timeline/activities",
      height: "timeline/height",
      width: "timeline/width",
      timelineBounds: "timeline/dateBounds"
    })
  },
  methods: {
    ...mapActions({
      dragStarted: "timeline/dragStarted",
      dragEnded: "timeline/dragEnded",
      planAction: "planAction",
      setChangeMode: "timeline/setChangeMode",
      setChangingAction: "timeline/setChangingAction",
      setOffsetX: "timeline/setOffsetX",
      setInitialXPos: "timeline/setInitialXPos",
    }),
    ...mapMutations({
      setActionDates: "SET_ACTION_DATES"
    }),

    // Create dates on empty row
    createBlock(e) {
      // prevent drag scrolling
      this.dragStarted();

      // find the activity from timeline
      let activity = this.getActivityFromY(e);

      // if that activity exists return nothing
      if (activity.object.planStart && activity.object.planFinish) {
        return;
      }

      // get the activity from the store - to modify
      const activityFromStore = this.getActionById(activity.object.id);

      // Action already has dates - return
      if (activityFromStore.planStart && activityFromStore.planFinish) {
        return;
      }

      // Create dates for action instantly
      let xPos = this.getMousePosition(e).x;
      activityFromStore.planStart = this.getDateFromX(xPos);
      activityFromStore.planFinish = this.getDateFromX(xPos);

      // Set editing action
      let changingAction = {
        id: activity.object.id,
        width: this.dayWidth,
        object: activityFromStore,
        x: Math.floor(xPos / this.dayWidth) * this.dayWidth
      };

      this.setChangingAction(changingAction);
      let offset = Math.ceil(xPos / this.dayWidth) * this.dayWidth - xPos;
      this.setOffsetX(offset);

      // Initiate expand until mouseup triggers
      // this.initialXPos = Math.floor(xPos / this.dayWidth) * this.dayWidth;
      this.setInitialXPos(Math.floor(xPos / this.dayWidth) * this.dayWidth)

      this.setChangeMode("create");
    },

    // Do the resize
    mouseMove(evt) {
      if (this.changingAction) {
        let activity = this.activities.find(
          a => a.object.id === this.changingAction.id
        );

        // get distance Travelled by mouse
        let distanceTravelled = this.getDistanceTravelled(evt, activity);

        if (this.changeMode === "left" || this.changeMode === "right") {
          this.moveMouseResize(distanceTravelled);
        } else if (this.changeMode === "create") {
          this.moveMouseCreate(distanceTravelled, this.getMousePosition(evt).x);
        } else if (this.changeMode === "move") {
          evt.preventDefault();
          this.moveMouseRePosition(distanceTravelled);
        }
      }
    },

    // End the resize
    endChange() {
      if (this.changingAction) {
        const activity = this.activities.find(
          act => act.object.id === this.changingAction.id
        ).object;

        if (this.changeMode === "left" || this.changeMode === "right") {
          this.endChangeResize(activity);
        } else if (this.changeMode === "create") {
          this.endChangeCreate(activity);
        } else if (this.changeMode === "move") {
          this.endChangeRePosition(activity);
        }
      }
    },

    getDateFromX(xPos, plusDays) {
      let start = DateTime.fromISO(this.timelineBounds.start);
      const dayIndex = Math.floor(xPos / this.dayWidth);
      let newStart = start.plus({ days: dayIndex });
      if (plusDays) {
        newStart = newStart.plus({ days: plusDays });
      }
      return newStart.toISO();
    },
    getActivityFromY(e) {
      // Check if clicked on action row without dates
      const activityY =
        Math.floor(this.getMousePosition(e).y / this.rowHeight) *
        this.rowHeight;
      const activity = this.activities.find(a => a.y === activityY);
      return activity;
    },
    getMousePosition(evt) {
      const canvas = document.getElementById("timeline-canvas");
      const CTM = canvas.getScreenCTM();
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    },
    getDistanceTravelled(evt, activity) {
      let mousePosition = this.getMousePosition(evt).x;
      let distance = mousePosition;

      if (this.changeMode === "left") {
        distance = mousePosition - this.offsetX - this.changingAction.x;
      } else if (this.changeMode === "right") {
        distance =
          mousePosition +
          this.offsetX -
          (activity.x + this.changingAction.width);
      } else if (this.changeMode === "create") {
        if (mousePosition - this.initialXPos < 0) {
          return 0;
        } 
        distance =
          mousePosition +
          this.offsetX -
          (this.changingAction.x + this.changingAction.width);
      }

      return distance;
    },
    moveMouseResize(distanceTravelled) {
      // Change start date
      if (this.changeMode === "left") {
        // Change x and width
        if (distanceTravelled > 0) {
          if (
            this.changingAction.width - distanceTravelled <=
            this.dayWidth / 2
          ) {
            return;
          }

          this.changingAction.width -= distanceTravelled;
          this.changingAction.x += distanceTravelled;
        } else if (distanceTravelled < 0) {
          this.changingAction.width += Math.abs(distanceTravelled);
          this.changingAction.x -= Math.abs(distanceTravelled);
        }

        // Change finish date
      } else if (this.changeMode === "right") {
        // Change width fluidly
        if (distanceTravelled > 0) {
          this.changingAction.width += distanceTravelled;
        } else if (distanceTravelled < 0) {
          if (
            this.changingAction.width - Math.abs(distanceTravelled) <
            this.dayWidth / 2
          ) {
            return;
          }
          this.changingAction.width -= Math.abs(distanceTravelled);
        }
      }
    },
    endChangeResize(activity) {
      const actionFromStore = this.getActionById(this.changingAction.id);

      // Count dates and save
      if (this.changeMode === "left") {
        // Set dates
        this.setActionDates({
          startDate: this.getDateFromX(this.changingAction.x),
          actionId: actionFromStore.id
        });
      } else if (this.changeMode === "right") {
        // Set dates
        const startDate = DateTime.fromISO(actionFromStore.planStart);
        const duration = Math.floor(this.changingAction.width / this.dayWidth);

        this.setActionDates({
          finishDate: startDate.plus({ days: duration }).toISO(),
          actionId: actionFromStore.id
        });
      }

      // Save
      this.updateChangedAction(actionFromStore, activity);
    },
    moveMouseCreate(distanceTravelled, mouseX) {
      // Change width fluidly
      if (distanceTravelled > 0) {
        this.changingAction.width += distanceTravelled;
        
      } else if (distanceTravelled < 0) {
        this.changingAction.width -= Math.abs(distanceTravelled);
      }
    },
    endChangeCreate(activity) {
      // Set dates
      const startDate = DateTime.fromISO(this.changingAction.object.planStart);
      const duration = Math.floor(this.changingAction.width / this.dayWidth);

      this.setActionDates({
        finishDate: startDate.plus({ days: duration }).toISO(),
        actionId: this.changingAction.object.id
      });

      // Save
      const expandAction = this.getActionById(this.changingAction.object.id);

      this.updateChangedAction(expandAction, activity);
    },
    moveMouseRePosition(distanceTravelled) {
      this.changingAction.x = distanceTravelled - this.offsetX;
    },
    endChangeRePosition(activity) {
      this.changingAction.x =
        Math.floor(this.changingAction.x / this.dayWidth) * this.dayWidth;

      let xPos = Math.floor(this.changingAction.x / this.dayWidth);

      // new start date
      let newPlanStart = DateLib.addDays(this.timelineBounds.start, xPos);

      let updatedActivity = this.updateActivityDates(activity, newPlanStart);

      this.setChangeMode(null);
      this.setChangingAction(null)

      this.planAction(updatedActivity);

      this.dragEnded();
    },
    updateChangedAction(action, activity) {
      const payload = {
        id: action.id,
        userFormId: action.userFormId,
        planStart: DateTime.fromISO(action.planStart).toISO(),
        planFinish: DateTime.fromISO(action.planFinish).toISO(),
        planLane: action.planLane,
        teamId: action.teamId,
        parentId: activity.parentId,
        actions: activity.actions
      };

      this.planAction(payload);
      this.setChangingAction(null);
      this.setChangeMode(null);
      this.dragEnded();
    },
    updateActivityDates(activity, newStart) {
      let n = DateLib.moveDates(
        activity.planStart,
        activity.planFinish,
        newStart
      );

      const payload = {
        id: activity.id,
        userFormId: activity.userFormId,
        planStart: n.s,
        planFinish: n.e,
        planLane: activity.planLane,
        teamId: activity.teamId,
        parentId: activity.parentId,
        actions: activity.actions
      };

      return payload;
    }
  }
};
</script>

<style scoped>
.timeline {
  cursor: grab;
}

.timeline:active {
  cursor: grabbing;
}

.timeline:before {
  content: none;
}
</style>
