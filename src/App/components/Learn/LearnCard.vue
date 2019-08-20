<template>
  <div>
    <div class="card pointer" :style="{ 'backgroundColor': categoryColor}" @click="picked()">
      <img src="@/App/assets/images/logo_white.svg" class="background-logo" />
      <div class="learn-card">
        <h2>{{article.title}}</h2>
        <div class="category">
          <div
            v-for="(category,i) in subCategories"
            :key="`${article.id}-${i}`"
            @click.stop="setCategoryFilter([category])"
            class="learn-card-category pointer"
            :style="{'--color-hover': categoryColor}"
          >
            <router-link
              :to="'/' + teamId + '/learn?query=y&category=' + category.id"
              style="color: inherit"
            >{{category.name}}</router-link>
          </div>
        </div>
      </div>
    </div>
    <upgrade-modal ref="upgrade" type="learn-item" />
  </div>
</template>

<script>
import logoImg from "@/App/assets/images/logo_white.png";
import { mapActions, mapGetters, mapState } from "vuex";
import UpgradeModal from "@/App/components/Shared/modals/UpgradeModal";

export default {
  name: "LearnCard",
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
  computed: {
    ...mapGetters({
      isPremium: "isPremium",
      categories: "article/categories",
      allFilterColor: "article/allFilterColor"
    }),
    categoryColor() {
      // if article has no main category
      let color = this.allFilterColor;

      if (this.article.mainCategory) {
        color = this.article.mainCategory.color;
      }

      return color;
    },
    subCategories() {
      let cat = this.article.categories.filter(c => {
        return c.categoryTypeName !== "Learn-Main";
      });

      return cat;
    }
  },
  methods: {
    ...mapActions({
      setCategoryFilter: "article/setCategoryFilter"
    }),
    picked() {
      if (!this.isPremium) {
        this.$refs.upgrade.show();
      } else {
        this.$router.push({
          name: "learn-article",
          params: { articleId: this.article.id }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.card {
  padding: 14px;
  margin: auto;
  width: 100%;
  max-width: 352px;
  height: 232px;

  border-radius: 15px;

  color: white;
}

.learn-card {
  height: 100%;
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
    width: 73%;

    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: flex-start;

    .learn-card-category {
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

      z-index: 1;

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

  z-index: 0;
}

.pointer {
  cursor: pointer;
}

img {
  cursor: default;
}

// MOBILE STYLES
@media (max-width: 650px) {
  .card {
    height: 160px;
    max-width: 328px;
    padding: 8px;

    h2 {
      width: 90%;
      line-height: 32px;
      margin: 4px 0 4px 0;
    }

    .category {
      width: 80%;
    }
  }

  .background-logo {
    margin-left: 60%;
    width: 45%;
  }
}
</style>
