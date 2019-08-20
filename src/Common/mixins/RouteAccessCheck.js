import { mapState, mapActions, mapGetters } from "vuex";
import { some } from "lodash";

export default {
  props: ["checkAccess"],
  computed: {
    ...mapState({
      signedIn: state => state.userStore.signedIn,
      currentSubscription: state => state.teamStore.subscription,
      teamId: s => s.teamStore.currentTeamId,
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.checkRoute(to, from, next);
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.checkRoute(to, from, next);
  },
  methods: {
    ...mapActions({
      initStore: "InitStore",
      signIn: "signIn"
    }),
    checkRoute: function (to, from, next) {

      if (!this.checkAccess) {
        next();
      } else {
        console.log("Router: Protected route");

        this.initStore().then(_ => {
          if (this.signedIn) {
            next();
          } else {
            console.log("Router: Not logged in, redirecting to sign in page");
            if (some(to.matched, m => m.meta.section == "app")) {
              this.signIn({
                destination: `${window.location.origin}\\app${to.fullPath}`
              });
            } else {
              this.signIn({
                destination: `${window.location.origin}${to.fullPath}`
              });
            }
          }
        });

        // this.initStore().then(_ => {
        //   if (to.path.indexOf("/expired") !== -1 && this.currentSubscription.name != null) {
        //     next('/actions-list');
        //     // window.location.href= "/app/actions-list";
        //   }
        //   else if (this.signedIn) {
        //     if (
        //       to.path.indexOf("/checkout/trial") !== -1
        //       || to.path.indexOf("/expired") !== -1
        //       || to.path.indexOf("/checkout") !== -1
        //       || to.path.indexOf("/notifications") !== -1
        //     ) {
        //       next();
        //     }
        //     else if (this.currentSubscription.name == null) {
        //       window.location.href = `/${this.teamId}/expired`
        //       // next("/checkout/essentials");
        //     } else {
        //       console.log("Router: Logged in Proceeding");
        //       next();
        //     }
        //   } else {
        //     console.log("Router: Not logged in, redirecting to sign in page");
        //     this.signIn({
        //       destination: `${window.location.origin}${to.fullPath}`
        //     });
        //   }
        // });
      }
    }
  }
};
