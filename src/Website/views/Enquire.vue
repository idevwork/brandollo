
<template>
  <div class="content-container">
    <div class="wrapper">
      <div class="row computer-row blue-bg-row-desktop">
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading">
              Brandollo is a better way to
              <br>
              <span class="bold">plan, track and manage</span>
              <br>your marketing
            </p>

            <p class="small">Subscribe to our mailing list below to get the latest updates!</p>
          </div>
          <div class="get-started-form">
            <input v-model="email" type="email" placeholder="Your email">
            <a @click="ctaClicked" class="get-started-button">Get Started</a>
            <p
              class="small"
              v-if="errorMessage && !successMessage"
              transition="fade"
            >{{ errorMessage }}</p>
            <p class="small" v-if="successMessage" transition="fade">{{ successMessage }}</p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <img src="../assets/gifs/Timeline.gif">
        </div>
      </div>
    </div>

    <div class="row computer-row blue-bg-row-mobile">
      <div class="col-xs-12 col-sm-6 blue-background">
        <img src="../assets/img/product/laptop-1.png">
      </div>
      <div class="col-xs-12 col-sm-6">
        <div class="text-container">
          <p class="heading">
            Brandollo is a better way to
            <br>
                 <span class="bold">plan, track and manage</span>
            <br>your marketing
          </p>

          <p class="small">Subscribe to our mailing list below to get the latest updates!</p>
        </div>
        <div class="get-started-form">
          <input v-model="email" type="email" placeholder="Your email">
          <a @click="ctaClicked" class="get-started-button">Get Started</a>
          <p
            class="small"
            v-if="errorMessage && !successMessage"
            transition="fade"
          >{{ errorMessage }}</p>
          <p class="small" v-if="successMessage" transition="fade">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SubscribeMixin from "@/Common/mixins/Subscribe";
import settings from "@/settings";

export default {
  name: "Enquire",
  mixins: [SubscribeMixin],
  props: ["list"],
  data() {
    return {};
  },
  computed: {},
  methods: {
    ctaClicked() {
      let toList = this.list;
      if (!toList) {
        toList = "beta";
        console.log("hi", toList);
      }
      this.subscribe(toList);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    font-size: 58px;
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
  .blue-bg-row-desktop {
    background-image: url("../assets/img/bg/blue-vector.png");
    background-position: top right;
    .heading {
      margin-top: 15px;
    }
    img {
      float: right;
      margin-right: -50px;
    }
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
  .blue-bg-row-mobile {
    .blue-background {
      background-image: url("../assets/img/bg/blue-vector.png");
      background-repeat: no-repeat;
      background-size: 100vw 100%;
      background-position: right;
      padding-top: 100px;
      padding-bottom: 100px;
      margin-top: -110px;
      img {
        display: block;
        width: 90%;
        height: auto;
        float: right;
        right: 0;
        overflow-x: hidden;
      }
    }
  }
  .computer-row {
    background-size: 55vw 100%;
    background-repeat: no-repeat;
    margin-top: -110px;
    min-height: 120vh;
    padding-top: 220px;
    padding-bottom: 110px;
    img {
      // max-height: 80vh;
      width: 100%;
      margin-top: 5vh;
      overflow-x: hidden;
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
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    &:hover {
      box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.51);
      transition: 0.2s;
      border: none;
    }
  }
  .green-bg-row {
    background-image: url("../assets/img/bg/green-vector.png");
    background-position: top left;
    margin-top: 80px;
    .heading {
      margin-top: 30px;
    }
    img {
      width: 90%;
    }
  }
  .yellow-bg-row-mobile {
    .yellow-background {
      background-image: url("../assets/img/bg/yellow-vector.png");
      background-repeat: no-repeat;
      background-size: 100vw 100%;
      background-position: right;
      padding-top: 100px;
      padding-bottom: 100px;
    }
  }
  .featured-row {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
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
  }
  .sign-up-section {
    background-image: url("../assets/img/bg/footer-vector.png");
    background-size: cover;
    background-repeat: no-repeat;
    height: auto;
    padding-top: 220px;
    padding-bottom: 80px;
    margin-top: 40px;
    .row {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
    .heading {
      margin-top: 50px;
      font-size: 45px;
    }
    .get-started-form {
      input[type="email"] {
        background: #fff;
        border: 1px solid #fff;
      }
    }
  }
  .text-container {
    width: 70%;
    margin: 0 auto;
  }
  .yellow-bg-row-desktop {
    background-image: url("../assets/img/bg/yellow-vector.png");
    background-position: top right;
    margin-top: 100px;
    .text-container {
      margin-top: -160px;
      .small {
        margin-top: 40px;
      }
    }
    img {
      right: 0;
      margin-top: -60px;
    }
  }
}

.media-logo-div {
  text-align: center;
}

.media-logo {
  padding: 15px;
}

@media (max-width: 1600px) {
  .content-container {
    .text-container {
      width: 80%;
    }
  }
}

@media (max-width: 1365px) {
  .content-container {
    .heading {
      font-size: 45px;
    }
  }
}

@media (max-width: 1110px) {
  .content-container {
    .sign-up-section {
      .heading {
        margin-top: 40px;
        font-size: 40px;
      }
      .get-started-form {
        input[type="email"] {
          background: #fff;
          border: 1px solid #fff;
          width: 50%;
        }
      }
    }
  }
}

@media (max-width: 1066px) {
  .content-container {
    .text-container {
      width: 90%;
    }
    .heading {
      font-size: 40px;
    }
    .get-started-form {
      width: 90%;
      margin-left: 5%;
      input[type="email"] {
        width: 50.66%;
        font-size: 16px;
      }
      a {
        width: 30%;
        font-size: 18px;
      }
    }
    .get-started-button {
      width: 30%;
      font-size: 18px;
    }
    .blue-bg-row-desktop {
      img {
        width: 110%;
        margin-right: -10%;
        margin-top: 20%;
      }
    }
  }
}

@media (max-width: 991px) {
  .content-container {
    .sign-up-section {
      .heading {
        text-align: center;
        font-size: 40px;
      }
      .get-started-form {
        display: block;
        width: 80%;
        margin: 0 auto;
        input[type="email"] {
          background: #fff;
          border: 1px solid #fff;
          width: 64.66%;
        }
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
    .get-started-form {
      width: 90%;
      margin-left: 5%;
      input[type="email"] {
        width: 50.66%;
        font-size: 14px;
      }
      a {
        width: 30%;
        font-size: 14px;
      }
    }
    .get-started-button {
      width: 30%;
      font-size: 14px;
    }
  }
}

@media (min-width: 768px) {
  .content-container {
    .blue-bg-row-mobile,
    .yellow-bg-row-mobile {
      display: none;
    }
  }
}

@media (max-width: 767px) {
  .content-container {
    .blue-bg-row-desktop,
    .yellow-bg-row-desktop {
      display: none;
    }
    .green-bg-row {
      background: none;
      padding-top: none;
      .green-background {
        background-image: url("../assets/img/bg/green-vector.png");
        background-repeat: no-repeat;
        background-size: 100vw 100%;
        background-position: left;
        padding-top: 250px;
        padding-bottom: 100px;
        margin-top: -280px;
        img {
          width: 70%;
          margin-top: -40px;
        }
      }
    }
    .yellow-bg-row-mobile {
      .yellow-background {
        margin-top: -100px;
        img {
          width: 80%;
          float: right;
        }
      }
    }
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
    .computer-row.blue-bg-row-mobile {
      margin-top: -50px;
      padding-top: 140px;
      .blue-background {
        background-size: contain;
        img {
          width: 95%;
        }
      }
    }
  }
}

@media (max-width: 690px) {
  .content-container {
    .sign-up-section {
      .get-started-form {
        display: block;
        width: 90%;
        margin: 0 auto;
        input[type="email"] {
          background: #fff;
          border: 1px solid #fff;
          width: 60.66%;
        }
      }
    }
  }
}

@media (max-width: 550px) {
  .content-container {
    .green-bg-row {
      .green-background {
        img {
          width: 85%;
          margin-top: -40px;
        }
      }
    }
  }
}

@media (max-width: 414px) {
  .content-container {
    .yellow-bg-row-mobile {
      .yellow-background {
        img {
          width: 95%;
          float: right;
        }
      }
    }
  }
}

@media (max-width: 375px) {
  .content-container {
    .get-started-button {
      width: 40%;
      font-size: 14px;
    }
    .sign-up-section {
      .get-started-form {
        display: block;
        width: 90%;
        margin: 0 auto;
        input[type="email"] {
          background: #fff;
          border: 1px solid #fff;
          width: 50.66%;
        }
        a {
          width: 38%;
        }
      }
    }
  }
}

// media queries for larger screens

@media (min-width: 1500px) and (min-height: 1000px) {
  .content-container {
    .computer-row {
      min-height: 100vh;
    }
    .blue-bg-row-desktop {
      padding-top: 300px;
      .get-started-form {
        width: 70%;
        margin-left: 15%;
      }
    }
    .yellow-bg-row-desktop {
      .text-container {
        margin-top: 50px;
      }
    }
  }
}

@media (min-width: 1400px) {
  .content-container {
    .blue-bg-row-desktop {
      .text-container {
        margin-top: 50px;
      }
      img {
        width: 100%;
        float: right;
        margin-right: -100px;
      }
    }
    .get-started-form {
      width: 80%;
    }
  }
}

@media (min-width: 1900px) and (min-height: 1100px) {
  .content-container {
    .blue-bg-row-desktop {
      .text-container {
        margin-top: 50px;
      }
      .get-started-form {
        width: 70%;
        margin-left: 15%;
      }
    }
    .green-bg-row {
      .text-container {
        margin-top: 150px;
      }
    }
    .yellow-bg-row-desktop {
      .text-container {
        margin-top: 50px;
      }
    }
  }
}

@media (min-width: 2100px) and (min-height: 1200px) {
  .content-container {
    .small {
      font-size: 25px;
    }
    .blue-bg-row-desktop {
      .text-container {
        margin-top: 150px;
      }
      .get-started-form {
        width: 70%;
        margin-left: 15%;
      }
    }
    .green-bg-row {
      .text-container {
        margin-top: 200px;
      }
    }
    .yellow-bg-row-desktop {
      .text-container {
        margin-top: 50px;
      }
    }
  }
}

@media (min-width: 2300px) and (min-height: 1200px) {
  .content-container {
    .wrapper {
      .heading {
        font-size: 65px;
      }
      .small {
        font-size: 28px;
      }
    }
  }
}

@media (min-width: 2500px) and (min-height: 1300px) {
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

