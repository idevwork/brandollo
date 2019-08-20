<template>
  <div class="content-container">
    <div class="col-md-8 col-md-offset-2 page-content-wrap">
      <h1 class="hestia-title">Grow Your Startup</h1>

      <h2>
        Enter your email to download the
        <b>'Marketing Basics For Startup Founders' eBook</b>
      </h2>
      <a
        v-if="showDownloadLink"
        class="get-started-button"
        href="https://brandolloplatformstore.blob.core.windows.net/public/Marketing%20Basics%20For%20Startup%20Founders.pdf"
        @click.capture="downloaded"
        download
        target="_blank"
      >
        <font-awesome-icon icon="download"/> Download Now
      </a>

      <div v-else>
        <div class="get-started-form">
          <input v-model="email" required="required" type="email" placeholder="Your email">
          <a @click="subscribe()" class="get-started-button">Download Now</a>

          <p v-if="errorMessage && !successMessage" transition="fade">{{ errorMessage }}</p>
          <p v-if="successMessage" transition="fade">{{ successMessage }}</p>
        </div>
      </div>

      <span class="small" style="margin:50px">
        Every Startup needs to connect with customers in order to grow, and marketing is the tool which makes that possible. In this free eBook you will learn some of the most impactful
        marketing basics that you can implement in your Startup.
      </span>
    </div>
  </div>
</template>

<script>
import settings from "@/settings";
import loadingAnimation from "../assets/loading.svg";

export default {
  name: "Download-Ebook",
  metaInfo: {
    title: "Download ebook"
  },
  // mixins: [auth],
  data() {
    return {
      isReady: false,
      successMessage: null,
      errorMessage: null,
      isSubscribed: false,
      email: "",
      response: {}
    };
  },
  computed: {
    showDownloadLink: function() {
      return this.isSubscribed;
    }
  },
  mounted: function() {
    let that = this;

    // this.getUser(function() {
    that.isReady = true;
    //  console.log("ready");
    // });
  },
  methods: {
    subscribe: function() {
      let that = this;
      if (!that.email) {
        that.errorMessage = "Email cannot be blank";
      }

      const payload = {
        source: "ebook",
        email: that.email
      };

      const resourceUrl = settings.accountApi + "mailinglist/subscribe";

      that.$http
        .post(resourceUrl, payload)
        .then(response => {
          if (response.data.success) {
            that.successMessage = response.data.message;
            that.isSubscribed = true;
          } else {
            if (response.data.message == "You are subscribed already") {
              that.isSubscribed = true;
            }
            that.errorMessage = response.data.message;
          }
        })
        .catch(function(error) {
          console.log(error.response.data);
        });
    },
    downloaded: function() {
      console.log("hiyo");
      const resourceUrl =
        settings.accountApi + `mailinglist/ebook?userEmail=${this.email}`;
      this.$http.get(resourceUrl);
    }
  }
};
</script>

<style lang="scss" scoped>
.content-container {
  margin-top: 100px;
  margin-bottom: 40px;
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

  .get-started-form {
    // float: right;
    width: 90%;
    margin-left: 10%;
    margin-top: 40px;
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
    &:hover {
      box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.51);
      transition: 0.2s;
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
}
</style>
