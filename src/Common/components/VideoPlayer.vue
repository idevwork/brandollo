<template>
  <div class="videocontent">
    <video
      ref="player"
      :src="source"
      controls
      class="player"
      :type="source ? source.indexOf('youtube') !== -1 ? 'video/youtube' : 'video/vimeo' :''"
      :width="width"
      :height="height"
      :poster="background"
      preload="auto"
      :title="title"
    ></video>
  </div>
</template>

<script>
import "mediaelement";
import "mediaelement/build/mediaelementplayer.min.css";
import "mediaelement/build/renderers/vimeo.min.js";


// MANUAL CHANGE. IF THE VIDEO IS NOT PLAYING https://github.com/mediaelement/mediaelement/issues/2618
// WAITING FOR PACKAGE TO BE UPDATED 2019-02-20

export default {
  name: "video-player",
  props: {
    source: { default: null, type: String },
    background: {},
    title: {},
    ready: {
      default: false
    },
    width: { default: "700px" },
    height: { default: "380px" }
  },
  data() {
    return {};
  },
  mounted() {
    var player = new MediaElementPlayer(this.$refs.player);
  },
  watch: {
    source: {
      handler: function() {
        this.$nextTick(_ => {
          if (this.source && this.$refs.player) {
            var player = new MediaElementPlayer(this.$refs.player, {
              success: function(mediaElement, originalNode, instance) {},
              error: function(err) {}
            });
          }
        });
      }
      // deep: true,
      // immediate: true
    }
  }
};
</script>


<style scoped>
.videocontent {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.videocontent >>> .mejs__container {
margin: auto;
}
</style>
