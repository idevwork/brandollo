<template>
  <div
    v-dragscroll="!this.dragMode"
    @dragscrollstart="setDragActive(true)"
    @dragscrollend="setDragActive(false)"
    style="overflow-x: scroll"
    :class="[ !dragActive ? 'smooth_scroll': '']"
    ref="gantt_chart"
    @scroll="updateView"
  >
    <timeline></timeline>
  </div>
</template>

<script>
import timeline from "@/App/components/Gantt/Timeline.vue";
import { mapActions, mapState, mapGetters } from "vuex";
import { dragscroll } from "vue-dragscroll";

export default {
  name: "Action-Gantt",
  components: {
    timeline
  },
  directives: {
    dragscroll
  },
  data() {
    return {
      dragActive: false,
    };
  },
  computed: {
    ...mapState({
      dragMode: s => s.timeline.dragMode
    }),
    ...mapGetters({
      viewWindow: "timeline/viewWindow"
    })
  },
  methods: {
    ...mapActions({
      updateViewWindow: "timeline/updateViewWindow"
    }),
    updateView() {
      if (this.$refs.gantt_chart && this.$refs.gantt_chart.scrollLeft) {
        let viewWindow = {
          minX: this.$refs.gantt_chart.scrollLeft,
          maxX:
            this.$refs.gantt_chart.offsetWidth +
            this.$refs.gantt_chart.scrollLeft,
          width: this.$refs.gantt_chart.offsetWidth
        };
        this.updateViewWindow(viewWindow);
      }
    },
    setScrollPosition(value) {
      this.$refs.gantt_chart.scrollLeft = value.minX;
    },
    setDragActive(value) {
      this.dragActive = value;
    }
  },
  watch: {
    viewWindow(v) {
      this.setScrollPosition(v);
    }
  }
};
</script>

<style scoped>
.smooth_scroll {
  scroll-behavior: smooth;
}
</style>
