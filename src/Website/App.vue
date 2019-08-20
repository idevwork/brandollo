<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import driftApp from "@/Common/mixins/DriftApp";
import mixpanelMixin from "@/Common/mixins/Mixpanel";
import agileMixin from "@/Common/mixins/AgileCRM";
import miniProfiler from "@/Common/mixins/MiniProfiler";


import seo from "@/Website/copy/BaseSEO"

import { mapActions, mapState } from "vuex";

import 'flexboxgrid/dist/flexboxgrid.css';

export default {
  name: "app",
  mixins: [driftApp, mixpanelMixin, miniProfiler, agileMixin],
  metaInfo: seo, 
  data() {
    return {
      isReady: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.userStore.user
    })
  },
  mounted: function() {
    let that = this;

    this.init().then(_ => {
      that.isReady = true;
      console.log("switching on gravitational stabilizers");

      that.identify(that.user);
      that.agileIdentify(that.user);
      that.mixIdentify(that.user);
    });
  },
  methods: {
    ...mapActions({
      init: "InitStore"
    })
  }
};
</script>

<style  lang="scss">

@import url('https://fonts.googleapis.com/css?family=Lato:300,400,500,700');
@import url('https://fonts.googleapis.com/css?family=Montserrat:200,600,700');

body {
  margin: 0;
  overflow-x: hidden;
}

.bold {
  font-weight: 700;
}
</style>
