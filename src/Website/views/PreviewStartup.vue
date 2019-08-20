<template>
  <div>
    <div class="content-container">
      <div class="row blue-bg-row blue-bg-row-desktop">
        <div class="col-xs-12 col-md-6">
          <div class="text-container">
            <p class="heading">
              <span class="bold">
             Brandollo is a new platform that helps Startups kickstart their growth with affordable marketing advice & software.
            <br>Use Brandollo to:
              </span>
            </p>
            <ul class="small">
                <li>Develop your brand</li>
              <li>Set up your marketing basics</li>
              <li>Get a customised marketing plan</li>
              <li>Launch your first marketing campaign & grow</li>
            </ul>
            <div class="get-started-form">
              <input v-model="email" type="email" placeholder="Your email">
              <a @click="ctaClicked" class="get-started-button">Get Started</a>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-md-6">
          <videoPlayer
            :source="videoUrl"
            :width="videoLarge.width"
            :height="videoLarge.height"
            class="vid-player"
          ></videoPlayer>
        </div>
      </div>

      <div class="row blue-bg-row blue-bg-row-mobile">
        <div class="col-xs-12">
          <videoPlayer
            :source="videoUrl"
            :width="videoSmall.width"
            :height="videoSmall.height"
            class="vid-player"
          ></videoPlayer>
        </div>
        <div class="col-xs-12">
          <div class="text-container">
            <p class="heading">
              Brandollo is a new software that
              <span class="bold">simplifies</span> marketing for small businesses
            </p>
            <p class="small">
              It’s easy to use and will design a custom marketing plan for your business. Every marketing action that Brandollo recommends for your business is accompanied by both marketing tutorials and helpful workflow tools.
              <br>
              <br>Discover a better way to plan and manage your marketing with Brandollo.
            </p>

           <div class="get-started-form">
              <input v-model="email" type="email" placeholder="Your email">
              <a @click="ctaClicked" class="get-started-button">Get Started</a>
            </div>
          </div>
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
import SubscribeMixin from "@/Common/mixins/Subscribe";

export default {
  name: "Free-Landing",
  metaInfo: {
    title: "Become a Trail Blazer"
  },
  mixins: [SubscribeMixin],
  props: ["list"],
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
    getStartedUrl() {
      return `/register/checkout?product=free-subscription&email=${
        this.email
      }`;
    },
    videoLarge() {
      return {
        width: this.wdw.width * 0.25 * 1.78,
        height: this.wdw.width * 0.25
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
      this.$data.wdw.width = window.innerWidth;
      this.$data.wdw.height = window.innerHeight;
    },
    ctaClicked() {
      let that = this; 
      let toList = that.list;
      if (!toList) {
        toList = "trail-blazer";
      }

      if (this.email) {
        this.subscribe(toList);
      }
      that.$router.push(
        `/register/checkout?email=${
          that.email
        }&product=free-subscription`
      );
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
    font-size: 30px;
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
    margin-top: 20px;
  }
  .text-container {
    width: 70%;
    margin: 0 auto;
  }


  .get-started-form {

    input {
      height: 64px;
      line-height: 64px;
    }
    input[type="email"] {
      font-family: "Lato";
      font-weight: 300;
      color: #2a2a2a;
      background: #f1f1f1;
      border: 1px solid #f1f1f1;
      border-radius: 3px;
      font-size: 19px;
      width: 60.66%;
      padding-left: 25px;
    }
    a {
      display: inline-block;
      background: linear-gradient(74.83deg, #e0234e -2.08%, #f84a4f 103.33%);
      border: none;
      box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.21);
      color: #fff;
      font-family: Lato;
      font-style: normal;
      font-weight: 700;
      font-size: 22px;
      width: 33.33%;
      border-radius: 7px;
      height: 66px;
      transition: 0.2s;
      &:hover {
        box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.51);
        transition: 0.2s;
      }
    }
    ::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #2a2a2a;
    }
    ::-moz-placeholder {
      /* Firefox 19+ */
      color: #2a2a2a;
    }
    :-ms-input-placeholder {
      /* IE 10+ */
      color: #2a2a2a;
    }
    :-moz-placeholder {
      /* Firefox 18- */
      color: #2a2a2a;
    }
  }



  .blue-bg-row {
    background-image: url("../assets/img/bg/blue-vector-bg.png");
    background-size: 105vw;
    background-repeat: no-repeat;
    background-position: top right;
    padding-top: 110px;
    padding-bottom: 100px;
    margin-top:90px; 
    min-height: 80vh;
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
    margin-top: 40px;
    transition: 0.2s;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
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

@media (min-width: 1024px) {
  .content-container {
    .blue-bg-row-mobile {
      display: none;
    }
  }
}

@media (max-width: 1023px) {
  .content-container {
    .blue-bg-row-desktop {
      display: none;
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

@media (max-width: 767px) {
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
