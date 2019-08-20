<template>
  <spinner :ready="isReady">
  </spinner>
</template>

<script>
import Spinner  from "@/App/components/Spinner";

export default {
  name: "Hello",
  components: {
    spinner: Spinner
  },
  data() {
    return {
      isReady: false,
      data: []
    };
  },
  mounted() {
    let that = this;
  }
};
</script>

<style scoped>
</style>
