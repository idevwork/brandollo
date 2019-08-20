<template>
  <spinner style="margin:300px;" :ready="isReady"></spinner>
</template>


<script>
import Spinner from "@/App/components/Spinner";
import { mapActions } from "vuex";

export default {
  name: "Hello",
  components: {
    spinner: Spinner
  },
  data() {
    return {
      isReady: false
    };
  },
  mounted() {  
    console.log('Silent Callback')
    this.signInSilent();
  },
  methods: {
    ...mapActions({
      signInSilent: "signInSilent"
    })
  }
};
</script>

<style >
.sk-three-bounce .sk-child {
    background-color: #45ace1; 
}
</style>
