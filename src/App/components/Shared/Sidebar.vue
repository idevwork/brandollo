<template>
  <aside :class="{ active: active }">
    <div class="sidebar__toggler">
      <b-button :size="'sm'" :variant="'link'" @click="toggleSidebar">
        <font-awesome-icon style="color:black; font-size: 20px;" icon="bars" />
      </b-button>
    </div>

    <div v-if="active" class="sidebar__content">
      <slot name="expanded">Main content</slot>
      HEY THERE!!!!!
    </div>

    <!-- Sidebar left side -->
    <div class="sidebar__left__col">
      <slot name="sidebar"></slot>
    </div>
  </aside>
</template>

<script>
import { constants } from "crypto";
export default {
  name: "sidebar",

  components: {},
  data() {
    return {
      active: false
    };
  },
  created(vm) {
    if (this.$route.query.sidebar) {
      this.active = true;
    }
  },
  mounted() {},
  computed: {},
  methods: {
    toggleSidebar(e) {
      console.log("hi");
      e.preventDefault();
      this.active = !this.active;
      this.$emit("toggle-sidebar", this.active);
    }
  }
};
</script>

<style lang="scss">
@import "../../scss/dashboard/variables";

$aside-width: 60px;

aside {
  z-index: 10;
  display: block;
  width: $aside-width;
  min-width: $aside-width;
  padding-top: 15px;
  background: #ededed;
  min-height: 100vh;
  transition: width 0.5s, min-width 0.5s;

  .sidebar__left__col {
    padding: 10px;
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: $aside-width;
    top: 150px;
    height: 100vh;
  }

  .sidebar__toggler {
    padding: 0 !important;
    cursor: pointer;
    button {
      width: 100%;
    }
  }

  &.active {
    min-width: 413px;
    .sidebar__toggler {
      text-align: right; 
      button {
       width:50px; 
      }
    }
  }
}

/* Mobile styles */
@media (max-width: 576px) {
  aside {
    display: none !important;
  }
}
</style>
