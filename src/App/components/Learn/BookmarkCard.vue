<template>
  <div class="card" @click="picked(); closeSidebarMobile()">
    <div class="learn-card pointer" :style="{ 'backgroundColor': categoryColor }">
      <h2>{{article.Title}}</h2>
      <div class="category">
        <div
          v-for="(category,i) in article.Categories"
          :key="`${article.resourceId}-${i}`"
          @click.stop="setCategoryFilter([category]); closeSidebarMobile()"
          class="learn-card-category pointer"
          :style="{'--color-hover': categoryColor}"
        >
          <router-link
            style="color: inherit"
            :to="'/' + teamId + '/learn?query=y&category=' + category.id"
          >{{category.name}}</router-link>
        </div>
      </div>
    </div>

    <div class="remove-button pointer" @click.stop="removeBookmark(article.resourceId)">
      <div>+</div>
    </div>
    <upgrade-modal ref="upgrade" type="learn-item" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import UpgradeModal from "@/App/components/Shared/modals/UpgradeModal";

export default {
  name: "BookmarkCard",
  props: {
    article: Object,
    teamId: String
  },
  components: {
    UpgradeModal
  },
  data() {
    return {
      active: true
    };
  },
  methods: {
    ...mapActions({
      removeBookmark: "article/removeBookmark",
      setCategoryFilter: "article/setCategoryFilter"
    }),
    picked() {
      if (!this.isPremium) {
        this.$refs.upgrade.show();
      } else {
        this.$router.push({
          name: "learn-article",
          params: { articleId: this.article.resourceId }
        });
      }
    },
    closeSidebarMobile() {
      if (window.innerWidth < 650) {
        this.$emit("toggle", false);
      }
    }
  },
  computed: {
    ...mapGetters({
      isPremium: "isPremium",
      categories: "article/categories",
      allFilterColor: "article/allFilterColor"
    }),
    categoryColor() {
      let color = this.allFilterColor;

      if (this.article.mainCategory) {
        color = this.article.mainCategory.color;
      }

      return color;
    }
  }
};
</script>

<style scoped lang="scss">
.card {
  max-width: 352px;
  width: 352px;
  margin-top: 16px;

  color: white;
}

.learn-card {
  padding: 14px;
  background: #f2229c;
  border-radius: 15px;
  height: 176px;
  width: 100%;
  margin-left: 0;
  margin-right: 0;

  color: white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h2 {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 28px;
    line-height: 25px;
  }

  .category {
    width: 90%;

    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: flex-start;

    .learn-card-category {
      margin-top: 4px;

      font-family: "Open Sans";
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 175.78%;

      border: 1px solid #ffffff;
      box-sizing: border-box;
      border-radius: 25px;
      min-width: 20%;
      max-width: 60%;
      padding: 2px 8px 2px 8px;
      margin: 4px;
      color: #ffffff;
      text-align: center;

      transition: 0.5s;

      &:hover {
        background: #ffffff;

        color: #45ace1;
        border-color: #45ace1;

        color: var(--color-hover);
        border-color: var(--color-hover);
      }
    }
  }
}

.background-logo {
  position: absolute;
  opacity: 0.6;
  width: 50%;

  margin-top: 5%;
  margin-left: 55%;
}

.remove-button {
  position: absolute;
  margin-top: -2%;
  margin-left: 95%;
  font-size: 25px;
  width: 25px;
  height: 25px;
  background: black;
  border-radius: 100%;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;

  display: none;
  transform: rotate(45deg);
}

.card:hover {
  .remove-button {
    display: inline-flex;
  }
}

.pointer {
  cursor: pointer;
}

@media (max-width: 650px) {
  .card {
    width: 100%;
  }

  .learn-card {
    padding: 8px;
    height: 152px;
    max-width: 294px;
  }
  .category {
    width: 100%;
  }

  h2 {
    margin: 4px 0 4px 0;
    font-size: 24px !important;
  }
}
</style>
