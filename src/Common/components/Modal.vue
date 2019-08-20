<template>
  <transition name="modal">
    <div class="modal-mask" @click="close" v-if="show">
      <div class="modal-container" @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>

  <!-- <modal :show="show" @close="close">
    <div class="modal-header">
        <h3>New Post</h3>
    </div>  
    <button class="modal-default-button" @click="savePost()">
        Save
    </button>      
  </modal>-->
</template>

<script>
export default {
  props: ["show"],
  model: {
    prop: "show",
    event: "close-modal"
  },
  methods: {
    close: function() {
      this.$emit("close-modal", false);
    }
  },
  mounted: function() {
    document.addEventListener("keydown", e => {
      if (this.show && e.keyCode == 27) {
        this.close();
      }
    });
  }
};
</script>


<style lang="css" scoped>
* {
  box-sizing: border-box;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 30vw;
  margin: 20vh auto 0;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  /* font-family: Helvetica, Arial, sans-serif; */
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media (max-width: 770px) {
  .modal-container {
    width: 80vw;
  }
}
</style>