<template>
  <spinner :ready="isReady">
    <div class="error-container">
      <h3>There was a problem signing you in. Please log in again.</h3>
      <h3>        
        <a href="/">Back Home</a>
      </h3>
    </div>
  </spinner>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Spinner from "@/App/components/Spinner";

export default {
  name: "Refresh",
  components: {
    Spinner
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      isReady: false
    };
  },
  computed: {
    ...mapState({
      //  signedIn: s => s.userStore.signedIn
    })
  },
  created: function() {
    console.log("refreshing token");

    this.refresh().then(
      () => {
        this.resetStore().then(signedIn => {
          let dest = this.$route.query.destination;
          dest = dest ? dest : "/app/actions-list";
          console.log("dest");
          this.$router.push({
            path: dest
          });
        });
      },
      e => {
        this.isReady = true;
      }
    );
  },
  methods: {
    ...mapActions({
      refresh: "refreshToken",
      resetStore: "ResetStore",
      signIn: "signIn"
    })
  }
};
</script>

<style scoped>
.error-container {
  background-color: white; 
  margin:50px; 
}
</style>
