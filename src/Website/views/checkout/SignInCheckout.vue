<template>
  <div class="content-container">
    <div class="row blue-bg-row blue-bg-row-desktop form-row">
      <div class="col-xs-12 col-md-6">
        <div class="form-container">
          <p class="heading">
            Hey
            <span class="bold">{{username}}</span> let's upgrade your account!
          </p>
          <div class="row first-form-row">
            <div class="col-xs-12 col-md-6 laptop-mobile">
              <img src="../../assets/img/product/laptop-full.png">
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12">
              <span class="error" v-if="error">{{error}}</span>
            </div>
          </div>

          <checkout
            :teamId="team"
            :startProduct="product"
            :successUrl="successUrl"
            :pre="process"
            :post="postProcess"
          ></checkout>
        </div>
      </div>
      <div class="col-xs-12 col-md-6 laptop-desktop">
        <img src="../../assets/img/product/laptop-full.png">
        <img
          class="stripe-logo"
          src="../../assets/img/powered_by_stripe.png"
          alt="powered by stripe"
        >
      </div>
    </div>
    <complete-modal ref="purchaseModal" type="upgrade-complete" :redirect="destination"/>
  </div>
</template>

<script>
import settings from "@/settings";
import CheckoutElement from "@/Common/components/CheckoutElement";
import CompleteModal from "@/Website/components/modals/PurchaseCompleteModal";

import { validationMixin } from "vuelidate";
import {
  required,
  email,
  sameAs,
  minLength,
  numeric
} from "vuelidate/lib/validators";

import { registerUser } from "@/Common/services/ProductService";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Enquire",
  metaInfo: {
    title: "Create an Account"
  },
  props: ["list", "team"],
  components: {
    checkout: CheckoutElement,
    CompleteModal
  },
  mixins: [validationMixin],
  data() {
    return {
      mode: "signup",
      email: "",
      response: {},
      errorMessage: null,
      successMessage: null,
      error: null,
      product: "basic-subscription-3",
      successUrl: "/register/checkout/complete",
      // loginUrl:  `${settings.host}/app/refresh?destination=/${this.team}/questions/1`
      loginUrl: `${settings.host}/app/${this.team}/questions/1`,
      renewUrl: `${settings.host}/app/${this.team}/actions-list`
    };
  },
  computed: {
    ...mapState({
      signedIn: state => state.userStore.signedIn,
      susr: state => state.userStore.user
    }),
    ...mapGetters({
      username: "username",
      isPremium: "isPremium",
      isTrial: "isTrial",
      isFree: "isFree"
    }),
    destination() {
      if (this.$route.query.redirect) {
        return decodeURI(this.$route.query.redirect);
      }
      if (this.mode == "renew") {
        return this.renewUrl;
      } else {
        return this.loginUrl;
      }
    }
  },
  created() {
    if (this.$route.query.product) {
      this.product = this.$route.query.product;
    }
    if (this.$route.query.mode) {
      this.mode = this.$route.query.mode;
    }
  },
  mounted() {
    this.checkPlanStatus();
  },
  methods: {
    process() {
      return new Promise((resolve, reject) => {
        this.error = null;
        resolve({ userId: this.susr.profile.sub, teamId: this.team });
      });
    },
    postProcess() {
      this.$refs.purchaseModal.show(); 
    },
    checkPlanStatus() {
      let that = this;
      if (that.isPremium && !that.isTrial) {
        that
          .$swal({
            title: "You're already on this subscription",
            text: "Click below to go back to your dashboard",
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
  },
  watch: {
    isPremium() {
      this.checkPlanStatus();
    }
  }
};
</script>

<style lang="scss" scoped>
.error {
  background-color: transparent;
  border: none;
  display: block;
  width: 100%;
  font-size: 18px;
  color: #e91e63;
}

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
  .blue-bg-row {
    background-image: url("../../assets/img/bg/blue-about-bg.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top right;
    padding-top: 80px;
    padding-bottom: 100px;
    img {
      width: 100%;
      float: right;
      margin-top: 170px;
    }
    .stripe-logo {
      width: 100px;
      margin: 0;
      align-items: left;
      margin-right: 55px;
    }
  }
  .form-row {
    margin: 0 auto;
    input {
      border: 1px solid #f1f1f1;
      height: 60px;
      background: #f1f1f1;
      border-radius: 3px;
      font-family: "Lato", sans-serif;
      font-weight: 300;
      font-size: 19px;
      line-height: 31px;
      letter-spacing: 0.04em;
      color: #2a2a2a;
      margin-top: 15px;
    }
    .short-input {
      width: 90%;
      padding-left: 10%;
    }
    .long-input {
      width: 95%;
      padding-left: 5%;
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
  .form-container {
    width: 90%;
    margin: 0 auto;
  }
  .first-form-row {
    margin-top: -20px;
  }
  .account-link {
    font-family: "Lato";
    font-weight: 500;
    font-size: 19px;
    line-height: 31px;
    letter-spacing: 0.04em;
    color: #000000;
    a {
      color: #f3414f;
      text-decoration: none;
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
    width: 50%;
    border-radius: 7px;
    height: 64px;
    line-height: 64px;
    text-decoration: none;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 60px;
    transition: 0.2s;
    &:hover {
      box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.51);
      transition: 0.2s;
    }
  }
}

@media (max-width: 1066px) {
  .content-container {
    .get-started-button {
      width: 50%;
      font-size: 18px;
    }
  }
}

@media (max-width: 991px) {
  .content-container {
    .form-row {
      .short-input,
      .long-input {
        width: 95%;
        padding-left: 5%;
      }
    }
  }
}

@media (max-width: 910px) {
  .content-container {
    .get-started-button {
      width: 50%;
      font-size: 14px;
    }
  }
}

@media (min-width: 1024px) {
  .content-container {
    .laptop-mobile {
      display: none;
    }
  }
}

@media (max-width: 1023px) {
  .content-container {
    .laptop-desktop {
      display: none;
    }
    .blue-bg-row {
      .heading {
        text-align: center;
      }
      img {
        width: 80%;
        display: block;
        margin: 0 auto;
        float: none;
        margin-top: 0px;
        margin-bottom: 40px;
        min-width: 290px;
      }
    }
  }
}

@media (max-width: 767px) {
  .content-container {
    .blue-bg-row-mobile {
      img {
        margin-top: 60px;
      }
    }
  }
}
</style>