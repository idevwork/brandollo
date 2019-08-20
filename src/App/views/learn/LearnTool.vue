<template>
  <spinner :ready="isReady">
    <div class="main">
      <div class="header__row">
        <div>
          <h4 id="header__title">LEARN</h4>
          <p>Here you can learn everything one needs to know about marketing</p>
        </div>
        <div class="header__searchBox">
          <input
            type="text"
            placeholder="Search..."
            @input="isTyping = true"
            v-model="searchQuery"
            style="width: 405px;"
          >
        </div>
      </div>
      <spinner :ready="isLoading">
        <div v-if="!noSearch">
          <div
            class="content__row"
            v-for="(category, index) in cats"
            :key="index"
            style="display: block"
          >
            <div class="row">
              <div class="col category__header" :style="style(index)">{{category[0]}}</div>
            </div>
            <div class="row">
              <div
                class="col-md-3 content__col"
                v-for="(resource, id) in category[1]"
                :key="id"
                @click="showContent(resource.id)"
              >
                <div class="resource__image" :style="style(index)">
                  <!-- <img :src="resource.url" :alt="resource.label"> -->
                  <font-awesome-icon  :title="resource.label" icon="play"/>
                </div>
                <div class="resource__text">{{resource.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="No__Content" v-else>No search results. Please try searching for something else.</div>
      </spinner>
    </div>
    <b-modal ref="learnModal" size="lg">
      <div class="popper-container">
        <h1>{{content? content.title: ''}}</h1>
        <!-- Modal content -->
        <b-container fluid>
          <!-- Videos -->
          <b-row v-for="(videoUrl, key) in videos" :key="key" class="mb-1 video">
            <b-col>
              <video-player :source="videoUrl" title="help"/>
            </b-col>
          </b-row>
          <!-- Other contents -->
          <b-row>
            <span class="detail" v-html="htmlContent"/>
          </b-row>
        </b-container>
      </div>
      <div slot="modal-header"></div>
      <div slot="modal-footer"></div>
    </b-modal>
    <upgrade-modal ref="upgrade" type="learn-item"/>
  </spinner>
</template>

<script>
import Spinner from "@/App/components/Spinner.vue";
import UpgradeModal from "@/App/components/Shared/modals/UpgradeModal";
import VideoPlayer from "@/Common/components/VideoPlayer";
import md from "@/Common/mixins/Markdown";

import {
  getLearnContent,
  getSingleContentById
} from "@/Common/services/LearnService";
import { groupBy, sortBy, map, toPairs } from "lodash";
import { mapGetters } from "vuex";

export default {
  name: "Learn-Tool",
  components: {
    spinner: Spinner,
    videoPlayer: VideoPlayer,
    UpgradeModal
  },
  mixins: [md],
  data() {
    return {
      isReady: true,
      searchQuery: "",
      isTyping: false,
      isLoading: false,
      data: [],
      categories: [],
      noSearch: false,
      modalResource: null,
      content: null
    };
  },
  computed: {
    ...mapGetters({
      isPremium: "isPremium",
      currentTeamId: "currentTeamId"
    }),
    cats() {
      map(this.data, m => {
        m.url = this.parseImage(m.url);
      });
      let groupedContents = groupBy(this.data, r => {
        if (r.categories.length > 0) {
          return r.categories[0].name.toUpperCase();
        }
        return "UNCATEGORIZED";
      });
      let cats = toPairs(groupedContents);
      let rr = sortBy(cats, [o => o[0]]);

      return rr;
    },
    videos() {
      if (this.content && this.content.url) {
        var urlArray = this.content.url.split(";");
        var videoUrlArray = [];
        urlArray.forEach(element => {
          if (
            element.indexOf(".jpg") == -1 &&
            element.indexOf(".png") == -1 &&
            element != ""
          ) {
            videoUrlArray.push(element);
          }
        });
        return videoUrlArray;
        // return this.content.url.split(";");
      }
    },
    htmlContent() {
      return this.marked(this.content ? this.content.content : "");
    }
  },
  mounted: function() {
    this.searchContent(this.searchQuery);
  },
  watch: {
    searchQuery: _.debounce(function() {
      if (this.searchQuery == "") {
        this.searchContent(this.searchQuery);
      } else {
        this.isTyping = false;
      }
    }, 6000),
    isTyping: function(value) {
      if (!value) {
        this.searchContent(this.searchQuery);
      }
    },
    modalResource: function() {
      getSingleContentById({ id: this.modalResource.id }).then(response => {
        this.content = response;
      });
    }
  },

  methods: {
    showContent(id) {
      if (!this.isPremium) {
        this.$refs.upgrade.show();
      } else {
        this.modalResource = { id: id };
        if (this.modalResource) {
          this.$refs.learnModal.show();
        }
      }
    },

    searchContent(searchQuery) {
      this.isLoading = false;
      this.noSearch = false;
      getLearnContent({ search: searchQuery }).then(response => {
        this.data = response;
        if (this.data.length == 0) {
          this.noSearch = true;
        }
        this.isLoading = true;
      });
    },
    parseImage: function(url) {
      var source = null;
      if (url != null) {
        var urlArray = url.split(";");
        var urlFound = false;
        urlArray.forEach(element => {
          if (urlFound == false) {
            var index;
            index = element.indexOf(".jpg");
            if (index == -1) {
              index = element.indexOf(".png");
              if (index != -1) {
                urlFound = true;
                source = element;
              }
            } else {
              urlFound = true;
              source = element;
            }
          }
        });
      }
      if (!source) {
        source =
          "https://brandolloplatformstore.blob.core.windows.net/public/sqaure-logo.png";
      }
      return source;
    },
    computedColor(order) {
      let color = "#B54E4E";
      switch (order) {
        case 0:
          color = "#82B960";
          break;
        case 1:
          color = "#E1C014";
          break;
        case 2:
          color = "#DE8E30";
          break;
        case 3:
          color = "#B359A4";
          break;
        case 4:
          color = "#9D80C2";
          break;
        case 5:
          color = "#B54E4E";
          break;
      }
      return color;
    },
    style(order) {
      return "color: " + this.computedColor(order) + ";";
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../scss/brandollo.scss";
</style>
<style lang="scss" scoped>
.main {
  background-color: white;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-left: 40px;
  padding-top: 29px;
}
.header__row {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}
#header__title {
  margin-bottom: 0px;
}

.header__searchBox {
  margin-bottom: 65px;
}

.resource__image {
  text-align: center;
font-size:80px; 
  img {
    height: 100%;
    width: 100%;
    max-height: 250px;
    max-width: 250px;
  }
}
.resource__text {
  margin: auto;
  width: 300px;
  font-weight: 700;
  margin-bottom: 20px;
}

.content__row {
  margin-bottom: 50px;
}

.content__col {
  text-align: center;
  cursor: pointer;
  &:hover {
    box-shadow: 2px 2px 20px 1px;
  }
}

.category__header {
  padding-top: 10px;
  padding-left: 15px;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 22px;
}

.No__Content {
  margin: 40px;
}

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
</style>


<style lang="css" scoped>
.detail >>> img {
  width: 75%;

  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
