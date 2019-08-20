<template>
   <div class="wrapper">
        <header class="header ">         
            <div id="primary" class="boxed-layout-header page-header header-small">
                <div class="container">
                    <div class="row">
                        <div class="col-md-10 col-md-offset-1 text-center">
                            <h1 class="hestia-title">Whoops..</h1>
                        </div>
                    </div>
                </div>

                <div data-parallax="active" class="header-filter"></div>
            </div>
        </header>
        <div class="main main-raised">
            <div class="blog-post ">
                <div class="container">
                    <article class="section section-text">
                        <div class="row">
                            <div class="col-md-8 col-md-offset-2 page-content-wrap">
                                 <h2>Something didn't go as planned while processing your request.</h2>
                                <p>
                                    Please contact Brandollo Support and quote the following: 
                                    <br>
                                    {{error}}
                                    <br>
                                    <router-link title="Brandollo" to="/">Click here</router-link> to go back home. 
                                </p>                             
                            </div>
                        </div>
                    </article>                 
                </div>
            </div>       
        </div>
    </div>
</template>

<script>
export default {
  name: "Not-Found",
  metaInfo: {
    title: "404 - Not Found"
  },
  data() {
    return {};
  },
  computed: {
    error: function() {
      this.rollbar.error(this.$route.query.message);
      return this.$route.query.message;
    }
  }
};
</script>

<style scoped>

</style>
