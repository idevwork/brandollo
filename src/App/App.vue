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


import logoImg from "./assets/images/logo.png";
const metaTitle = "Brandollo Marketing";
const metaDescription =
  "Brandollo is a new tool that creates custom marketing plans for small businesses and gives you the knowledge to become a marketing expert. Discover a better way to plan and manage your marketing with Brandollo.";
const metaImage = logoImg;

import { mapActions, mapState } from "vuex";

export default {
  name: "app",
  mixins: [driftApp, mixpanelMixin, miniProfiler, agileMixin],
  metaInfo: {
    title: "Home",
    titleTemplate: "%s | Brandollo Marketing Software",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: metaDescription
      },
      {
        vmid: "og:description",
        property: "og:description",
        content: metaDescription
      },
      {
        vmid: "og:locale",
        property: "og:locale",
        content: "en_US"
      },
      {
        vmid: "og:locale",
        property: "og:locale",
        content: "en_US"
      },
      {
        vmid: "og:type",
        property: "og:type",
        content: "website"
      },
      {
        vmid: "og:title",
        property: "og:title",
        content: metaTitle
      },
      {
        vmid: "og:url",
        property: "og:url",
        content: "https://brandollo.com"
      },
      {
        vmid: "og:site_name",
        property: "og:site_name",
        content: "Brandollo"
      },
      {
        vmid: "og:image",
        property: "og:image",
        content: metaImage
      },
      {
        vmid: "twitter:description",
        name: "twitter:description",
        content: metaDescription
      },
      {
        vmid: "twitter:title",
        name: "twitter:title",
        content: metaTitle
      },
      {
        vmid: "twitter:card",
        name: "twitter:card",
        content: "summary"
      },
      {
        vmid: "twitter:site",
        name: "twitter:site",
        content: "@brandollomkt"
      },
      {
        vmid: "twitter:image",
        name: "twitter:image",
        content: metaImage
      },
      {
        vmid: "twitter:creator",
        name: "twitter:creator",
        content: "@brandollomkt"
      }
    ]
  },
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

    // this.setupAuth(function() {
    //   that.isReady = true;
    //   console.log("switching on gravitational stabilizers");
    //   that.identify(that.user);
    //   that.mixIdentify(that.user);
    // });

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

@import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
</style>
