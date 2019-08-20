<template>
  <video-player :source="videoUrl" class="player-div" title="hello" :ready="isReady"></video-player>
</template>

<script>
import Spinner  from "@/App/components/Spinner";
import VideoPlayer from "./VideoPlayer"
import { getSingleContent } from "@/Common/services/LearnService";

export default {
  name: "Video-widget",
  components: {
    spinner: Spinner,
    "video-player": VideoPlayer
  },
  props: ["label", "shown"],
  data() {
    return {
      isReady: false,
      videoUrl: null
    };
  },
  watch: {
    shown() {
      this.isReady = false;
      if (this.shown) {
        console.log("showing");
        getSingleContent({ name: this.label }).then(d => {
          this.videoUrl = d.url;
          this.isReady = true;
        });
      }
    }
  }
};
</script>

<style scoped>
.player-div {
  width: 100%;
  height: 100%;
}
</style>
