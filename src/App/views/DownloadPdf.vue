<template>
  <spinner message="Preparing Pdf" :ready="isReady">
  </spinner>
</template>

<script>
import Spinner  from "@/App/components/Spinner";
import schemaService from "@/Common/services/SchemaService";

export default {
  name: "Hello",
  components: {
    spinner: Spinner
  },
  props: ["id"],
  data() {
    return {
      isReady: false,
      data: []
    };
  },
  mounted() {
    let that = this;

    schemaService.getPdfLink({ id: that.id }).then(p => {
      that.ready = true;
      console.log(p);
      window.location = p;
    });
  }
};
</script>

<style scoped>
</style>
