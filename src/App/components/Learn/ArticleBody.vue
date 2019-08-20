<template>
  <div class="article-body">
    <div class="article-summary">
      <h2>Summary</h2>
      <div v-if="article.summary" class="article-summary-content" v-html="article.summary"></div>
      <div v-else class="article-summary-content" v-html="htmlSummaryContent()"></div>
    </div>
    <div v-if="article.video">
      <h2>Course Video</h2>
      <video-player
        :source="article.video"
        :title="article-video"
        :width="videoDimensions.width"
        :height="videoDimensions.height"
      />
    </div>
    <div v-if="filteredContent.length > 0" class="course-content">
      <h2>Course Catalogue</h2>
      <div v-for="(course, i) in filteredContent" v-bind:key="`step-${i}`" class="card">
        <div
          v-bind:class="[i == 0 ? 'first-card' : '', i == filteredContent.length -1 ? 'last-card' : '', 'card-header', 'pointer']"
          v-b-toggle="`accordion-${i}`"
        >
          <h3 :id="course.id">
            <span style="font-weight: bold">Step {{i+1}}:</span>
            {{course.title}}
          </h3>
          <font-awesome-icon
            style="font-size: 20px; color: black"
            title="collapsed"
            class="collapse-icon"
            icon="minus"
          />
          <font-awesome-icon
            style="font-size: 20px; color: black"
            title="expanded"
            class="expand-icon"
            icon="plus"
          />
        </div>
        <b-collapse
          v-bind:class="[i == filteredContent.length - 1 ? 'last-card' : '', 'card-body', 'content']"
          :id="`accordion-${i}`"
          accordion="accordion"
          role="tablist"
          :visible="course.id === focussedContent"
        >
          <div v-if="course.video" role="tab" class="accordion_video">
            <video-player
              :source="course.video"
              :title="`content-${i}-video`"
              class="vid-player"
              :width="videoDimensions.width"
              :height="videoDimensions.height"
            />
          </div>
          <div class="accordion_content" role="tab" v-html="htmlContent(course.summary)"></div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import md from "@/Common/mixins/Markdown";
import VideoPlayer from "@/Common/components/VideoPlayer";

export default {
  name: "ArticleBody",
  mixins: [md],
  components: {
    "video-player": VideoPlayer
  },
  props: {
    article: Object
  },
  data() {
    return {
      active: true,
      focussedContent: null
    };
  },
  mounted() {
    if (this.$route.query) {
      this.focussedContent = this.$route.query.content;
    }

    if (this.focussedContent) {
      document
        .getElementById(this.focussedContent)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },
  computed: {
    filteredContent() {
      let content = this.article.course.filter((course, i) => {
        return course.summary;
      });

      // While we transition all our content to have steps we have this hack that pulls
      // the original article
      if (content.length == 0) {
        if (this.article.alternativeContent) {
          return [
            {
              title: this.article.title,
              summary: this.article.alternativeContent
            }
          ];
        }
      }

      return content;
    },
    videoDimensions() {
      if (window.innerWidth < 650) {
        return {
          width: 250,
          height: 175
        };
      }

      return {
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.5
      };
    }
  },
  methods: {
    htmlSummaryContent() {
      let summary = "no summary content available";

      if (this.article.summary) {
        summary = this.article.summary;
      } else if (this.filteredContent[0] && this.filteredContent[0].summary) {
        summary = this.filteredContent[0].summary;
      }

      return this.marked(summary, 500);
    },
    htmlContent(summary) {
      if (summary === null) {
        return "no content found!";
      }

      let content = this.marked(summary, [{ headerIds: false }]);
      return content;
    }
  }
};
</script>

<style scoped lang="scss">
.article-summary-content {
  margin-bottom: 16px;
  margin-top: 16px;
}

.course-content {
  width: 100%;
}

h2 {
  font-family: Roboto;
  font-weight: 500;
}

h3 {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
}

.article-body {
  font-family: Roboto !important;
  background: #ffffff;

  padding-top: 26px;
  padding-left: 55px;
  padding-right: 55px;
  width: 100%;

  padding-bottom: 55px;

  img {
    border: 10px solid black;
    width: 100px !important;
  }
}

.text-1 {
  display: flex;
  align-items: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 23px;
  line-height: 29px;
}

.expand-icon,
.collapse-icon {
  margin: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #ffffff;
  border: 0.5px solid #4aacff;
  border-top: none;
  border-radius: 0px;

  .expand-icon {
    display: none;
  }
}

.collapsed {
  .collapse-icon {
    display: none;
  }

  .expand-icon {
    display: inline-block;
  }

  &.last-card {
    border-radius: 0px 0px 20px 20px;
    border-top: none;
  }

  &.first-card {
    &.last-card {
      border-radius: 20px;
      border: 0.5px solid #4aacff;
    }
  }
}

.card-body {
  background: #ffffff;
  border: 0.5px solid #4aacff;

  border-top: none;
  border-radius: 0px;
}

.accordion_video {
  width: auto;
  margin-bottom: 24px;
}

.first-card,
.last-card {
  border: 0.5px solid #4aacff;
}

.first-card {
  border-radius: 20px 20px 0px 0px;

  &.last-card {
    border-radius: 20px 20px 0px 0px;
    border: 0.5px solid #4aacff;
  }
}

.collapse {
  &.last-card {
    border-radius: 0px 0px 20px 20px;
    border-top: none;
  }
}

.last-card {
  border-top: none;
}

.pointer {
  cursor: pointer;
}

@media (max-width: 650px) {
  .article-body {
    padding: 0px 8px 16px 8px !important;
    width: 92vw !important;
  }

  .accordion_video {
    width: 100%;
  }
}
</style>

<style scoped >
.article-summary-content >>> p {
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  /* or 133% */
  margin-bottom: 8px;
  width: 80%;

  color: rgba(0, 0, 0, 0.7);
}

.accordion_content >>> img {
  width: auto;
  max-width: 800px;
  max-height: 65vh;

  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
}

.accordion_content >>> p {
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  /* or 133% */
  margin-bottom: 16px;

  color: rgba(0, 0, 0, 0.7);
}

.accordion_content >>> h1 {
  font-family: Roboto !important;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  /* identical to box height, or 127% */
  margin-bottom: 24px;

  color: #001b36;
}

.accordion_content >>> h5 {
  font-family: Roboto !important;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  /* identical to box height, or 127% */
  margin-bottom: 24px;

  color: #001b36;
}

.accordion_content >>> strong {
  font-family: Roboto !important;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  /* identical to box height, or 127% */
  margin-bottom: 24px;

  color: #001b36;
}

.accordion_content >>> ul {
  font-family: "Open Sans";
  font-weight: 500;

  margin-bottom: 16px;
}

.accordion_content >>> li {
  font-family: "Open Sans";
  font-size: 16px;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.7);
  margin: 8px 0 8px 0;
}

@media (max-width: 650px) {
  .article-summary-content >>> p {
    width: 100%;
  }

  .accordion_content >>> img {
    width: auto;
    max-width: 70vw;
    max-height: 65vh;

    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 8px;
  }

  h2 {
    font-weight: 500;
    font-size: 24px;
  }

  h3 {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 28px;
  }

  .accordion_content >>> p {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    /* or 133% */
    margin-bottom: 16px;

    color: rgba(0, 0, 0, 0.7);
  }

  .accordion_content >>> h1 {
    font-size: 20px;
    line-height: 24px;
  }

  .accordion_content >>> h5 {
    font-family: Roboto !important;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height, or 127% */
    margin-bottom: 24px;

    color: #001b36;
  }

  .accordion_content >>> strong {
    font-family: Roboto !important;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height, or 127% */
    margin-bottom: 24px;

    color: #001b36;
  }

  .accordion_content >>> ul {
    font-family: "Open Sans";
    font-weight: 500;

    margin-bottom: 16px;
  }

  .accordion_content >>> li {
    font-family: "Open Sans";
    font-size: 16px;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.7);
    margin: 8px 0 8px 0;
  }
}
</style>