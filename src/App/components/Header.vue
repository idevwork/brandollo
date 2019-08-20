<template>
  <!-- Navigation Bar-->
  <header id="topnav">
    <b-navbar class="topbar-main" toggleable="md" :style="isTest">
      <div class="container-fluid">
        <div class="logo">
          <router-link title="Brandollo" :to="'/' + currentTeamId + '/actions-list/'">
            <img :src="logoSmall" alt height="26" class="logo-small" style="padding-left:10px" />
            <img :src="logo" alt height="55" class="logo-large" />
            <span
              style="color:black; margin-left:10px   ; text-align: center; font-size:12px;    vertical-align: middle;"
            >BETA</span>
          </router-link>
        </div>

        <div class="menu-extras topbar-custom">
          <ul class="list-unstyled topbar-right-menu float-right mb-0">
            <li class="menu-item">
              <a @click="toggleMenu" ref="navLink" class="navbar-toggle nav-link">
                <div class="lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </a>
            </li>
            <li class="dropdown notification-list">
              <!-- show -->
              <a
                @click="toggleProfileMenu"
                class="nav-link dropdown-toggle waves-effect nav-user"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="false"
                aria-expanded="true"
              >
                <span class="ml-1">
                  <font-awesome-icon v-if="isFree" icon="bullseye" />
                  <i v-if="isPremium" class="icon-energy"></i>
                  <i v-if="isTrial" class="icon-drop" />
                  Hi {{username}}
                  <font-awesome-icon icon="chevron-down" />
                </span>
              </a>
              <div
                ref="profileMenu"
                class="dropdown-menu dropdown-menu-right profile-dropdown"
                x-placement="bottom-end"
                style="position: absolute; transform: translate3d(-15px, 60px, 0px); top: 0px; left: 0px; will-change: transform;"
              >
                <!-- item-->
                <a
                  v-for="(item, index) in teams"
                  :key="index"
                  class="dropdown-item notify-item team-item"
                  v-on:click="switchTeam($event, item['teamId'])"
                >
                  <span class="team-menu-item">
                    <i class="fi-cog"></i>
                    <div class="team-pic"></div>
                    <span
                      :class="item['teamId'] == currentTeamId ? 'active-team' : ''"
                    >{{item['team']['name']}}</span>
                  </span>
                </a>

                <!-- item-->
                <a v-on:click="teamSettings" class="dropdown-item notify-item pointer">
                  <i class="fi-cog"></i>
                  <span>Team Settings</span>
                </a>

                <!-- item-->
                <a v-bind:href="manageAccountUrl" class="dropdown-item notify-item">
                  <i class="fi-cog"></i>
                  <span>User Settings</span>
                </a>

                <router-link
                  :to="'/team/'+ currentTeamId + '/notifications'"
                  class="dropdown-item notify-item"
                >
                  <i class="fi-cog"></i>
                  <span>Notifications</span>
                </router-link>

                <a :href="websiteUrl" class="dropdown-item notify-item">
                  <i class="fi-cog"></i>
                  <span>Website</span>
                </a>
                <!-- item-->
                <a v-on:click="signOut" class="dropdown-item notify-item pointer">
                  <i class="fi-power"></i>
                  <span>Logout</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </b-navbar>

    <div v-if="!hideMenu" class="navbar-custom">
      <div class="container-fluid">
        <div ref="blueMenu" id="navigation">
          <ul class="navigation-menu">
            <!-- <li>
                            <router-link title="Dashboard" :to="'/' + currentTeam + '/dashboard/'">
                                <i class="icon-speedometer"></i>Marketing Dashboard</router-link>
            </li>-->
            <li>
              <router-link
                title="Create Plan"
                :to="'/' + currentTeamId + '/plan/create-more'"
              >Create</router-link>
            </li>
            <li>
              <router-link
                title="Marketing Actions"
                :to="'/' + currentTeamId + '/actions-list/'"
              >My Plans</router-link>
            </li>
            <li>
              <router-link
                title="Marketing Actions"
                :to="'/' + currentTeamId + '/actions-list/timeline'"
              >Timeline</router-link>
            </li>
            <li>
              <router-link title="Learn Tools" :to="'/' + currentTeamId + '/learn/'">Education</router-link>
            </li>
            <li>
              <router-link title="Coming soon" to="/questions/" event>
                Tools
                <i class="icon-lock"></i>
              </router-link>
            </li>
           <li>
               <router-link
                  title="Support"
                  to="/help"
                >Support</router-link>
           </li>
          </ul>

          <mini-spinner
            v-if="pendingOperation"
            parentStyleValue="margin-left:auto"
            styleValue="background-color:#ffffffb3; height:10px; width:10px;"
          />
        </div>
      </div>
    </div>
    <!-- end navbar-custom -->
  </header>
  <!-- End Navi gation Bar-->
</template>


<script>
import logo from "../assets/images/logo.png";
import logoSmall from "../assets/images/logo_sm.png";
import settings from "@/settings";
import MiniSpinner from "@/App/components/Shared/MiniSpinner";

import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "Header",
  props: ["hideMenu"],
  components: {
    MiniSpinner
  },
  data() {
    return {
      logo: logo,
      logoSmall: logoSmall,
      showMenu: false,
      websiteUrl: settings.host
    };
  },
  computed: {
    ...mapState({
      user: state => state.userStore.user,
      pendingOperation: s =>
        !s.actionStore.isOperationReady | !s.article.isOperationReady
    }),
    ...mapGetters({
      username: "username",
      isPremium: "isPremium",
      isTrial: "isTrial",
      isFree: "isFree",
      currentTeamId: "currentTeamId",
      teams: "teams"
    }),
    isTest: function() {
      return settings.env == "local" || settings.env == "dev"
        ? { "background-color": "#d83333" }
        : null;
    },
    manageAccountUrl: function() {
      return settings.authority + "/Manage/Index";
    },
    registerUrl: function() {
      return (
        `${settings.authority}/Account/Register?returnurl=` +
        encodeURI(`${settings.host}/Dashboard`)
      );
    }
  },
  mounted: function() {
    let that = this;

    // document.body.onclick = evt => {
    //   if (document.querySelector(".profile-dropdown.show"))
    //     // checking if menu is open
    //     this.$refs.profileMenu.classList.toggle("show");
    // };
  },
  methods: {
    ...mapActions({
      changeCurrentTeam: "changeCurrentTeam",
      resetStore: "ResetStore",
      signOut: "signOut"
    }),
    toggleMenu: function() {
      this.showMenu = !this.showMenu;
      this.$refs.navLink.classList.toggle("open");
      if (this.showMenu) {
        this.$refs.blueMenu.style.display = "block";
      } else {
        this.$refs.blueMenu.style.display = "none";
      }
    },
    toggleProfileMenu: function() {
      this.$refs.profileMenu.classList.toggle("show");
    },
    toggleEducationMenu: function() {
      this.$refs.eduMenu.classList.toggle("open");
      this.$refs.eduMenuLink.classList.toggle("open");
    },
    premiumPopup() {
      let that = this;
      that
        .$swal({
          title: "Premium actions are not available",
          text:
            "Upgrade your account to Brandollo Buisness Essentials to unlock all Actions",
          showCancelButton: true,
          cancelButtonText: "Nevermind",
          confirmButtonText: "Upgrade",
          type: "info",
          confirmButtonClass: "btn btn-confirm mt-2",
          cancelButtonClass: "btn btn-secondary mt-2"
        })
        .then(result => {
          console.log(result);
          if (result.dismiss === "cancel" || result.dismiss === "overlay") {
            return;
          }
          that.$router.push({ name: "Checkout Essentials" });
        });
    },
    soonPopup() {
      let that = this;
      that.$swal({
        title: "Coming soon",
        text:
          "We're still working on this section. We'll notify you when it's ready",

        confirmButtonText: "Ok",
        type: "info",
        confirmButtonClass: "btn btn-confirm mt-2"
      });
    },
    // function to swicth team
    switchTeam: function(evt, id) {
      this.changeCurrentTeam(id).then(_ => {
        this.resetStore().then(_ => {
          // updating team id in url
          this.$router.push({
            name: this.$route.name,
            params: { team: id }
          });
        });
      });

      evt.stopPropagation();
    },
    // navigate to team settings page
    teamSettings: function() {
      // using router to navigate to team settings page
      this.$router.push({
        name: "team settings",
        params: { teamid: this.currentTeamId }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
//   @import "~bootstrap-vue/dist/bootstrap-vue.css";
//   @import "../scss/dashboard/style.scss";
.logo-large {
  height: 40px;
}

.logo-small {
  height: 26px;
}

.navbar {
  margin-bottom: 0;
  border: 0;
  padding: 0;
}

// .clearfix:before, .container-fluid:after, .container-fluid:before, .container:after, .container:before, .dl-horizontal dd:after, .dl-horizontal dd:before, .form-horizontal .form-group:after, .form-horizontal .form-group:before, .nav:after, .nav:before, .navbar-collapse:after, .navbar-collapse:before, .navbar-header:after, .navbar-header:before, .navbar:after, .navbar:before, .row:after, .row:before {
//     content: "lala";
//     display: table;
// }

.container-fluid:after,
.container-fluid:before {
  content: none;
  display: table;
}
.team-menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.team-item {
  white-space: initial !important;
}
.active-team {
  font-weight: bold;
}
.team-pic {
  height: 40px;
  width: 40px;
  border-radius: 50px;
  margin-right: 5px;
  background-color: rgb(194, 194, 194);
}

.pointer {
  cursor: pointer;
}
</style>
