<template>
  <div class="container">
    <nav id="primary_nav_wrap">
      <div class="navbar-header">
        <div class="title-logo-wrapper">
          <router-link title="Brandollo" to="/">
            <img src="../assets/img/Brandollo-logo.png">
          </router-link>
        </div>
      </div>

      <ul id="main-navigation">
        <li>
          <router-link title="About" to="/about">About</router-link>
          <!-- <ul>          
            <li>
              <a href="#">Sub Menu 4</a>
              <ul>
                <li>
                  <a href="#">Deep Menu 1</a>
                  <ul>
                    <li>
                      <a href="#">Sub Deep 1</a>
                    </li>                 
                  </ul>
                </li>
                <li>
                  <a href="#">Deep Menu 2</a>
                </li>
              </ul>
            </li>         
          </ul>-->
        </li>
        <li style="z-index:1000">
          <router-link title="Features" to="/product">
            Features
            <span class="caret">></span>
          </router-link>
          <ul>
            <li>
              <router-link title="Startup" to="/for-startup">For Startups</router-link>
            </li>
            <li>
              <router-link title="Startup" to="/for-accelerators">For Accelerators</router-link>
            </li>
            <li>
              <router-link title="SMB" to="/for-small-business">For Small Business</router-link>
            </li>
          </ul>
        </li>
        <li>
          <router-link title="Pricing" to="/pricing">Pricing</router-link>
        </li>
        <li>
          <a title="Blog" href="https://blog.brandollo.com">Marketing Blog</a>
        </li>
        <li v-if="!signedIn">
          <a title="Log in" href="/app/actions-list/">Log In</a>
        </li>

        <li v-if="signedIn">
          <a title="Dashboard" href="/app/actions-list/">My Dashboard</a>
        </li>
        <li v-if="signedIn" style="z-index: 1000">
          <span>
            <a title="profile" href="#">
              Hi {{username}}
              <span class="caret">></span>
            </a>
          </span>
          <ul>
            <li v-for="(item, index) in teams" :key="index">
              <a
                style="cursor:pointer"
                :class="item['teamId'] == currentTeamId ? 'active-team' : ''"
                v-on:click="switchTeam($event, item['teamId'])"
              >{{item['team']['name']}}</a>
            </li>

            <li>
              <a v-bind:href="manageAccountUrl">Account</a>
            </li>
            <li>
              <a href="#" v-on:click="signOut" title="Logout">Logout</a>
            </li>
          </ul>
        </li>
      </ul>

      <div id="mobile-menu">
        <div @click="toggle()" class="open-mobile-menu" v-bind:class="{ active: isActive }">
          <span></span>
        </div>

        <ul class="mobile-ul" v-bind:class="{ active: isActive }">
          <li>
            <router-link title="About" to="/about" @click.native="toggle()">About</router-link>
          </li>
          <li>
            <router-link title="Pricing" to="/product" @click.native="toggle()">Features</router-link>
          </li>

          <li>
            <router-link title="Startup" to="/for-startup" @click.native="toggle()">For Startups</router-link>
          </li>
          <li>
            <router-link
              title="accelerators"
              to="/for-accelerators"
              @click.native="toggle()"
            >For Accelerators</router-link>
          </li>
          <li>
            <router-link
              title="SMB"
              to="/for-small-business"
              @click.native="toggle()"
            >For Small Business</router-link>
          </li>
          <li>
            <router-link title="Pricing" to="/pricing" @click.native="toggle()">Pricing</router-link>
          </li>
          <li>
            <a title="Blog" href="https://blog.brandollo.com">Marketing Blog</a>
          </li>
          <li v-if="signedIn">
            <a title="Dashboard" href="/app/actions-list" @click="toggle()">My Dashboard</a>
          </li>

          <li v-if="!signedIn">
            <a title="Dashboard" href="/app/actions-list" @click="toggle()">Log In</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import settings from "@/settings";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "Navigation",
  data() {
    return {
      isActive: false,
      isFeatureActive: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.userStore.user,
      signedIn: state => state.userStore.signedIn
    }),
    ...mapGetters({
      username: "username",
      isPremium: "isPremium",
      isTrial: "isTrial",
      currentTeamId: "currentTeamId",
      teams: "teams"
    }),
    // isTest: function() {
    //   return settings.env == "local" || settings.env == "dev"
    //     ? { "background-color": "#d83333" }
    //     : null;
    // },
    manageAccountUrl: function() {
      return settings.authority + "/Manage/Index";
    },
    registerUrl: function() {
      return `/register/checkout?product=basic-subscription-3`;
    },
    collapseValue: function() {
      return;
    }
  },
  mounted: function() {},
  methods: {
    toggle: function() {
      this.isActive = !this.isActive;
      this.$root.$emit("mobile-menu-change", this.isActive);
    },
    ...mapActions({
      changeCurrentTeam: "changeCurrentTeam",
      resetStore: "ResetStore",
      signOut: "signOut"
    }),
    switchTeam: function(evt, id) {
      let that = this;
      this.changeCurrentTeam(id).then(_ => {
        this.resetStore().then(_ => {
          // updating team id in url
          this.$router.push({
            name: that.$route.name,
            params: { team: id }
          });
        });
      });

      //   this.$root.$emit("teamSwitch", this.currentTeamId);
      evt.stopPropagation();
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  background-color: transparent;
  height: 3em;
  line-height: 3em;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  .title-logo-wrapper {
    float: left;
    height: 60px;
    img {
      height: 60px;
      margin-left: 120px;
      position: absolute;
      left: 0px;
    }
  }
  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
    float: right;
    &.navbar-right {
      margin-right: 20px;
      position: absolute;
      right: 0px;
    }
    li {
      display: inline-flex;
      text-align: center;
      a,
      a:visited {
        text-decoration: none;
        font-family: "Lato";
        font-weight: 700;
        color: #2f2f2f;
        font-size: 18px;
        margin: 0 50px;
        &.router-link-active {
          color: #28bedd;
        }
      }
    }
  }
}

#primary_nav_wrap {
  margin-top: 15px;

  ul {
    list-style: none;
    position: relative;
    float: right;
    margin: 0;
    padding: 0;
  }

  ul a {
    display: block;
  }

  ul li {
    position: relative;
    margin: 0;
    padding: 0;
  }

  ul li.current-menu-item {
    background: #ddd;
  }

  ul li:hover {
    // background: #f6f6f6;
  }

  ul ul {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: #fff;
    padding: 0;
  }

  ul ul li {
    float: none;
    width: 270px;
    margin: 0;
  }

  ul ul a {
    padding: 10px 0px;
  }

  ul ul ul {
    top: 0;
    left: 100%;
  }

  ul li:hover > ul {
    display: block;
  }
}

@media (max-width: 1480px) {
  nav {
    .title-logo-wrapper {
      img {
        margin-left: 80px;
      }
    }
    ul {
      &.navbar-right {
        margin-right: 0px;
      }
      li {
        a,
        a:visited {
          font-size: 16px;
          margin: 0 40px;
        }
      }
    }
  }
}

@media (max-width: 1110px) {
  nav {
    .title-logo-wrapper {
      img {
        // margin-left: -20px;
      }
    }
    ul {
      &.navbar-right {
        margin-right: 20px;
      }
      li {
        a,
        a:visited {
          font-size: 16px;
          margin: 0 20px;
        }
      }
    }
  }
}

@media (max-width: 885px) {
  nav {
    .title-logo-wrapper {
      img {
        margin-left: 15px;
      }
    }
    ul {
      &.navbar-right {
        margin-right: 0px;
      }
      li {
        a,
        a:visited {
          font-size: 14px;
          margin: 0 15px;
        }
      }
    }
  }
}

// larger screens

@media (min-width: 1800px) {
  nav {
    .title-logo-wrapper {
      img {
        margin-left: 146px;
      }
    }
    ul {
      &.navbar-right {
        margin-right: 58px;
      }
      li {
        a,
        a:visited {
          font-size: 16px;
          margin: 0 58px;
        }
      }
    }
  }
}

@media (min-width: 768px) {
  #mobile-menu {
    display: none;
  }
}

@media (max-width: 767px) {
  #main-navigation {
    display: none;
  }
  #primary_nav_wrap {
    margin-top: 0;
  }
  nav {
    background: #fff;
    border-bottom: 1px solid #ccc;
    height: 80px;
    position: fixed;
    .title-logo-wrapper {
      img {
        height: 50px;
        margin-top: 15px;
        margin-left: 20px;
      }
    }
  }
}

// mobile styles
#mobile-menu {
  nav {
    z-index: 100;
  }

  .open-mobile-menu {
    height: 60px;
    width: 60px;
    background-color: #fff;
    position: absolute;
    right: 15px;
    top: 8px;
    z-index: 100;
  }
  .open-mobile-menu span {
    position: absolute;
    top: 18px;
    right: 6px;
    width: 30px;
    height: 3px;
    padding: 10px;
    background-clip: content-box;
    background-color: #2f2f2f;
    pointer-events: none;
    transition: background-color 0.5s ease-in-out;
    visibility: visible;
    cursor: pointer;
  }

  .open-mobile-menu span:before,
  .open-mobile-menu span:after {
    position: absolute;
    background: #2f2f2f;
    content: "";
    width: 30px;
    height: 3px;
    transition: transform 0.5s ease-in-out;
  }
  .open-mobile-menu span:before {
    top: 1px;
  }
  .open-mobile-menu span:after {
    bottom: 1px;
  }

  .open-mobile-menu.active span {
    background-color: transparent;
    pointer-events: auto;
  }
  .open-mobile-menu.active span:before {
    transform: rotate(45deg) translate(7px, 6px);
  }
  .open-mobile-menu.active span:after {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  .mobile-ul {
    display: none;
    height: 100vh;
    background-color: #fff;
    position: absolute;
    left: 0;
    width: 100vw;
    // z-index: 10;
    margin-top: 81px;
    background: linear-gradient(74.83deg, #e0234e -2.08%, #f84a4f 103.33%);
    z-index: 1000;
    li {
      display: block;
      margin-top: 0;
      height: 65px;
      a,
      a:visited {
        font-family: "Montserrat", sans-serif;
        color: #fff;
        font-size: 24px;
      }
    }
  }

  .mobile-ul.active {
    display: block;
  }
}

.active-team {
  font-weight: 900;
  color: #e0234e;
}

.caret {
  display: inline-block;
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  transform: rotate(90deg);
  margin-left: 5px;
}
</style>
