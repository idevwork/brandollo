<template>
  <div>
    <div class="content-container">
      <div class="row blue-bg-row blue-bg-row-desktop">
        <div class="col-xs-12">
          <p class="heading">
            <span class="bold">Startup</span> Marketing Package
          </p>

          <videoPlayer
            :source="videoUrl"
            :width="videoLarge.width"
            :height="videoLarge.height"
            class="vid-player hidden-xs"
          ></videoPlayer>

          <router-link
            title="Learn more"
            to="/register/checkout?product=free-subscription"
            class="get-started-button"
          >Get Started</router-link>
        </div>
      </div>

      <div class="row blue-bg-row blue-bg-row-mobile">
        <div class="col-xs-12">
          <p class="heading">
            <span class="bold">Startup</span> Marketing Package
          </p>

          <videoPlayer
            :source="videoUrl"
            :width="videoSmall.width"
            :height="videoSmall.height"
            class="vid-player hidden-xs"
          ></videoPlayer>

          <router-link
            title="Learn more"
            to="/register/checkout?product=free-subscription"
            class="get-started-button"
          >Get Started</router-link>
        </div>
      </div>

      <productSections></productSections>
    </div>
    <!-- end content container -->
  </div>
</template>

<script>
import settings from "@/settings";
import VideoPlayer from "@/Common/components/VideoPlayer";
import ProductSections from "@/Website/views/partial/ProductDetails";

export default {
  name: "Enquire",
  metaInfo: {
    title: "Become a Trail Blazer"
  },
  components: {
    videoPlayer: VideoPlayer,
    productSections: ProductSections
  },
  data() {
    return {   
      wdw: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    videoLarge() {
      return {
        width: this.wdw.width * 0.3 * 1.78,
        height: this.wdw.width * 0.3
      };
    },
    videoSmall() {
      return {
        width: this.wdw.width * 0.5,
        height: this.wdw.height * 0.4
      };
    }
  },
  created() {
    let videoId = this.$route.query.v;

    if (!videoId) {
      videoId = 304289307;
    }

    this.videoUrl = "https://player.vimeo.com/video/" + videoId;

    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.wdw.width = window.innerWidth;
      this.wdw.height = window.innerHeight;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.content-container {
  width: 100vw;
  overflow: hidden;
  .heading {
    // text-align: justify;
    line-height: 1.2;
    font-family: "Montserrat", sans-serif;
    font-weight: 200;
    color: #2f2f2f;
    font-size: 40px;
    .bold {
      font-weight: 700;
    }
  }
  .small {
    font-family: "Lato", sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 29px;
    color: #2a2a2a;
    margin-top: 60px;
  }
  .text-container {
    width: 70%;
    margin: 0 auto;
  }
  .blue-bg-row {
    background-image: url("../assets/img/bg/blue-vector-bg.png");
    background-size: 105vw;
    background-repeat: no-repeat;
    background-position: top right;
    padding-top: 110px;
    padding-bottom: 100px;
    text-align: center;
    .get-started-button {
      display: block;
      margin: 40px auto;
      max-width: 200px;
    }
    img {
      width: 75%;
      // max-width: 590px;
      min-width: 290px;
    }
  }
  .get-started-button {
    display: block;
    background: linear-gradient(74.83deg, #e0234e -2.08%, #f84a4f 103.33%);
    box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.21);
    color: #fff;
    font-family: Lato;
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    width: 33.33%;
    border-radius: 7px;
    height: 64px;
    line-height: 64px;
    text-decoration: none;
    text-align: center;
    margin-top: 80px;
    transition: 0.2s;
    -webkit-appearance: none;
    -moz-appearance: none;
    &:hover {
      box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.51);
      transition: 0.2s;
      border: none;
    }
  }
}

@media (max-width: 1600px) {
  .content-container {
    .text-container {
      width: 80%;
    }
  }
}

@media (max-width: 1600px) {
  .content-container {
    .blue-bg-row {
      img {
        width: 90%;
      }
    }
  }
}

@media (max-width: 1066px) {
  .content-container {
    .text-container {
      width: 90%;
    }
    .get-started-button {
      width: 30%;
      font-size: 18px;
    }
  }
}

@media (max-width: 950px) {
  .content-container {
    .blue-bg-row {
      img {
        width: 90%;
        margin-top: 60px;
      }
    }
  }
}

@media (max-width: 910px) {
  .content-container {
    .heading {
      font-size: 35px;
    }
    .small {
      font-size: 16px;
    }
    .get-started-button {
      width: 30%;
      font-size: 14px;
    }
  }
}

@media (min-width: 768px) {
  .blue-bg-row-mobile {
    display: none;
  }
}

@media (max-width: 767px) {
  .blue-bg-row-desktop {
    display: none;
  }
  .blue-bg-row-mobile {
    img {
      display: block;
      margin: 0 auto;
    }
  }
  .content-container {
    .blue-bg-row {
      background-size: cover;
    }
  }
}

@media (max-width: 375px) {
  .content-container {
    .get-started-button {
      width: 40%;
      font-size: 14px;
    }
  }
}

// larger screens

@media (min-width: 1600px) and (min-height: 700px) {
  .content-container {
    .text-container {
      margin-top: 100px;
    }
  }
}

@media (min-width: 2100px) and (min-height: 1000px) {
  .content-container {
    .text-container {
      margin-top: 0px;
    }
    .small {
      font-size: 25px;
    }
  }
}

@media (min-width: 2300px) and (min-height: 1200px) {
  .content-container {
    .text-container {
      margin-top: 120px;
    }
    .heading {
      font-size: 65px;
    }
    .small {
      font-size: 28px;
    }
    .blue-bg-row {
      padding-bottom: 300px;
    }
  }
}

@media (min-width: 2500px) and (min-height: 1200px) {
  .content-container {
    .heading {
      font-size: 70px;
    }
    .small {
      font-size: 35px;
      line-height: 1.5;
    }
  }
}
</style>
