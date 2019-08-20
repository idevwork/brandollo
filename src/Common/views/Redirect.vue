<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'Redirect',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }, 
   created:function(){
       window.location = this.$route.query.destination
   }
}
</script>

<style scoped>

</style>
