<template>
  <div class="content-container">
    <header class="header">
      <div id="primary" class="boxed-layout-header page-header header-small">
        <div class="container">
          <div class="row">
            <div class="col-md-10 col-md-offset-1 text-center">
              <h1 class="hestia-title">Marketing Agency Software With Brandollo</h1>
            </div>
          </div>
        </div>

        <div data-parallax="active" class="header-filter"></div>
      </div>
    </header>
    <div class="main main-raised">
      <div class="blog-post">
        <div class="container">
          <article class="section section-text">
            <div class="row">
              <div class="col-md-8 col-md-offset-2 page-content-wrap">
                <p>
                  <img
                    :src="mainImg"
                    alt="Startup Marketing"
                    width="666"
                    height="431"
                    class="aligncenter"
                  >
                </p>
                <h3></h3>
                <h3>
                  <strong>Great marketing software is a critical element in marketing agency and consultant success…</strong>
                </h3>
                <p>&nbsp;</p>
                <p>
                  <a href="http://www.brandollo.com/">Brandollo</a>
                  <span>&nbsp;</span>is a marketing platform that helps marketing agencies to be even more effective at planning form and managing their clients, even on a limited budget.
                </p>
                <p>&nbsp;</p>
                <p style="text-align: center;">
                  <strong>How does it work?</strong>
                </p>
                <p>Brandollo is easy to use and affordable. The platform uses machine learning to support your marketing planning, helping you to make the best recommendations and design the most effective strategies for your clients.</p>
                <p>Brandollo delivers:</p>
                <ul>
                  <li>Drag & Drop planning features, making it easier for you to create great plans, fast</li>
                  <li>Shared timelines and discussion threads to streamline your work</li>
                  <li>An array of powerful micro-learning videos to upskill marketing agency staff</li>
                  <li>Intuitive workflow tools to organise and share your marketing tasks with team members and freelancers</li>
                </ul>
                <p>Brandollo is the marketing platform for marketing agencies and their teams - designed to deliver real marketing results at a price you can afford.</p>
                <p>To learn more about how Brandollo can help your marketing agency simply click below to try the platform!</p>
                <br>
              <router-link to="/Enquire?list=beta" class="get-started-button">SEND MY INVITATION</router-link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mainImg from "../assets/img/for-startup-img.png";

export default {
  name: "Learn-More",
  metaInfo: {
    title: "for Marketing Agency"
  },
  data() {
    return {
      mainImg: mainImg
    };
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
</style>
