<template>
  <!-- Begin page -->
  <div class="dashboard-app">
    <div>
      <HeadPart :hideMenu="hideMenu"/>
    </div>

    <div>
      <div class="wrapper mb-0 mb-sm-5">
        <div>
          <router-view :key="$route.params.team"/>
        </div>
        <!-- end container -->
      </div>
    </div>

    <!-- end wrapper -->
    <div>
      <FootPart/>
    </div>

    <!-- Comments attachments lightbox -->
    <Lightbox/>
  </div>
</template>

<script>
import { Header, Footer } from "@/App/components";
import routeAccessMixin from "@/Common/mixins/RouteAccessCheck";
import Lightbox from '../../Common/components/Lightbox';

export default {
  name: "Dashboard-Full",
  mixins: [routeAccessMixin],
  components: {
    HeadPart: Header,
    FootPart: Footer,
    Lightbox
  },
  data() {
    return {
      hideMenu: false
    };
  },
  mounted() {
    this.showMenu(this.$route);
  },
  methods: {
    showMenu(route) {
      if (route.meta.hideMenuF) {
        this.hideMenu = route.meta.hideMenuF(route.params.id);
        return;
      }
      if (route.meta.hideMenu) {
        this.hideMenu = true;
        return;
      }
      this.hideMenu = false;
    }
  },
  watch: {
    $route(to, from) {
      this.showMenu(to);
    }
  }
};
</script>

<style lang="scss">
// $fa-font-path: "~font-awesome/fonts/";
// @import "~font-awesome/css/font-awesome.min.css";
$simple-line-font-path: "~simple-line-icons/fonts/";
@import "~simple-line-icons/css/simple-line-icons.css";

// $feather-font-path: "~feather-icons-sass/fonts";
// @import "~feather-icons-sass/feather.scss";


// @import "~bootstrap-vue/dist/bootstrap-vue.css";
// @import "../scss/dashboard/style.scss";

body {
  margin: 0;
  padding-bottom: 60px;
  overflow-x: hidden;
  font-size: 14px;
  background-color: #f3f6f8;
  font-family: "Roboto", sans-serif;
}

html {
  position: relative;
  min-height: 100%;
}

.card-box,
body {
  border: none;
  padding: 0;
  margin-bottom: 0;
}

@media (min-width: 768px) and (max-width: 991px) {
  body {
    overflow-x: hidden;
  }
}

@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }
}

.wrapper {
  padding-bottom: 58px;
}

@import "~bootstrap-vue/dist/bootstrap-vue.css";
@import "../scss/dashboard/style.scss";
@import "../scss/dashboard/unboundStyle.scss";

.sortable-ghost {
  background: lighten($custom, 30%);
}
</style>

<style lang="scss" scoped>
  /* Mobile styles */
  @media (max-width: 576px) {
    .wrapper {
      padding-bottom: 0;
    }
  }
</style>
