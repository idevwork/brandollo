<template>
  <svg id="timeline-grid">
    <defs>
      <!-- <pattern id="smallGrid" width="5" height="6" patternUnits="userSpaceOnUse">
          <path d="M 5 0 L 0 0 0 6" fill="none" stroke="gray" stroke-width="0.5"></path>
        </pattern>
        <pattern id="grid" width="50" height="60" patternUnits="userSpaceOnUse">
          <rect width="50" height="60" fill="url(#smallGrid)"></rect>
          <path d="M 50 0 L 0 0 0 60" fill="none" stroke="gray" stroke-width="1"></path>
      </pattern>-->      
      <pattern id="grid" :width="dayWidth" height="60" patternUnits="userSpaceOnUse">        
        <path d="M 50 0 L 0 0 0 60" fill="none" stroke="gray" stroke-width="0.5"></path>
      </pattern>
    </defs>
    <rect width="100%" height="100%" y="5" fill="url(#grid)"></rect>
  </svg>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "Grid",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      dayWidth: s => s.timeline.options.unit,
    }),
    ...mapGetters({
      getActionById: "getActionbyId"
    })
  },
  methods: {}
};
</script>

<style scoped>
</style>
