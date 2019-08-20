<template>
  <section class="hestia-blogs" id="blog" data-sorder="hestia_blog">
   <div v-if="!ready">
        <img style="width:10vh; display:block;margin:auto;" :src="loadingAnimation">
    </div>
    <div v-else class="container">
                <div class="row">
                    <div class="col-md-8 col-md-offset-2 text-center">
                        <h2 class="hestia-title">Brandollo Marketing Blog</h2>
                        <h5 class="description">Check out our blog for marketing tips and advice</h5>
                    </div>
                </div>
                <div class="hestia-blog-content">
                    <div class="row">
                        <article v-for="post in posts" :key="post.guid" class="col-md-4 hestia-blog-item">
                            <div class="card card-plain card-blog">
                                <div class="card-image">
                                    <a :href="post.link" :title="post.title">
                                        <span v-html="getLink(post['content:encoded'])"></span>   
                                    </a>
                                </div>
                                <div class="content">
                                    <h6 class="category">
                                        <a :href="post.link" title="View all posts in Marketing Strategy">{{post.categories[0]}}</a>
                                    </h6>
                                    <h4 class="card-title">
                                        <a class="blog-item-title-link" :href="post.link" :title="post.title"
                                            rel="bookmark">
                                           {{post.title}}</a>
                                    </h4>
                                    <p class="card-description">{{post.contentSnippet | truncate}}
                                        <a class="moretag" :href="post.link"> Read more&hellip;</a>
                                    </p>
                                </div>
                            </div>
                        </article>                  
                    </div>
                 
                    <div class="row"></div>
                </div>
            </div>
        </section>
</template>

<script>
import Parser from "rss-parser";
import loadingAnimation from "../assets/loading.svg";

export default {
  name: "Blog-Summary",
  data() {
    return {
      ready: false,
      loadingAnimation: loadingAnimation,
      posts: []
    };
  },
  mounted: function() {
    let that = this;
    let parser = new Parser();

    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    parser.parseURL(
      CORS_PROXY + "http://blog.brandollo.com/feed/",
      function(err, feed) {
        for (var i = 0; i <= 2; i++) {
          that.posts.push(feed.items[i]);
        }
        that.ready = true;
      }
    );
  },
  methods: {
    getLink: function(string) {
      // var re = /<img[^>]+src="([^">]+)"/;
      var re = /<img[^>]+>/;
      var results = string.match(re);
      if (!results) {
        return null;
      }
      var rr = results[0]
        .split("http://brandollo.com")
        .join("")
        .split("/wp-content/")
        .join("https://blog.brandollo.com/wp-content/");

      return rr;
    }
  },
  filters: {
    truncate: function(string) {
      return string.substring(0, 100);
    }
  }
};
</script>

<style scoped>
</style>
