<template>
  <div>        
    <router-view/>
  </div>
</template>
<script>
import routeAccessMixin from "@/Common/mixins/RouteAccessCheck";

export default {
  name: "app",
  mixins: [routeAccessMixin],
  data() {
    return {};
  }
};
</script>

<style lang="scss">
</style>
