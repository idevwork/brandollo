<template>
  <div>

    <div class="content-container">


      <div class="row blue-bg-row blue-bg-row-desktop">
        <div class="col-xs-12 col-md-6">
          <div class="text-container">
            <p class="heading">
              <span class="bold">Startup</span> Marketing Package
            </p>
            <p class="small">
              It’s easy to use and will design a custom marketing plan for your business. Every marketing action that Brandollo recommends for your business is accompanied by both marketing tutorials and helpful workflow tools.
            </p>

            <router-link title="Learn more" to="/pricing" class="get-started-button">Get Started</router-link>
          </div>
        </div>
        <div class="col-xs-12 col-md-6">
            <videoPlayer
              :source="videoUrl"
           :width="videoLarge.width"
            :height="videoLarge.height"
              class="vid-player hidden-xs"
            ></videoPlayer>

        </div>
      </div>

      <div class="row blue-bg-row blue-bg-row-mobile">
        <div class="col-xs-12">
          <videoPlayer
            :source="videoUrl"
         :width="videoSmall.width"
            :height="videoSmall.height"
            class="vid-player hidden-xs"
          ></videoPlayer>
        </div>
        <div class="col-xs-12">
          <div class="text-container">
            <p class="heading">
            Brandollo is a new software that <span class="bold">simplifies</span> marketing for small businesses
            </p>
            <p class="small">
              It’s easy to use and will design a custom marketing plan for your business. Every marketing action that Brandollo recommends for your business is accompanied by both marketing tutorials and helpful workflow tools.
              <br><br>
              Discover a better way to plan and manage your marketing with Brandollo.
            </p>

            <router-link title="Learn more" to="/pricing" class="get-started-button">Get Started</router-link>
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

export default {
  name: "Enquire",
  metaInfo: {
    title: "Preview"
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
    subscribe: function() {
      let that = this;

      const payload = {
        source: "preview",
        email: that.email
      };

      const resourceUrl = settings.accountApi + "mailinglist/subscribe";

      that.$http
        .post(resourceUrl, payload)
        .then(response => {
          console.log(response.data);
          if (response.data.success) {
            that.successMessage = response.data.message;
            that.showVideo = true;
          } else {
            that.errorMessage = response.data.message;
            if (that.errorMessage == "You are subscribed already" || that.errorMessage == "All done") {
              that.showVideo = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
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
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    color: #2F2F2F;
    font-size: 40px;
    .bold {
      font-weight: 700;
    }
  }
  .small {
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 29px;
    color: #2A2A2A;
    margin-top: 60px;
  }
  .text-container {
    width: 70%;
    margin: 0 auto;
  }
  .blue-bg-row {
    background-image: url('../assets/img/bg/blue-vector-bg.png');
    background-size: 105vw;
    background-repeat: no-repeat;
    background-position: top right;
    padding-top: 110px;
    padding-bottom: 100px;
    img {
      width: 75%;
      // max-width: 590px;
      min-width: 290px;
    }
  }
  .no-bg-row-1 {
    img {
      width: 100%;
      display: block;
      margin: 0 auto;
      padding-left: 10%;
      max-width: 800px;
      margin-top: 70px;
    }
  }
  .no-bg-row-2 {
    padding-top: 80px;
    img {
      width: 80%;
      display: block;
      margin: 0 auto;
      max-width: 700px;
      min-width: 290px;
      margin-top: 100px;
    }
  }
  .green-bg-row {
    background-image: url('../assets/img/bg/green-vector-bg.png');
    background-size: 105vw;
    background-repeat: no-repeat;
    background-position: top right;
    padding-top: 410px;
    padding-bottom: 100px;
    margin-top: -300px;
    img {
      width: 100%;
      padding-left: 10%;
      margin-top: 80px;
    }
  }
  .yellow-bg-row {
    background-image: url('../assets/img/bg/yellow-vector-bg.png');
    background-size: 105vw;
    background-repeat: no-repeat;
    background-position: bottom right;
    padding-top: 410px;
    padding-bottom: 50px;
    margin-top: -300px;
    img {
      width: 70%;
      // display: block;
      // margin: 0 auto;
      // max-width: 500px;
      min-width: 290px;
    }
  }
  .get-started-button {
    display: block;
    background: linear-gradient(74.83deg, #E0234E -2.08%, #F84A4F 103.33%);
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
    .no-bg-row-1 {
      img {
        margin-top: 120px;
      }
    }
    .green-bg-row {
      img {
        margin-top: 120px;
      }
    }
    .yellow-bg-row {
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
    // .no-bg-row-1 {
    //   img {
    //     margin-top: 120px;
    //   }
    // }
    // .green-bg-row {
    //   img {
    //     margin-top: 120px;
    //   }
    // }
    .yellow-bg-row {
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
  .no-bg-row-2-mobile, .yellow-bg-row-mobile {
    display: none;
  }
}

@media (max-width: 767px) {
  .no-bg-row-2-desktop, .yellow-bg-row-desktop {
    display: none;
  }
  .blue-bg-row-mobile, .no-bg-row-2-mobile, .yellow-bg-row-mobile {
    img {
      display: block;
      margin: 0 auto;
    }
  }
  .content-container {
    .no-bg-row-1 {
      img {
        margin-top: 0px;
      }
    }
    .no-bg-row-2 {
      img {
        margin-top: 40px;
      }
    }
    .blue-bg-row {
      background-size: cover;
    }
    .green-bg-row {
      margin-top: -150px;
      background-size: cover;
      img {
        margin-top: -60px;
      }
    }
    .yellow-bg-row {
      background-size: cover;
      background-position: bottom;
      img {
        display: block;
        margin: 0 auto;
        margin-top: -60px;
      }
    }
  }
}

@media (max-width: 660px) {
  .content-container {
    .green-bg-row {
      margin-top: -80px;
    }
  }
}

@media (max-width: 375px) {
  .content-container {
    .get-started-button {
      width: 40%;
      font-size: 14px;
    }
    .green-bg-row {
      margin-top: -40px;
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
    .no-bg-row-1 {
      margin-top: -200px;
      img {
        margin-top: 200px;
      }
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
