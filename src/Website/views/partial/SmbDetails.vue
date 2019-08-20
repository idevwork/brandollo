<template>
  <div>
    <div class="content-container">
      <div class="row no-bg-row-1">
        <div class="col-xs-12 col-sm-6">
          <img
            :alt="content.imageAlt3" 
            src="../../assets/gifs/Timeline-preview.gif">
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.title3"></p>
            <p
              class="small"
              v-html="content.body3"
            ></p>
            <router-link 
              title="Learn more" 
              to="/pricing" 
              class="get-started-button"
              v-html="content.button3"
            ></router-link>
          </div>
        </div>
      </div>

      <div class="row no-bg-row-2 no-bg-row-2-desktop">
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.title4"></p>
            <p
              class="small"
              v-html="content.body4"
            ></p>
            <router-link 
              title="Learn more" 
              to="/pricing" 
              class="get-started-button"
              v-html="content.button4"
            ></router-link>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <img 
            src="../../assets/gifs/Plan-complete.gif"
            :alt="content.imageAlt4">
        </div>
      </div>

      <div class="row no-bg-row-2 no-bg-row-2-mobile">
        <div class="col-xs-12 col-sm-6">
          <img src="../../assets/gifs/Plan-complete.gif">
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p 
              class="heading"
              v-html="content.title4"
            ></p>
            <p
              class="small"
              v-html="content.body4"
            ></p>
            <router-link 
              title="Learn more" 
              to="/pricing" 
              class="get-started-button"
              v-html="content.button4">Get Started</router-link>
          </div>
        </div>
      </div>

      <div class="row green-bg-row">
        <div class="col-xs-12 col-sm-6">
          <img 
            src="../../assets/gifs/Add-team.gif"
            :alt="content.imageAlt5">
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.title5">
              Manage
              <span class="bold">projects & people</span> with shared workflow tools
            </p>
            <p
              class="small"
              v-html="content.body5"
            >Manage marketing tasks and activities with powerful workflow tools. Share projects, set deadlines, comment and even manage freelancers and consultants.</p>
            <router-link title="Learn more" to="/pricing" class="get-started-button" v-html="content.button5">Get Started</router-link>
          </div>
        </div>
      </div>

      <div class="row yellow-bg-row yellow-bg-row-desktop">
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.title6"></p>
            <p
              class="small"
              v-html="content.body6"
            ></p>
            <router-link title="Learn more" to="/pricing" class="get-started-button" v-html="content.button6"></router-link>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <img 
            src="../../assets/gifs/Plan-Picker.gif"
            :alt="content.imageAlt6">
        </div>
      </div>

      <div class="row yellow-bg-row yellow-bg-row-mobile">
        <div class="col-xs-12 col-sm-6">
          <img 
            src="../../assets/gifs/Plan-Picker.gif"
            :alt="content.imageAlt6">
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.title6"></p>
            <p
              class="small"
              v-html="content.body6"
            ></p>
            <router-link title="Learn more" to="/pricing" class="get-started-button" v-html="content.button6"></router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- end content container -->
  </div>
</template>


<script>
import settings from "@/settings";
import content from "@/Website/copy/SmallBusinessLanding"

export default {
  name: "Product-Sections",
  components: {},

  data() {
    return {
      content,
    };
  },
  computed: {},
  mounted: function() {}
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
  .no-bg-row-1 {
    img {
      width: 70%;
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
    background-image: url("../../assets/img/bg/green-vector-bg.png");
    background-size: 105vw;
    background-repeat: no-repeat;
    background-position: top right;
    padding-top: 410px;
    padding-bottom: 100px;
    margin-top: -300px;
    img {
      width: 90%;
      padding-left: 10%;
      margin-top: 30px;
    }
  }
  .yellow-bg-row {
    background-image: url("../../assets/img/bg/yellow-vector-bg.png");
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
    .text-container {
      padding-top: 40px;
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
    .no-bg-row-1 {
      img {
        margin-top: 50px;
      }
    }
    .green-bg-row {
      img {
        margin-top: 60px;
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

@media (max-width: 950px) {
  .content-container {
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
  .no-bg-row-2-mobile,
  .yellow-bg-row-mobile {
    display: none;
  }
}

@media (max-width: 767px) {
  .no-bg-row-2-desktop,
  .yellow-bg-row-desktop {
    display: none;
  }
  .no-bg-row-2-mobile,
  .yellow-bg-row-mobile {
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
