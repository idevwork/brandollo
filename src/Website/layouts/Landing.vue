<template>
  <div v-if="isReady" class="landing-app">
   <div>
      <nav-bar></nav-bar>
      <router-view/>
      <footer-section></footer-section>
   </div>
  </div>
</template>


<script>

import navbar from "../components/Navigation";
import footer from "../components/LandingFooter";
import routeAccessMixin from "@/Common/mixins/RouteAccessCheck";

export default {
  name: "app",
  mixins: [routeAccessMixin],
  components: {
    "nav-bar": navbar,
    "footer-section": footer
  },
  data() {
    return {
      isReady: false
    };
  },
  mounted: function() {
    let that = this;

    that.isReady = true;
    console.log("ready");
  }
};
</script>

<style lang="scss">

</style>
