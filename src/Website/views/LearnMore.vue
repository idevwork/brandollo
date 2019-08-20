<template>
  <div class="wrapper">
    <div class="content-container">
      <div class="row blue-bg-row blue-bg-row-desktop">
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <h1 class="heading" v-html="content.about.title"></h1>
            <p class="small" v-html="content.about.paragraph"></p>
            <router-link
              title="Learn more"
              to="/pricing"
              class="get-started-button"
              v-html="content.button1"
            ></router-link>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <img src="../assets/img/product/about-mac.png" />
        </div>
      </div>

      <div class="row blue-bg-row blue-bg-row-mobile">
        <div class="col-xs-12 col-sm-6">
          <img src="../assets/img/product/about-mac.png" />
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.about.title"></p>
            <p class="small" v-html="content.about.paragraph"></p>
            <router-link
              title="Learn more"
              to="/pricing"
              class="get-started-button"
              v-html="content.button1"
            ></router-link>
          </div>
        </div>
      </div>

      <div class="row green-bg-row">
        <div class="col-xs-12 col-sm-6">
          <img src="../assets/img/about-photo-1.png" />
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.team.title"></p>
            <p class="small" v-html="content.team.paragraph"></p>
            <router-link
              title="Learn more"
              to="/pricing"
              class="get-started-button"
              v-html="content.button1"
            ></router-link>
          </div>
        </div>
      </div>

      <div class="row no-bg-row">
        <div class="col-xs-12 col-sm-8">
          <div class="text-container">
            <p class="heading" v-html="content.faq.title">Frequently asked questions</p>
            <p class="small">
              <span v-for="(question, i) in content.faq.questions" :key="i">
                <span class="bold" v-html="question.title"></span>
                <br />
                <span v-html="question.paragraph"></span>
                <br />
                <br />
              </span>
            </p>
            <router-link title="Learn more" to="/pricing" class="get-started-button">Start Now</router-link>
          </div>
        </div>
      </div>

      <div class="row work-with-us-row work-with-us-row-desktop">
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.jobs.title"></p>
            <p class="small" v-html="content.jobs.paragraph"></p>
            <a
              target="_blank"
              class="get-started-button"
              href="https://angel.co/brandollo/jobs"
              v-html="content.jobs.button"
            ></a>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <img src="../assets/img/about-photo-2.png" />
        </div>
      </div>

      <div class="row work-with-us-row work-with-us-row-mobile">
        <div class="col-xs-12 col-sm-6">
          <img src="../assets/img/about-photo-2.png" />
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="text-container">
            <p class="heading" v-html="content.jobs.title"></p>
            <p class="small" v-html="content.jobs.paragraph"></p>
            <a
              target="_blank"
              class="get-started-button"
              href="https://angel.co/brandollo/jobs"
              v-html="content.jobs.button"
            ></a>
          </div>
        </div>
      </div>
    </div>
    <!-- end content container -->
  </div>
  <!-- end wrapper -->
</template>
<script>
import content from "@/Website/copy/LearnMore";

export default {
  name: "Learn-More",
  metaInfo: {
    title: "Learn more"
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
  width: 100vw;
  overflow: hidden;
  .heading {
    // text-align: justify;
    line-height: 1.2;
    font-family: "Montserrat", sans-serif;
    font-weight: 200;
    color: #2f2f2f;
    font-size: 40px;
    margin: 40px 0 40px 0;
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
    .bold {
      font-weight: 700;
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
  .text-container {
    width: 70%;
    margin: 0 auto;
  }
  .blue-bg-row {
    background-image: url("../assets/img/bg/blue-about-bg.png");
    background-size: 70vw auto;
    background-repeat: no-repeat;
    background-position: top right;
    padding-top: 80px;
    padding-bottom: 80px;
    .small {
      margin-top: 40px;
    }
    .get-started-button {
      margin-top: 40px;
    }
    img {
      width: 100%;
      display: block;
      margin: -60px auto 0 auto;
    }
  }
  .green-bg-row {
    background-image: url("../assets/img/bg/green-about-bg.png");
    background-size: 50vw auto;
    background-repeat: no-repeat;
    background-position: top left;
    padding-bottom: 100px;
    .text-container {
      margin-top: 140px;
    }
    .small {
      margin-top: 40px;
    }
    .get-started-button {
      margin-top: 40px;
    }
    img {
      width: 80%;
      display: block;
      float: right;
      margin-top: 220px;
    }
  }
  .no-bg-row {
    padding-top: 60px;
  }
  .work-with-us-row {
    padding-top: 100px;
    padding-bottom: 100px;
    img {
      width: 100%;
      float: right;
      margin-top: -120px;
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

@media (max-width: 1250px) {
  .content-container {
    .blue-bg-row {
      img {
        margin: 20px auto 0 auto;
      }
    }
  }
}

@media (max-width: 1250px) {
  .content-container {
    .green-bg-row {
      margin-top: 80px;
      .text-container {
        margin-top: -40px;
      }
      img {
        width: 95%;
        margin-top: 120px;
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

@media (max-width: 910px) {
  .content-container {
    .blue-bg-row {
      img {
        margin: 100px auto 0 auto;
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
    .work-with-us-row-mobile {
      display: none;
    }
  }
}

@media (max-width: 767px) {
  .content-container {
    .blue-bg-row-desktop,
    .work-with-us-row-desktop {
      display: none;
    }
    .blue-bg-row {
      background-size: 100vw;
      margin-top: 50px;
      .text-container {
        margin-top: -40px;
      }
      img {
        margin-top: -80px;
      }
    }
    .green-bg-row {
      background-size: 90vw;
      margin-top: -20px;
      img {
        width: 90%;
        min-width: 290px;
        float: none;
        margin: 0 auto;
        margin-top: 180px;
      }
      .text-container {
        margin-top: 200px;
      }
    }
    .no-bg-row {
      margin-top: -80px;
      margin-bottom: 40px;
      .get-started-button {
        margin-top: 40px;
      }
    }
  }
}

@media (max-width: 600px) {
  .content-container {
    .green-bg-row {
      img {
        margin-top: 120px;
      }
    }
  }
}

@media (max-width: 450px) {
  .content-container {
    .green-bg-row {
      img {
        margin-top: 90px;
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
  }
}

// larger screens

@media (min-width: 1450px) {
  .content-container {
    .green-bg-row {
      padding-bottom: 200px;
      background-size: contain;
    }
    .work-with-us-row {
      padding-top: 160px;
      .text-container {
        padding-top: 100px;
      }
    }
  }
}

@media (min-width: 1600px) and (min-height: 700px) {
  .content-container {
    .text-container {
      margin-top: 100px;
    }
  }
}

@media (min-width: 2000px) and (min-height: 1000px) {
  .content-container {
    .text-container {
      margin-top: 120px;
    }
    .small {
      font-size: 25px;
    }
  }
}

@media (min-width: 2300px) and (min-height: 1200px) {
  .content-container {
    .text-container {
      margin-top: 190px;
    }
    .heading {
      font-size: 65px;
    }
    .small {
      font-size: 28px;
    }
  }
}

@media (min-width: 2500px) and (min-height: 1200px) {
  .content-container {
    .text-container {
      margin-top: 100px;
    }
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
