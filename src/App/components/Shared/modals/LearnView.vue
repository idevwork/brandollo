<template>
  <div class="row-flex tab-wrapper">
    <div :class="modalType == 'popper' ? 'popper-container' : ''">
      <spinner :ready="isReady">
        <h1>{{content? content.title: ''}}</h1>
        <!-- Modal content -->
        <div class="container">
          <!-- Videos -->
          <div v-for="(videoUrl, key) in videos" :key="key" class="row mb-1 video">
            <div class="col">
              <video-player :source="videoUrl" :width="videoWidth" title="help" :ready="isReady" />
            </div>
          </div>
          <!-- Other contents -->
          <div class="row">
            <div class="col">
              <span class="detail" v-html="htmlContent" />
            </div>
          </div>
        </div>
      </spinner>
    </div>
  </div>
</template>

<script>
import Spinner from "@/App/components/Spinner.vue";
import { getSubContentById } from "@/Common/services/LearnService";
import VideoPlayer from "@/Common/components/VideoPlayer";
import md from "@/Common/mixins/Markdown";
import { mapGetters } from "vuex";

export default {
  name: "LearnView",
  mixins: [md],
  props: {
    resource: {
      type: String
    },
    modalType: {
      type: String
    }
  },
  components: {
    spinner: Spinner,
    videoPlayer: VideoPlayer
  },
  data() {
    return {
      content: null,
      isReady: false
    };
  },
  computed: {
    ...mapGetters({
      isPremium: "isPremium",
      currentTeamId: "currentTeamId"
    }),
    videos() {
      if (this.content && this.content.url) {
        return this.content.url.split(";");
      }
    },
    htmlContent() {
      return this.marked(this.content ? this.content.content : "");
    },
    videoWidth() {
      return this.$el.clientWidth * 0.9;
    }
  },
  mounted() {
    this.loadContent();
  },
  methods: {
    loadContent() {
      if (this.resource) {
        if (!this.isPremium) {
          this.content = {
            title: "This feature is only available to paid accounts.",
            content: `Would you like to access? <a href='/${this.currentTeamId}/upgrade'>Upgrade now.</a>`
          };
          this.isReady = true;
        } else {
          this.isReady = false;
          if (this.resource) {
            getSubContentById(this.resource).then(d => {
              this.content = d;
              this.isReady = true;
            });
          }
        }
      }
    }
  },
  watch: {
    resource() {
      this.loadContent();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../scss/brandollo.scss";
</style>


<style scoped>
.popper-container {
  padding: 0px 10px;
}
.popper-container h1 {
  font-size: 20px;
}
.popper-container span {
  font-size: 15px;
}
.detail {
  --x-height-multiplier: 0.375;
  --baseline-multiplier: 0.17;
  /* font-family: Georgia,Cambria,"Times New Roman",Times,serif; */
  letter-spacing: 0.01rem;
  font-weight: 400;
  font-style: normal;
  font-size: 21px;
  line-height: 1.58;
  letter-spacing: -0.003em;
  width: 100%;
}

.detail >>> img {
  width: 75%;

  display: block;
  margin-left: auto;
  margin-right: auto;
}

.tab-wrapper {
  max-height: 80vh;
  overflow-y: auto;
}
</style>