<template>
  <spinner :ready="isReady">
    <div class="title-row">
      <h1>Help and Support</h1>
    </div>
    <div class="row card-row">
      <div v-for="(video,i) in content.videos" :key="i" class="col-4 help-card">
        <h3>{{video.title}}</h3>
        <video-player
          :source="video.video"
          class="player-div"
          :width="videoLarge.width"
          :height="videoLarge.height"
          title="video.title"
        ></video-player>
      </div>
    </div>
  </spinner>
</template>

<script>
import content from "@/Website/copy/Help";
import Spinner from "@/App/components/Spinner";
import VideoPlayer from "@/Common/components/VideoPlayer";

export default {
  name: "Help",
  components: {
    spinner: Spinner,
    "video-player": VideoPlayer
  },
  data() {
    return {
      isReady: false,
      content,
      wdw: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    videoLarge() {
      return {
        width: this.wdw.width * 0.25,
        height: this.wdw.width * 0.2
      };
    },
    videoSmall() {
      return {
        width: this.wdw.width,
        height: this.wdw.height * 0.3
      };
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  mounted() {
    let that = this;
    this.isReady = true;
  },
  methods: {
    handleResize() {
      this.wdw.width = window.innerWidth;
      this.wdw.height = window.innerHeight;
    }
  }
};
</script>

<style lang="scss" scoped>
.title-row {
  display: flex; 
  justify-content: center;
  align-items: center;
}

h1 {
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 42px;
  line-height: 50px;
  /* identical to box height, or 117% */
  display: flex;
  align-items: center;

  /* Brandollo Dark */
  color: #001b36;
}

.card-row {
  display: grid;
  justify-content: center;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, 520px);

  .help-card {
    padding: 16px 16px 32px;
    margin: 8px auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    box-shadow: 8px 12px 28px rgba(108, 78, 78, 0.21);
    border-radius: 20px;
    min-width: 460px;
    width: 100%;

    h3 {
      padding: 10px;

      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      color: #001b36;
    }
  }
}
</style>
