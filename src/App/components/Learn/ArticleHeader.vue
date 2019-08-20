 <template>
  <div class="header">
    <!-- <img src="@/App/assets/images/logo_white.svg" class="background-logo" /> -->
    <div class="header-top">
      <router-link style="color: black" class="pointer" :to="'/' + teamId + '/learn/'">Education /</router-link>
      <span v-for="(category, i) in mainCategories" :key="i" @click="setCategoryFilter([category])">
        <router-link
          style="color: black"
          class="pointer"
          :to="'/' + teamId + '/learn/'"
        >{{" " + category.name}} /</router-link>
      </span>
      {{article.title}}
    </div>
    <div class="header-body row" :style="{ 'backgroundColor': articleColor }">
      <div class="header-body-left col-md-8">
        <h1>{{article.title}}</h1>

        <div class="categories">
          <router-link
            v-for="(category, i) in article.categories"
            :key="i"
            @click="setCategoryFilter([category])"
            class="pointer category"
            :to="'/' + teamId + '/learn/'"
            :style="{'--color-hover': articleColor}"
          >{{category.name}}</router-link>
        </div>
      </div>
      <div class="header-body-right col-md-4">
        <!-- Add to my plan button -->
        <div class="pointer">
          <b-dropdown
            class="add_plan pointer"
            toggle-class="text-decoration-none p-0 border-0"
            variant="link"
            no-caret
            right
          >
            <template slot="button-content">
              <div class="add_plan_flex">
                <div class="add_plan_text">Add to my plan</div>
                <div class="add_plan_button">
                  <div class="add_plan_icon">+</div>
                </div>
              </div>
            </template>
            <b-dropdown-item v-for="plan in plans" :key="plan.id">
              <div @click="selectPlan(plan)">
                <div>{{plan.label}}</div>
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>

        <div
          :class="[{ 'bookmark-remove' : bookmarked , 'bookmark-add' : !bookmarked }, 'bookmark' , 'pointer' ]"
          @click="toggleBookmarked(article)"
        >
          <div>{{bookmarked ? "Unbookmark" : "Bookmark"}}</div>
          <font-awesome-icon title="Reorder actions" icon="bookmark" class="bookmark_button" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/App/components/Spinner";
import logoImg from "@/App/assets/images/logo_white.png";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "ArticleHeader",
  props: {
    article: Object
  },
  data() {
    return {
      logoImg: logoImg,
      selectedPlan: null
    };
  },
  computed: {
    ...mapState({
      teamId: s => s.teamStore.currentTeamId
    }),
    ...mapGetters({
      plans: "plans",
      bookmarks: "article/bookmarks",
      allFilterColor: "article/allFilterColor",
      categories: "article/categories"
    }),
    bookmarked: {
      get() {
        let similar = this.bookmarks.find(b => {
          return b.Title === this.article.title;
        });
        return similar ? true : false;
      },
      set(newValue) {
        return newValue;
      }
    },
    mainCategories() {
      let cat = this.article.categories.filter(c => {
        return c.categoryTypeName === "Learn-Main";
      });
      return cat;
    },
    articleColor() {
      if (this.mainCategories.length == 0) {
        return this.allFilterColor;
      }

      let MainCategoryId = this.mainCategories[0].id;

      return this.categories.find(a => a.id === MainCategoryId)
        ? this.categories.find(a => a.id === MainCategoryId).color
        : this.allFilterColor;
    }
  },
  methods: {
    ...mapActions({
      addBookmark: "article/addBookmark",
      removeBookmark: "article/removeBookmark",
      setCategoryFilter: "article/setCategoryFilter",
      createActionFromArticle: "article/createActionFromArticle",
      getPlans: "getPlans"
    }),
    toggleBookmarked(article) {
      this.bookmarked
        ? this.removeBookmark(article.id)
        : this.addBookmark(article);

      this.bookmarked = !this.bookmarked;
    },
    // how to add article to plans
    selectPlan(plan) {
      let payload = {
        activityId: this.article.id,
        userFormId: plan.id,
        teamId: this.teamId
      };

      this.createActionFromArticle(payload);

      this.selectedPlan = plan;
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  min-height: 350px;
  width: 100%;

  .background-logo {
    position: absolute;
    // opacity: 0.6;
    height: 22%;

    margin-top: 7%;
    padding-left: 79%;
    padding-right: 20%;
    z-index: 0;
  }

  .header-top {
    background: #ffffff;

    padding-left: 55px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .header-body {
    min-height: 320px;

    color: #ffffff;

    padding-left: 55px;
    padding-top: 55px;
    padding-bottom: 30px;

    .header-body-right {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;

      height: auto;

      .bookmark {
        box-sizing: border-box;
        border-radius: 20px;

        padding: 16px 10px 16px 10px;

        font-family: "Open Sans";
        font-weight: normal;
        font-size: 18px;
        line-height: 175%;

        height: 30px;
        min-width: 152px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        transition: 0.5s;

        z-index: 1;
      }

      .bookmark-add {
        background: #ffffff;
        border: 1px solid #45ace1;
        color: #45ace1;

        &:hover {
          background: #2d9cdb;
          color: #ffffff;
          border-color: #ffffff;
        }
      }

      .bookmark-remove {
        background: #2d9cdb;
        border: 1px solid #ffffff;
        color: #ffffff;

        &:hover {
          background: #ffffff;
          color: #45ace1;
          border-color: #45ace1;

          .add_plan_button {
            background: #ffffff;
            color: #45ace1;
          }
        }
      }

      .add_plan {
        margin-right: 24px;
        margin-bottom: 8px;

        .add_plan_flex {
          display: flex;
          align-items: center;
          justify-content: space-between;

          box-sizing: border-box;
          border-radius: 25px;
          padding: 16px 10px 16px 10px;
          height: 30px;
          min-width: 180px;

          transition: 0.5s;

          background: #ffffff;
          border: 1px solid #45ace1;
        }

        .add_plan_text {
          color: #45ace1;

          font-family: "Open Sans";
          font-weight: normal;
          font-style: normal;
          font-size: 18px;
          line-height: 175%;

          transition: 0.5s;
        }

        .add_plan_button {
          color: white;
          background: #2d9cdb;

          font-weight: 500;
          font-size: 20px;
          line-height: 175%;

          width: 20px;
          height: 20px;

          border-radius: 100%;

          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;

          transition: 0.5s;
        }

        &:hover {
          .add_plan_flex {
            background: #2d9cdb;
            color: #ffffff;
            border-color: #ffffff;
          }

          .add_plan_button {
            color: #2d9cdb;
            background: #ffffff;
          }

          .add_plan_text {
            color: #ffffff;
          }
        }
      }
    }

    .header-body-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      h1 {
        font-family: Roboto;
        padding: 0 0 55px 0;
        font-size: 90px;
        font-weight: normal;
        line-height: 92px;
      }
    }

    .categories {
      display: flex;
      flex-wrap: wrap;
      height: auto;

      .category {
        font-family: "Open Sans";

        border: 1px solid #ffffff;
        box-sizing: border-box;
        margin: 4px;
        margin-top: 8px;
        border-radius: 25px;
        width: auto;
        padding: 4px 12px 4px 12px;
        color: #ffffff;

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
}

.pointer {
  cursor: pointer;
}

.add_plan_button,
.bookmark_button {
  font-size: 20px;
}

@media (max-width: 774px) {
  .header {
    .header-body {
      width: 100%;
      padding-left: 8px !important;
      padding-top: 8px !important;
      padding-bottom: 8px !important;

      margin: 0;
      padding: 0;

      display: flex;
      flex-direction: column-reverse;
      justify-content: space-between;

      min-height: auto;

      .header-body-right {
        width: 100%;
        flex-wrap: nowrap;
      }
    }
  }
}

@media (max-width: 650px) {
  .header {
    width: 100%;

    .background-logo {
      // position: absolute;
      // // opacity: 0.6;
      // height: 22%;

      // margin-top: 50%;
      // padding-left: 20%;
      // padding-right: 0%;
      // z-index: 0;

      display: none;
    }

    .header-top {
      padding-left: 8px;
    }

    .header-body {
      width: 100%;
      padding-left: 8px !important;
      padding-top: 8px !important;
      padding-bottom: 8px !important;

      margin: 0;
      padding: 0;

      display: flex;
      flex-direction: column-reverse;
      justify-content: space-between;

      min-height: auto;

      .header-body-left {
        width: 90%;
        padding: 0;

        h1 {
          font-size: 64px;
          line-height: 72px;

          padding-bottom: 0px;
        }
      }

      .header-body-right {
        width: 90%;
        padding: 0;
        justify-content: space-between;
        padding-right: 4px;
        // flex-wrap: wrap;

        .add_plan {
          min-width: 40%;
          max-width: 40%;
          margin-right: 4px;

          .add_plan_flex {
            min-width: 20px !important;
            // max-width: 50%;
          }

          .add_plan_button {
            width: 16px;
            height: 16px;

            .add_plan_icon {
              font-size: 16px
            }
          }

          .add_plan_text {
            font-size: 14px;
            padding-right: 4px;
          }
        }

        .bookmark {
          min-width: 128px;
          width: 50%;
          max-width: 136px;

          font-size: 14px;
        }
      }
    }
  }

  .bookmark_button {
    font-size: 16px;
  }
}
</style>
