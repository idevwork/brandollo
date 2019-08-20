<template>
  <div>
    <div v-if="!ready" style="text-align:center" :class="spinnerClassName">
      <div class="sk-three-bounce">
        <div class="sk-child sk-bounce1"></div>
        <div class="sk-child sk-bounce2"></div>
        <div class="sk-child sk-bounce3"></div>
      </div>
      <h2>{{message}}</h2>
    </div>
    <div :class="className" v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: {
    ready: Boolean,
    message: String,
    className: {
      type: String,
      default: '',
    },
    spinnerClassName: {
      type: String,
      default: '',
    }
  }
};
</script>

<style scoped >
@import "../assets/spinkit.css";
</style>
