<template>
  <spinner :ready="isReady">
    <div class="learn-article">
      <sidebar class="learn-sidebar" @toggle-sidebar="toggleSidebar"/>
      <div class="article" :class="{ mobile_toggle : sidebarActive }">
        <ArticleHeader v-show="isReady" :article="article" />
        <div class="article-bottom">
          <ArticleBody :article="this.article" />
          <div v-if="article && article.similar" class="col-md-4">
            <h3>SIMILAR CONTENT</h3>

            <!-- SIMILAR CONTENT BUTTONS WILL GO HERE ONCE COMPONENT HAS BEEN MADE -->
            <LearnCard
              v-for="article in this.article.similar"
              :key="article.id"
              :article="article"
              class="learn-card"
            />
          </div>
        </div>
      </div>
    </div>
  </spinner>
</template>

<script>
import Spinner from "@/App/components/Spinner";
import ArticleBody from "@/App/components/Learn/ArticleBody";
import ArticleHeader from "@/App/components/Learn/ArticleHeader";
import LearnSidebar from "@/App/components/Learn/LearnSidebar";
import LearnCard from "@/App/components/Learn/LearnCard";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Learn-Article",
  props: ["articleId"],
  components: {
    spinner: Spinner,
    sidebar: LearnSidebar,
    ArticleHeader: ArticleHeader,
    ArticleBody: ArticleBody,
    LearnCard: LearnCard
  },
  data() {
    return {
      isReady: false,
      article: null,
      data: [],
      sidebarActive: false,
    };
  },
  computed: {
    ...mapState({
      teamId: s => s.teamStore.currentTeamId
    }),
    ...mapGetters({
      articles: "article/articles"
    })
  },
  mounted() {
    let that = this;
    this.getBookmarks();
    this.getPlans(this.teamId);
    this.getCategories();
    this.getArticle(this.articleId).then(a => {
      that.article = a;
      that.isReady = true;
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.isReady = false;

    this.getArticle(to.params.articleId).then(a => {
      this.article = a;
      this.isReady = true;
    });
    next();
  },
  methods: {
    ...mapActions({
      getArticle: "article/getArticle",
      getPlans: "getPlans",
      getActions: "getActions",
      getBookmarks: "article/getBookmarks",
      getCategories: "article/getCategories",
      getPlans: "getPlans"
    }),
    toggleSidebar(active) {
      this.sidebarActive = active;
    }
  }
};
</script>

<style scoped lang="scss">
.learn-article {
  background: #ffffff;
  display: flex;
  flex-direction: row;
  height: auto;
}

.article {
  width: 100%;
}

.sidebar {
  position: absolute;
}

.article-bottom {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 650px) {
  .mobile_toggle {
    display: none;
  }
}
</style>
