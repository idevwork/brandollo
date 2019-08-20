<template>
  <div class="content-container">
    <div class="row blue-bg-row blue-bg-row-desktop form-row">
      <div class="col-xs-12 col-md-6">
        <div class="form-container">
          <p class="heading">
            Create
            <span class="bold">Your Account</span>
          </p>
          <div class="row first-form-row">
            <div class="col-xs-12 col-md-6 laptop-mobile">
              <img src="../../assets/img/product/laptop-full.png">
            </div>
            <div class="col-xs-12 col-md-6">
              <input
                ref="nameElement"
                v-model="user.firstName"
                type="text"
                class="account-details short-input"
                name="email"
                placeholder="Your First Name"
              >
              <div class="error" v-if="$v.user.firstName.$anyError && !$v.user.firstName.required">
                First
                name is required
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <input
                v-model="user.lastName"
                type="text"
                class="account-details short-input"
                name="email"
                placeholder="Your Last Name"
              >
              <div class="error" v-if="$v.user.lastName.$anyError && !$v.user.lastName.required">
                Last
                name is required
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <input
                v-model="user.companyName"
                type="text"
                class="account-details long-input"
                name="email"
                placeholder="Company Name"
              >
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <input
                v-model="user.email"
                type="email"
                class="account-details long-input"
                name="email"
                placeholder="Email"
              >
              <div class="error" v-if="$v.user.email.$anyError && !$v.user.email.required">
                Email is
                required
              </div>
              <div class="error" v-if="$v.user.email.$anyError && !$v.user.email.email">
                Must be valid
                email address
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <input
                v-model="user.phone"
                type="number"
                class="account-details long-input"
                name="email"
                placeholder="Phone Number"
              >
              <!-- <div class="error" v-if="$v.user.phone.$anyError && !$v.user.phone.required">
              Phone is
              required
              </div>-->
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-6">
              <input
                v-model="user.password"
                type="password"
                class="account-details short-input"
                name="email"
                placeholder="Choose a Password"
              >
              <div class="error" v-if="$v.user.password.$anyError && !$v.user.password.required">
                Password
                is required
              </div>
              <div class="error" v-if="$v.user.password.$anyError && !$v.user.password.minLength">
                Password
                must be at least 8 chars
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <input
                v-model="user.confirmPassword"
                type="password"
                class="account-details short-input"
                name="email"
                placeholder="Confirm Password"
              >
              <div
                class="error"
                v-if="$v.user.confirmPassword.$anyError && !$v.user.confirmPassword.required"
              >
                Password
                is required
              </div>
              <div
                class="error"
                v-if="$v.user.confirmPassword.$anyError && !$v.user.confirmPassword.minLength"
              >
                Password
                must be at least 8 chars
              </div>
              <div
                class="error"
                v-if="$v.user.confirmPassword.$anyError && !$v.user.confirmPassword.sameAsPassword"
              >
                Passwords
                do not match
              </div>
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

          <div class="row">
            <div class="col-xs-12" style="padding-top:10px">
              <span class="account-link">
                If you already have an account click here to
                <router-link :to="loginThenBuyUrl">sign in</router-link>and complete purchase.
              </span>
            </div>
          </div>
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
      
      <featuredBy/>
      
    </div>
  </div>
  <!-- end content container -->
</template>


<script>
import stripeLogo from "../../assets/img/powered_by_stripe.png";
import laptop from "../../assets/img/product/Laptop.png";
import settings from "@/settings";
import CheckoutElement from "@/Common/components/CheckoutElement";
import FeaturedBy from "../../components/FeaturedBy";

import { validationMixin } from "vuelidate";
import {
  required,
  email,
  sameAs,
  minLength,
  numeric
} from "vuelidate/lib/validators";

import { registerUser } from "@/Common/services/ProductService";
import { mapState } from "vuex";

export default {
  name: "Enquire",
  metaInfo: {
    title: "Create an Account"
  },
  props: ["list"],
  components: {
    checkout: CheckoutElement,
    featuredBy: FeaturedBy
  },
  mixins: [validationMixin],
  data() {
    return {
      laptop: laptop,
      stripeLogo: stripeLogo,
      email: "",
      response: {},
      errorMessage: null,
      successMessage: null,
      error: null,
      team: null,
      product: "basic-subscription-3",
      successUrl: "/register/checkout/complete",
      loginUrl: null,

      user: {
        firstName: null,
        lastName: null,
        companyName: null,
        email: null,
        phone: null,
        password: null,
        confirmPassword: null,
        returnUrl: settings.host + "/app/refresh?destination=/app/questions/1"
      }
      // user: {
      //   firstName: "Marco",
      //   lastName: "Muscat",
      //   companyName: null,
      //   email: "marco.muscat@gmail.com",
      //   phone: 32434344,
      //   password: "Qazqaz123!",
      //   confirmPassword: "Qazqaz123!",
      //   returnUrl: settings.host + "/refresh?destination=/questions/1"
      // }
    };
  },
  validations: {
    user: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      email: {
        required,
        email
      },
      // phone: {
      //   required,
      //   numeric
      // },
      password: {
        required,
        minLength: minLength(8)
      },
      confirmPassword: {
        required,
        minLength: minLength(8),
        sameAsPassword: sameAs("password")
      }
    }
  },
  computed: {
    ...mapState({
      signedIn: state => state.userStore.signedIn
    }),
    loginThenBuyUrl() {
      return "/checkout?product=" + this.product;
    }
  },
  created() {
    if (this.signedIn) {
      window.location.url = "/app/actions-list";
      // this.$router.push({
      //   path: `/actions-list`
      // });
    }
    if (this.$route.query.product) {
      this.product = this.$route.query.product;
    }
  },
  mounted() {
    if (this.$route.query.fname) {
      this.user.firstName = this.$route.query.fname;
    }
    if (this.$route.query.lname) {
      this.user.lastName = this.$route.query.lname;
    }
    if (this.$route.query.company) {
      this.user.companyName = this.$route.query.company;
    }
    if (this.$route.query.email) {
      this.user.email = this.$route.query.email;
    }
    if (this.$route.query.phone) {
      this.user.phone = this.$route.query.phone;
    }

    this.$nextTick(() => this.$refs.nameElement.focus());
  },
  methods: {
    process() {
      return new Promise((resolve, reject) => {
        this.error = null;
        this.$v.$touch();
        if (this.$v.$invalid) {
          reject();
        } else {
          registerUser(this.user).then(
            result => {
              this.loginUrl = result.loginUrl;
              resolve(result);
            },
            e => {
              e.forEach(error => {
                this.error = this.error
                  ? this.error + " " + error.description
                  : error.description;

                if (error.code == "DuplicateUserName") {
                  this.error =
                    this.error +
                    " If this is your account. Please sign in to purchase subscription";
                }
              });
              reject();
            }
          );
        }
      });
    },
    postProcess() {
      if (this.loginUrl) {
        window.location = this.loginUrl;
      }
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
