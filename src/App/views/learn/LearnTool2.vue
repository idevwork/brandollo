<template>
  <spinner :ready="isReady">
    <div class="learn-container">
      <sidebar class="learn-sidebar" @toggle-sidebar="toggleSidebar" />
      <div class="learn" :class="{ mobile_toggle : sidebarActive }">
        <div class="learn-header">
          <div class="learn-title">Education</div>
          <div class="categories">
            <div class="sub-title">Categories</div>
            <div class="category-buttons" :style="categoryWidth">
              <div
                v-for="(category, i) in mainCategories"
                @click="addCategory(category)"
                :key="i"
                :style="[{ 'backgroundColor': category.color}, categoryWidth]"
                class="category-button pointer"
              >
                <div>{{category.name}}</div>
              </div>
              <div
                @click="clearCategories()"
                :style="[{ 'backgroundColor': '#F2229C'}, categoryWidth]"
                class="category-button pointer"
              >ALL</div>
            </div>
          </div>
          <div class="filter-search row">
            <div class="filter-box-section col-md-8">
              <div class="sub-title">Filters</div>
              <v-select
                multiple
                autocomplete
                label="name"
                :options="categories"
                v-model="filterBox"
                class="filter-box"
              >
                <template slot="selected-option" slot-scope="option">{{option.name}}</template>

                <template slot="option" slot-scope="option">{{option.name}}</template>
              </v-select>
            </div>
            <div class="col-md-4">
              <div class="sub-title">Keyword Search</div>
              <div class="search-box">
                <font-awesome-icon
                  style="color: black; font-size: 20px;"
                  title="Reorder actions"
                  class="search-icon"
                  icon="search"
                />

                <input class="text-search" type="text" v-model="searchBox" placeholder="Search.." />
              </div>
            </div>
          </div>
        </div>
        <div class="learn-main-empty" v-if="articles && articles.length === 0">
          <div class="empty-text">No articles match this filter</div>
        </div>
        <div class="learn-main" v-else>
          <LearnCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
            :teamId="teamId"
            class="learn-card"
          />
        </div>
      </div>
    </div>
  </spinner>
</template>

<script>
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
import Spinner from "@/App/components/Spinner";
import LearnSidebar from "@/App/components/Learn/LearnSidebar";
import LearnCard from "@/App/components/Learn/LearnCard";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Learn-Section",
  components: {
    spinner: Spinner,
    sidebar: LearnSidebar,
    LearnCard: LearnCard,
    "v-select": vSelect
  },
  data() {
    return {
      isReady: false,
      data: [],
      sidebarActive: false
    };
  },
  computed: {
    ...mapState({
      teamId: s => s.teamStore.currentTeamId
    }),
    ...mapGetters({
      articles: "article/articles",
      categories: "article/categories",
      textFilter: "article/textFilter",
      categoryFilters: "article/categoryFilters"
    }),
    searchBox: {
      get() {
        return this.textFilter;
      },
      set(value) {
        this.setTextFilter(value);
        this.updateQueryRoute();
      }
    },
    filterBox: {
      get() {
        return this.categoryFilters;
      },
      set(value) {
        this.setCategoryFilter(value);
        this.updateQueryRoute();
      }
    },
    mainCategories() {
      return this.categories.filter(
        category => category.categoryTypeName === "Learn-Main"
      );
    },
    categoryWidth() {
      let nCategories = this.categories.length + 1;

      // let width = `${(window.innerWidth * 0.9) / nCategories}px`;
      let width = `${100 / nCategories}%`;

      return {
        "--category-width": width
      };
    }
  },
  mounted() {
    let that = this;
    let routeText = this.$route.query.text ? this.$route.query.text : "";
    this.searchBox = routeText;

    let routeCategories = [];
    if (this.$route.query.category) {
      if (Array.isArray(this.$route.query.category)) {
        routeCategories = this.$route.query.category;
      } else {
        routeCategories = [this.$route.query.category];
      }

      routeCategories = routeCategories.map(cId => parseInt(cId));
    }

    // get categories for filterbox
    let filterBoxCategories = [];
    this.getCategories().then(() => {
      if (routeCategories.length > 0) {
        filterBoxCategories = routeCategories.map(cId => {
          return this.categories.find(cat => cat.id === cId);
        });
      }

      this.filterBox = filterBoxCategories;
    });
    this.getBookmarks();

    let params = {
      text: routeText,
      catIds: routeCategories
    };

    this.searchArticles(params).then(() => {
      this.isReady = true;
    });
  },
  methods: {
    ...mapActions({
      searchArticles: "article/searchArticles",
      setTextFilter: "article/setTextFilter",
      setCategoryFilter: "article/setCategoryFilter",
      getCategories: "article/getCategories",
      getBookmarks: "article/getBookmarks"
    }),
    addCategory(cat) {
      if (!this.filterBox.includes(cat)) {
        this.filterBox.push(cat);
        this.updateQueryRoute();
        this.setCategoryFilter(this.filterBox);
      }
    },
    clearCategories() {
      this.filterBox = [];
    },
    change(e) {
      this.setTextFilter(e.target.input);
    },
    updateQueryRoute() {
      let route = { name: "learn-tool" };

      if (this.filterBox.length > 0 || this.searchBox) {
        let q = { query: "y" };

        let category = this.filterBox.map(c => {
          return c.id;
        });
        q.category = category;

        if (this.searchBox) {
          let text = this.searchBox;
          q.text = text;
        }
        route.query = q;
      }

      this.$router.push(route);
    },
    toggleSidebar(active) {
      this.sidebarActive = active;
    }
  }
};
</script>

<style lang="scss" scoped>
.learn-container {
  width: 100%;
  font-family: Roboto;
  font-style: normal;

  display: flex;
  flex-direction: row;
  margin-left: 0;
  padding-left: 0;
  background: #ffffff;

  .learn {
    width: 100%;
    margin: 16px 92px 16px 32px;
    background: #ffffff;

    .learn-header {
      padding-bottom: 32px;
      border-bottom: 1px solid #797979;
      margin-bottom: 32px;

      .learn-title {
        font-family: Roboto;
        font-style: normal;
        font-weight: 500;
        font-size: 30px;
        line-height: 40px;
        /* identical to box height, or 117% */
        text-align: center;
      }

      .categories {
        margin-top: 16px;
        margin-bottom: 32px;

        .category-buttons {
          margin-left: -8px;
          margin-right: -8px;
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(var(--category-width), 120px)
          );
          grid-column-gap: 16px;
          grid-row-gap: 8px;
          justify-content: center;

          .category-button {
            border-radius: 8px;

            padding: 4px;
            max-width: 200px;

            height: 64px;
            font-family: 'Open Sans';
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 23px;
            text-align: center;

            margin: 4px 0px 4px 0px;

            color: white;

            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .filter-search {
        display: flex;
        justify-content: space-between;
        align-items: center;

        margin-right: 0;

        .filter-box {
          margin-left: 2px;
        }

        .search-box {
          height: 64px;
          background: #ffffff;
          border: 0.25px solid #797979;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
          border-radius: 10px;

          margin-right: -10px;

          padding: 0 16px 0 24px;

          display: flex;
          align-items: center;

          .search-icon {
            color: black;
            font-size: 20px;
          }

          .text-search {
            padding-left: 16px;
            width: 100%;
            background: transparent;
            border: none;
          }
        }
      }
    }

    .learn-main {
      margin: 16px 0px 16px 0px;

      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(344px, 1fr));
      grid-column-gap: 8px;
      grid-row-gap: 16px;

      .learn-card {
        width: 100%;
      }
    }
  }
}

.learn-main-empty {
  display: flex;
  justify-content: center;
  align-items: flex-end;

  height: 25vh;

  .empty-text {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 35px;
  }
}

.learn-body {
  display: flex;
  flex-direction: row;
  margin: 15px;
  width: 100%;
}

.pointer {
  cursor: pointer;
}

.sub-title {
  margin-left: 4px;
  margin-bottom: 4px;
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
}

// MOBILE STYLES
@media (max-width: 600px) {
  .learn-container {
    width: 100vw;

    .learn {
      width: 100%;
      margin: 0px !important;

      .learn-main {
        margin: 8px auto;
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center !important;

        .learn-card {
          min-width: 100%;

          margin-bottom: 8px;
        }
      }
    }

    .categories {
      padding: 0px 8px 0px 8px;

      margin-top: 0px !important;
      margin-bottom: 8px !important;

      .category-buttons {
        display: flex !important;
        flex-wrap: wrap;
        padding-left: 0px;
        justify-content: center !important;

        .category-button {
          margin: 4px 0px !important;
          min-width: 136px;
          max-width: 50%;
          height: 32px !important;
          // padding: 8px !important;
          padding-top: auto !important;
          padding-bottom: auto !important;
          padding-left: 4px !important;
          padding-right: 4px !important;
          font-size: 12px !important;

          margin: 4px !important;
        }
      }
    }

    .filter-search {
      padding: 0px 8px 0px 8px;

      .filter-box {
        margin-right: -10px;
        margin-bottom: 4px;
        height: auto;
      }
    }
  }

  .learn-main-empty {
    height: 5vh;
  }

  .sub-title {
    font-size: 12px;
  }

  .mobile_toggle {
    display: none;
  }
}
</style>

<style>
/* filter box dropdown styling */
.filter-box .vs__dropdown-menu {
  /* display: flex; */

  min-height: 256px;
  margin-top: 8px;
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border: 0.25px solid #797979;

  background: #ffffff;
  color: #333333;
}

/* filter box */
.filter-box .vs__dropdown-toggle {
  padding: 0px 8px 0px 16px;
  min-height: 64px;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border: 0.25px solid #797979;

  background: #ffffff;

  display: flex;
}

/* right icon coloring */
.filter-box .vs__clear,
.filter-box .vs__open-indicator {
  fill: #333333;
  margin-right: 16px;
}

.filter-box .vs__selected {
  height: 32px;

  padding: 0 8px 0 8px;
  margin-left: 8px;
  margin-top: 2px;
  margin-bottom: 2px;

  background: #ffffff;
  border: 1px solid #45ace1;
  box-sizing: border-box;
  border-radius: 18px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  /* identical to box height */
  display: flex;
  align-items: center;

  color: #45ace1;
}

.filter-box .vs__selected-options {
  display: flex;
  align-items: center;
}

.filter-box .vs__deselect {
  margin-left: 16px;
  fill: #45ace1;
}
</style>

