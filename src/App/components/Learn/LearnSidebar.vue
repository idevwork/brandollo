<template>
  <aside :class="{ active: active }">
    <div class="sidebar__toggler sidebar__flex">
      <div v-if="active" class="sidebar__content">
        <div name="expanded" class="sidebar__title">
          <h2>My Courses</h2>
          <h3>{{bookmarks.length > 0 ? "This is your current bookmarked courses" : "You have no bookmarked courses"}}</h3>
        </div>
      </div>
      <b-button :size="'sm'" :variant="'link'" @click="toggleSidebar" class="sidebar__button">
        <font-awesome-icon style="color:black; font-size: 20px;" icon="bars" />
      </b-button>
    </div>

    <div v-if="active" class="sidebar__content fixed_scroll">
      <BookmarkCard
        v-for="(bookmark, i) in bookmarks"
        :key="i"
        :article="bookmark"
        :teamId="teamId"
        @toggle="toggleSidebar"
      />
    </div>
  </aside>
</template>

<script>
import { constants } from "crypto";
import BookmarkCard from "@/App/components/Learn/BookmarkCard";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "LearnSidebar",
  components: {
    BookmarkCard
  },
  data() {
    return {
      active: false
    };
  },
  created(vm) {
    if (this.$route.query.sidebar) {
      this.active = true;
    }
  },
  computed: {
    ...mapState({
      teamId: s => s.teamStore.currentTeamId
    }),
    ...mapGetters({
      bookmarks: "article/bookmarks"
    })
  },
  mounted() {
    let that = this;

    this.getBookmarks();
  },
  methods: {
    ...mapActions({
      getBookmarks: "article/getBookmarks"
    }),
    toggleSidebar(e) {
      this.active = !this.active;

      this.$emit("toggle-sidebar", this.active);
    }
  }
};
</script>

<style lang="scss">
@import "../../scss/dashboard/variables";

$aside-width: 60px;

aside {
  z-index: 10;
  display: block;
  width: $aside-width;
  min-width: $aside-width;
  padding-top: 15px;
  background: #ffffff;
  box-shadow: 2px 2px 45px rgba(0, 0, 0, 0.15);
  transition: width 0.5s, min-width 0.5s;

  height: 90vh;

  .sidebar__left__col {
    padding: 10px;
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: $aside-width;
    top: 150px;
    height: 100vh;
  }

  .sidebar__toggler {
    padding: 0 !important;
    cursor: pointer;
    button {
      width: 100%;
    }
  }

  &.active {
    min-width: 413px;
    .sidebar__toggler {
      text-align: right;
      button {
        width: 50px;
      }
    }

    .sidebar__content {
      padding: 0 42px 0 24px;
      transition: width 0.5s, min-width 0.5s;
    }
  }

  h2 {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 26px;
    line-height: 35px;
  }

  h3 {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    /* identical to box height */

    color: #797979;
  }
}

.sidebar__flex {
  display: flex;
  justify-content: space-between;

  align-items: flex-start;

  h2,
  h3 {
    text-align: left;
    margin-top: 0;
  }
}

.sidebar__title {
  text-align: left;
}

.fixed_scroll {
  overflow-y: scroll;
  height: 76vh;
  width: auto;
}

/* Mobile styles */
@media (max-width: 650px) {
  aside {
    min-width: 30px;
    width: 30px;

    .sidebar__toggler {
      button {
        padding: 0px !important;
      }
    }

    &.active {
      min-width: 100vw;
    }

    h3 {
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>
