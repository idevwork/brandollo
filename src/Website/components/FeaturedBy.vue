<template>
  <div class="row featured-row">
    <div class="col-xs-12">
      <h3>Featured By</h3>
    </div>
    <div v-for="(logo,i) in logos" class="col-xs-12 col-sm-3 media-logo-div" :key="i">
      <img :src="logo" class="media-logo">
    </div>
  </div>
</template>

<script>
import logo from "../assets/img/featured/bandt.png";
import logo1 from "../assets/img/featured/dynamic-buisness.png";
import logo2 from "../assets/img/featured/medium.png";
import logo3 from "../assets/img/featured/morgans.png";
import logo4 from "../assets/img/featured/mumbrella.png";
import logo5 from "../assets/img/featured/smart-company.png";
import logo6 from "../assets/img/featured/startupdaily.png";
import logo7 from "../assets/img/featured/qut.png";
import logo8 from "../assets/img/featured/australian.png";
let logos = [logo8, logo1, logo2, logo3, logo4, logo5, logo6, logo7];

export default {
  name: "FeaturedBy",
  props: {
    msg: String
  }, 
  data() {
    return {
      logos,
      active: true
    };
  },
};
</script>

<style lang="scss" scoped>
.featured-row {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 0 auto;
  h3 {
    text-align: center;
    font-family: "Montserrat", sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: normal;
    color: #2f2f2f;
  }
  img {
    display: block;
    width: 80%;
    margin: 0 auto;
    max-width: 240px;
  }
  margin-top: 50px;
}

.media-logo {
  padding: 15px;
}

@media (max-width: 767px) {
  .featured-row {
   .media-logo {
      padding: 0;
      height: 30px;
      width: auto;
      min-width: 0;
      max-width: none;
      margin-top: 40px;
    }
  }

}
</style>



