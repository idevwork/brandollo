<template>
  <div class="lightbox" v-if="visible" @click="hide">
    <!-- Close button -->
    <div class="lightbox__close" @click="hide">
      <slot name="icon-close">&times;</slot>
    </div>

    <div class="lightbox__element" @click.stop="">
      <!-- Previous icon -->
      <div
        class="lightbox__arrow lightbox__arrow--left"
        @click.stop.prevent="previous"
        :class="{ 'lightbox__arrow--invisible': !hasPrevious }"
      >
        <slot name="icon-previous">
          <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
            <path d="M0-.5h24v24H0z" fill="none"/>
          </svg>
        </slot>
      </div>

      <!-- Image and loader -->
      <div class="lightbox__image" @click.stop="">
        <div class="lightbox__default-loader">
          <div class="lightbox__default-loader__element"></div>
        </div>

        <slot name="content" :url="images[index]" v-if="displayImage">
          <img :src="images[index]">
        </slot>
      </div>

      <!-- Next icon -->
      <div
        class="lightbox__arrow lightbox__arrow--right"
        @click.stop.prevent="next"
        :class="{ 'lightbox__arrow--invisible': !hasNext }"
      >
        <slot name="icon-next">
          <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
            <path d="M0-.25h24v24H0z" fill="none"/>
          </svg>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapMutations, mapState } from 'vuex';
  export default {
    name: 'Lightbox',
    data() {
      return {
        index: 0,
        displayImage: true,
      }
    },
    computed: {
      ...mapState({
        images: s => s.actionStore.lightboxImages,
        visible: s => s.actionStore.lightboxVisible,
      }),
      hasNext() {
        return (this.index + 1 < this.images.length);
      },
      hasPrevious() {
        return (this.index - 1 >= 0);
      },
    },
    methods: {
      ...mapMutations({
        setLightboxData: 'SET_LIGHTBOX_DATA',
      }),
      hide() {
        this.setLightboxData({ visible: false });
      },
      previous() {
        if (this.hasPrevious) {
          this.index -= 1;
          this.tick();
        }
      },
      next() {
        if (this.hasNext) {
          this.index += 1;
          this.tick();
        }
      },
      tick() {
        this.displayImage = false;
        Vue.nextTick(() => {
          this.displayImage = true;
        })
      },
      eventListener(e) {
        if (this.visible) {
          switch (e.key) {
            case 'ArrowRight':
              return this.next();
            case 'ArrowLeft':
              return this.previous();
            case 'ArrowDown':
            case 'ArrowUp':
            case ' ':
              return e.preventDefault();
            case 'Escape':
              return this.hide();
          }
        }
      },
    },
    mounted() {
      window.addEventListener('keydown', this.eventListener);
    },
    destroyed() {
      window.removeEventListener('keydown', this.eventListener);
    },
  }
</script>

<style scoped>
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .8);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999999999;
  }
  .lightbox__close {
    position: fixed;
    right: 0;
    top: 0;
    padding: 1rem;
    font-size: 3rem;
    cursor: pointer;
    color: #fff;
    width: 6rem;
    height: 6rem;
  }
  .lightbox__arrow--invisible {
    visibility: hidden;
  }
  .lightbox__element {
    display: flex;
    width: 100%;
    height: fit-content;
  }
  .lightbox__arrow {
    padding: 0 2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .lightbox__arrow svg {
    fill: #fff;
    pointer-events: none;
  }
  .lightbox__image {
    text-align: center;
    flex: 1;
  }
  .lightbox__image img {
    max-width: 85vw;
    height: auto !important;
  }
  @media screen and (max-width: 720px) {
    .lightbox__arrow {
      padding: 0 1rem;
    }
  }
  @media screen and (max-width: 500px) {
    .lightbox__element {
      position: relative;
    }
    .lightbox__arrow {
      position: absolute;
      padding: 0 2rem;
      height: 100%;
    }
    .lightbox__arrow--right {
      right: 0;
      background: linear-gradient(to right, transparent, rgba(0, 0, 0, .3));
    }
    .lightbox__arrow--left {
      left: 0;
      background: linear-gradient(to left, transparent, rgba(0, 0, 0, .3));
    }
  }

  /* Loader styles */
  .lightbox__default-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
  .lightbox__default-loader__element {
    animation: LightboxDefaultLoaderAnimation 1s linear infinite;
    border: 3px solid #292929;
    border-top: 3px solid #fff;
    border-radius: 50%;
    height: 75px;
    width: 75px;
  }
  @keyframes LightboxDefaultLoaderAnimation {
    to {
      border-top-color: #fff;
      transform: rotate(360deg);
    }
  }
</style>