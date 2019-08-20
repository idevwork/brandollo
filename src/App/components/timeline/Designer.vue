<template>
	<div class="timeline-designer" :class="{ dragging: dragging.active }">
		<timeline-designer-title ref="titleComp"
		 :layout="layout" :titles="titles"></timeline-designer-title>
		<timeline-designer-layout ref="layoutComp" 
		:layout="layout" :canassign="canassign" :timelines="timelines" :dragging="dragging" v-on:action-change="actionChanged" v-on:state-changed="stateChanged"
		:titles="titles"  />		
	</div>
</template>

<style lang="scss">
.timeline-designer {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  &.dragging {
    cursor: move;
  }
}
</style>

<script>
import TimelineDesignerTitle from "./TimelineDesignerTitle.vue";
import TimelineDesignerLayout from "./TimelineDesignerLayout.vue";

export default {
  name: "timeline-designer",
  components: { TimelineDesignerTitle, TimelineDesignerLayout },
  props: ["layout", "timelines", "titles", "canassign"],

  data() {
    return {
      dragging: {
        active: false,
        cancelled: false,
        index: 0
      }
    };
  },
  methods: {
    minColumns() {
      return this.$refs.layoutComp.minColumns();
    },
    minRows() {
      return this.$refs.layoutComp.minRows();
    },
    actionChanged(payload) {
      this.$emit("action-updated", payload);
    },
    stateChanged(payload) {
      this.$emit("state-updated", payload);
    }
  }
};
</script>
