<template>
  <div class="content-container">
    <div class="row blue-bg-row">
      <div class="col-xs-12">
        <div class="text-container">
          <h3>Oh no! Your account has expired, but fear not you can enable it again. Simply choose the size of your team and follow the instructions</h3>
          <p class="small">
            Get instant access to customised marketing plans and support for your business.
            You will also get access to marketing video tutorials, branding advice and powerful workflow tools.
            Book a free demo and see how Brandollo can help your business.
          </p>
        </div>
      </div>
    </div>
    <div class="pricing-table pricing-table-desktop">
      <div class="row blue-row top-row">
        <div class="col-xs-12 col-sm-3 col-sm-offset-3">
          <p class="table-heading">For Small Business</p>
          <p class="table-description">Better Small Business Marketing</p>
        </div>
        <div class="col-xs-12 col-sm-3">
          <p class="table-heading">Team Marketing</p>
          <p class="table-description">Work Together On Marketing Goals</p>
        </div>
      </div>
      <div class="row white-row price-row">
        <div class="col-xs-12 col-sm-3 left">
          <p class="row-heading">Monthly price</p>
        </div>

        <div class="col-xs-12 col-sm-3">
          <p class="price">
            <span>$</span>49
          </p>
        </div>
        <div class="col-xs-12 col-sm-3">
          <p class="price">
            <span>$</span>89
          </p>
        </div>
        <div class="col-xs-12 col-sm-3"></div>
      </div>
      <div class="row blue-row">
        <div class="col-xs-12 col-sm-3 left">
          <p class="row-heading">Team size</p>
        </div>

        <div class="col-xs-12 col-sm-3">
          <p class="users-text">1-2 users</p>
        </div>
        <div class="col-xs-12 col-sm-3">
          <p class="users-text">3-6 users</p>
        </div>
      </div>
      <div class="row white-row button-row">
        <div class="col-xs-12 col-sm-3 left">
          <p class="row-heading"></p>
        </div>

        <div class="col-xs-12 col-sm-3">
          <router-link title="Buy" :to="checkoutUrl" class="buy-now-button">{{buttonText}}</router-link>
        </div>
        <div class="col-xs-12 col-sm-3">
          <router-link title="Buy" :to="checkoutUrlLarge" class="buy-now-button">{{buttonText}}</router-link>
        </div>
      </div>

      <div class="row white-row last-table-row">
        <div class="col-xs-12">
          <p>*All prices excluding GST</p>
        </div>
      </div>
    </div>

    <div class="pricing-table pricing-table-mobile">
      <div class="row blue-row top-row">
        <div class="col-xs-12">
          <p class="table-heading">For Small Business</p>
          <p class="table-description">Better Small Business Marketing</p>
        </div>
      </div>
      <div class="row white-row price-row">
        <div class="col-xs-6 left">
          <p class="row-heading">Monthly price</p>
        </div>
        <div class="col-xs-6">
          <p class="price">
            <span>$</span>49
          </p>
        </div>
      </div>
      <div class="row blue-row">
        <div class="col-xs-6 left">
          <p class="row-heading">Number of users</p>
        </div>
        <div class="col-xs-6">
          <p class="users-text">1-2 users</p>
        </div>
      </div>
      <div class="row white-row button-row">
        <div class="col-xs-6 left">
          <p class="row-heading"></p>
        </div>
        <div class="col-xs-12">
          <router-link title="Buy" :to="checkoutUrl" class="buy-now-button">{{buttonText}}</router-link>
        </div>
      </div>

      <div class="row white-row button-row button-row-2">
        <div class="col-xs-6 left">
          <p class="row-heading"></p>
        </div>
        <div class="col-xs-12">
          <router-link title="Buy" :to="checkoutUrl" class="buy-now-button">{{buttonText}}</router-link>
        </div>
      </div>
    </div>

    <div class="pricing-table pricing-table-mobile">
      <div class="row blue-row top-row">
        <div class="col-xs-12">
          <p class="table-heading">Team Marketing</p>
          <p class="table-description">Work Together On Marketing Goals</p>
        </div>
      </div>
      <div class="row white-row price-row">
        <div class="col-xs-6 left">
          <p class="row-heading">Monthly price</p>
        </div>
        <div class="col-xs-6">
          <p class="price">
            <span>$</span>89
          </p>
        </div>
      </div>
      <div class="row blue-row">
        <div class="col-xs-6 left">
          <p class="row-heading">Team size</p>
        </div>
        <div class="col-xs-6">
          <p class="users-text">3-6 users</p>
        </div>
      </div>
      <div class="row white-row button-row">
        <div class="col-xs-6 left">
          <p class="row-heading"></p>
        </div>
        <div class="col-xs-12">
          <router-link title="Buy" :to="checkoutUrl" class="buy-now-button">{{buttonText}}</router-link>
        </div>
      </div>

      <div class="row white-row button-row button-row-2">
        <div class="col-xs-6 left">
          <p class="row-heading"></p>
        </div>
        <div class="col-xs-12">
          <router-link title="Buy" :to="checkoutUrl" class="buy-now-button">{{buttonText}}</router-link>
        </div>
      </div>
    </div>
  </div>
  <!-- end content container -->
</template>




<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "checkout-essentials",
  metaInfo: {
    title: "Almost there"
  },
  props: ["team"],
  data() {
    return {
      ready: false
    };
  },
  computed: {
    ...mapState({
      allowTrial: s => s.teamStore.currentTeam.allowTrial
    }),
    successUrl: function() {
      return `/app/actions-list`;
    },
    ...mapGetters({
      hasPlan: "isPremium"
    }),
    buttonText(){
      return this.allowTrial ? "Start Trial" : "Buy Now"
    },
    checkoutUrl() {
      if(this.allowTrial){
      return `/${this.team}/checkout?product=basic-subscription-trial`;  
      }
      return `/${this.team}/checkout?product=basic-subscription-3`;
    },
    checkoutUrlLarge() {
      if(this.allowTrial){
        return `/${this.team}/checkout?product=basic-subscription-trial`;
      }
      return `/${this.team}/checkout?product=basic-subscription-6`;
    }
  },
  mounted() {
    let that = this;

    if (that.hasPlan) {
      that
        .$swal({
          title: "You already are a business essentials user",
          text: "Click below to go back to your reccomendations",
          confirmButtonText: "Take me there",
          type: "info",
          confirmButtonClass: "btn btn-confirm mt-2"
        })
        .then(() => {
          window.location.href = "/app/actions-list";
          // that.$router.push({
          //   name: "actions-list"
          // });
        });
    }
  }
};
</script>


<style lang="scss" scoped>
.content-container {
  width: 100vw;
  overflow: hidden;
  .small {
    font-family: "Lato", sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 29px;
    color: #2a2a2a;
    margin-top: 40px;
  }
  .text-container {
    width: 70%;
    margin: 0 auto;
  }
  .blue-bg-row {
    background-image: url("../../assets/img/bg/pricing-blue-bg.png");
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 100vw;
    padding: 110px 0 450px 0;
    min-height: 500px;
  }
  h3 {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    text-transform: uppercase;
    color: #2f2f2f;
  }
  .outline-button {
    font-family: "Lato", sans-serif;
    text-decoration: none;
    font-weight: 500;
    font-size: 22px;
    line-height: normal;
    text-align: center;
    color: #2f2f2f;
    display: block;
    border: 2px solid #626262;
    box-sizing: border-box;
    border-radius: 7px;
    height: 64px;
    line-height: 64px;
    width: 345px;
    margin-top: 80px;
  }
  .blue-row {
    background: #f5fcfd;
  }
  .white-row {
    background: #fff;
  }
  .pricing-table {
    width: 90%;
    border: none;
    margin: 0 auto;
    max-width: 1410px;
    text-align: center;
    // box-shadow: 40px 40px 40px 40px #DEDEDE;
    -webkit-box-shadow: 10px 10px 63px -21px rgba(0, 0, 0, 1);
    -moz-box-shadow: 10px 10px 63px -21px rgba(0, 0, 0, 1);
    box-shadow: 10px 10px 63px -21px rgba(0, 0, 0, 1);
    margin-bottom: 110px;
    margin-top: -270px;
    img {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      z-index: 0;
    }
    .left {
      text-align: left;
    }
    .price-row {
      height: 102px;
      .row-heading {
        line-height: 60px;
      }
    }
    .price {
      font-family: "Montserrat", sans-serif;
      font-weight: 600;
      font-size: 56px;
      letter-spacing: -0.03em;
      color: #00c0e8;
      opacity: 0.5;
      margin-top: 20px;
      span {
        font-weight: 300;
        font-size: 26px;
        display: block;
        margin-left: -85px;
        margin-bottom: -40px;
      }
    }
  }
  .table-heading {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 21px;
    line-height: 29px;
    text-align: center;
    color: #2f2f2f;
    padding-top: 10px;
  }
  .table-description {
    font-family: "Lato", sans-serif;
    font-weight: 300;
    font-size: 14px;
    line-height: normal;
    text-align: center;
    letter-spacing: 0.04em;
    color: #2f2f2f;
    margin-top: -15px;
  }
  .row-heading {
    font-family: "Lato", sans-serif;
    font-weight: 300;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0.04em;
    color: #2a2a2a;
    padding-left: 44px;
    &.bold {
      font-weight: 700;
      padding-left: 30px;
      font-size: 17px;
    }
  }
  .top-row {
    border-radius: 20px 20px 0px 0px;
    margin-top: -100px;
    height: 126px;
  }
  .button-row {
    height: 132px;
    .outline-button {
      display: block;
      width: 85%;
      margin: 0 auto;
      margin-top: 35px;
    }
  }
  .button-row-2 {
    height: 180px;
    border-radius: 0 0 20px 20px;
  }
  .pricing-table-desktop {
    .button-row-2 {
      border-radius: 0;
    }
  }
  .last-table-row {
    border-radius: 0 0 20px 20px;
    height: auto;
    padding-bottom: 20px;
    p {
      font-family: "Lato", sans-serif;
      font-weight: 300;
      font-size: 15px;
      color: #2a2a2a;
    }
  }
  .bottom-row {
    width: 90%;
    max-width: 1410px;
    min-width: 290px;
    margin: 0 auto;
    padding-bottom: 110px;
    .outline-button {
      margin-top: 0px;
      margin-left: 25px;
    }
  }
  .users-text {
    font-family: "Lato", sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 19px;
    letter-spacing: 0.04em;
    color: #2a2a2a;
  }
  .buy-now-button {
    display: block;
    background: linear-gradient(74.83deg, #e0234e -2.08%, #f84a4f 103.33%);
    box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.21);
    color: #fff;
    font-family: "Lato", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    border-radius: 7px;
    height: 64px;
    line-height: 64px;
    text-decoration: none;
    text-align: center;
    margin-top: 80px;
    display: block;
    width: 85%;
    margin: 0 auto;
    margin-top: 35px;
    transition: 0.2s;
    &:hover {
      box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.51);
      transition: 0.2s;
    }
  }
}

@media (max-width: 1370px) {
  .content-container {
    .pricing-table {
      .row-heading {
        font-size: 13px;
        padding-left: 20px;
        &.bold {
          padding-left: 10px;
          font-size: 15px;
        }
      }
    }
  }
}

@media (max-width: 1070px) {
  .content-container {
    .pricing-table {
      width: 95%;
      // .marketing-row {
      //   height: 66px;
      // }
      // .row-heading {
      //   font-size: 11px;
      //   padding-left: 10px;
      // }
      .users-text {
        font-size: 12px;
      }
      .buy-now-button,
      .outline-button {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }
    .blue-bg-row {
      padding-bottom: 350px;
    }
  }
}

@media (max-width: 950px) {
  .content-container {
    .blue-bg-row {
      background-size: 150%;
      padding-bottom: 450px;
      // margin-bottom: 150px;
    }
  }
}

@media (min-width: 768px) and (max-width: 900px) {
  .content-container {
    .outline-button {
      width: 280px;
    }
  }
}

@media (min-width: 768px) {
  .content-container {
    .pricing-table-mobile {
      display: none;
    }
  }
}

@media (max-width: 767px) {
  .content-container {
    .outline-button {
      margin: 40px auto 0 auto;
    }
    .bottom-row {
      text-align: center;
      .outline-button {
        margin: 20px auto;
      }
    }
    .pricing-table-desktop {
      display: none;
    }
    .pricing-table-mobile {
      margin-top: 160px;
      .blue-row,
      .white-row {
        height: auto;
        min-height: 44px;
        padding: 2px 0;
      }
      .button-row {
        .buy-now-button {
          margin-top: 10px;
          margin-bottom: 20px;
        }
      }
      .button-row-2 {
        padding-bottom: 60px;
      }
    }
    .blue-bg-row {
      background-size: 250%;
      padding-bottom: 550px;
    }
    .pricing-table-mobile-1 {
      margin-top: -300px;
    }
  }
}

@media (max-width: 600px) {
  .content-container {
    .blue-bg-row {
      background-size: 250%;
      padding-bottom: 500px;
    }
    .pricing-table-mobile-1 {
      margin-top: -250px;
    }
  }
}

@media (max-width: 500px) {
  .content-container {
    .outline-button {
      width: 280px;
    }
    .blue-bg-row {
      padding-bottom: 400px;
    }
    .pricing-table-mobile-1 {
      margin-top: -150px;
    }
  }
}

@media (max-width: 375px) {
  .content-container {
    .blue-bg-row {
      padding-bottom: 350px;
    }
    .pricing-table-mobile-1 {
      margin-top: -50px;
    }
  }
}

// larger screens
@media (min-width: 1500px) {
  .content-container {
    .row-heading {
      font-size: 16px;
    }
  }
}
</style>
