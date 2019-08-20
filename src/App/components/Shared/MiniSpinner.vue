<template>
  <div :style="parentStyleValue" class="sk-three-bounce">
    <div :style="styleValue" class="sk-child sk-bounce1"></div>
    <div :style="styleValue" class="sk-child sk-bounce2"></div>
    <div :style="styleValue" class="sk-child sk-bounce3"></div>
  </div>
</template>

<script>
export default {
  name: "Spinner-Mini",
  props: {
    styleValue: {
      type: String,
      default: ""
    },
    parentStyleValue: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped >
@import "../../assets/spinkit.css";
.sk-three-bounce {
  margin: auto 0 auto 0;
}
</style>
