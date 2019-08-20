<template>
  <g>
    <g class="timeline-layout" v-for="(a,i) in activitiesWithDates" :key="i">
      <ActivityNavigator :activity="a" />
      <activity :activity="a"></activity>
    </g>
  </g>
</template>

<script>
import { mapState } from "vuex";
import Activity from "./Activity";
import ActivityNavigator from "./ActivityNavigator";

export default {
  name: "Timeline-Layout",
  props: ["activities"],
  components: {
    Activity,
    ActivityNavigator
  },
  methods: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      dayWidth: s => s.timeline.options.unit,
      rowHeight: s => s.timeline.options.activities.height
    }),
    activitiesWithDates() {
      return this.activities.filter(
        a => a.object.planStart && a.object.planFinish
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
