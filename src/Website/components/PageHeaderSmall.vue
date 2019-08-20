<template>
  <div class="wrapper">
    <header class="header">
      <div id="primary" class="boxed-layout-header page-header page-header-small">
        <div data-parallax="active" class="header-filter"></div>
      </div>
    </header>
    <div class="main main-raised">
      <div class="blog-post">
        <div class="container">
          <slot>Content ...</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "page-header-small",
  props: ["title", "background"],
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
