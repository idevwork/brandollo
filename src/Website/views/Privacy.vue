<template>
  <div class="content-container">
    <div class="main main-raised">
      <div class="blog-post">
        <div class="container">
          <article class="section section-text">
            <div class="row">
              <div class="col-md-8 col-md-offset-2 page-content-wrap">
                <h1 id="privacy" v-html="content.title"></h1>
                <p v-html="content.paragraph"></p>

                <div 
                  v-for="(policy, i) in content.policies"
                  :key="i"
                >
                  <h2 v-html="policy.title"></h2>
                  <p v-html="policy.paragraph"></p>
                </div>
                <br>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import content from "@/Website/copy/Privacy"

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
    margin-top:100PX; 
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
</style>
