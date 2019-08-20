<template>
  <div class="content-container">
    <div class="main main-raised">
      <div class="blog-post">
        <div class="container">
          <article class="section section-text">
            <div class="row">
              <div class="col-xs-12 col-md-8 col-md-offset-2 page-content-wrap">
                <h1 id="terms" v-html="content.title"></h1>
                <div v-for="(termItem,i) in content.terms" :key="i">
                  <h2 v-html="termItem.title"></h2>
                  <p v-html="termItem.paragraph"></p>
                </div>
                <br />
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import content from "@/Website/copy/Terms";

export default {
  name: "Learn-More",
  metaInfo: {
    title: "Terms and Conditions"
  },
  data() {
    return {
      content
    };
  }
};
</script>

<style lang="scss" scoped>
.content-container {
  margin-top: 100px;
  width: 100vw;
  overflow: hidden;
  h1,
  h2 {
    // text-align: justify;
    line-height: 1.2;
    font-family: "Montserrat", sans-serif;
    font-weight: 200;
    color: #2f2f2f;
    font-size: 58px;
    .bold {
      font-weight: 700;
    }
  }

  h2 {
    font-size: 36px;
    margin-top: 60px;
  }
  p,
  ul {
    font-family: "Lato", sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 29px;
    color: #2a2a2a;
    margin-top: 60px;
  }
}

@media (max-width: 850px) {
  h1,
  h2,
  ul,
  p {
    width: 90%;
    max-width: 800px;
    min-width: 200px;
    margin: 0 auto;
  }
}
</style>
