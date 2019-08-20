<template>
  <div>

    <!-- <div id="example-card">

    </div> -->
    <div v-if="product.price > 0" class="row">
      <div class="col-xs-12">
        <div ref="card" class="card-container" style="margin-top:20px"></div>
      </div>
    </div>

    <div v-if="product.price > 0" class="row">
      <div class="col-xs-12">
        <a v-if="!showCouponBox" class="coupon-link" @click="couponBox">Apply coupon</a>
        <div v-else>
          <input type="text" class="account-details" placeholder="Coupon" v-model="coupon">
          <a class="coupon-link" @click="getCoupon">Apply coupon</a>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 product-details heading-small">
        <span class="name bold">{{product.name}}</span>
        <br>
        <span class="details" v-if="product.trialDays > 0 ">
          {{product.trialDays}} day free Trial
          <br>
        </span>
        <span class="details" v-if="product.price > 0">
          <span class="price bold pink">{{product.price / 100}}{{product.currency}} </span>
          <span v-if="product.price != 0">ex GST </span>
          <span v-if="product.type == 'Subscription'">
            <span v-if="product.planDays / 30 > 1"> for {{product.planDays / 30}} months</span>
            <span v-else>per month</span>
            <span v-if="product.trialDays > 0 ">after trial ends</span>
          </span>
        </span>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12">
        <span class="error" v-if="error">{{error}}</span>
      </div>
    </div>


    <div class="row">
      <div class="col-xs-12 text-center checkout-button">
        <!-- <button :disabled="!ready" @click="checkout">{{ready? buttonLabel: 'Processing'}}</button> -->
        <button class="get-started-button" :disabled="!ready" @click="checkout">{{ready? buttonLabel: 'Processing..'}}</button>
      </div>
    </div>
  </div>
</template>


<script>
import loadingAnimation from "@/Website/assets/loading.svg";
import productService from "@/Common/services/ProductService";
import { mapState, mapActions, mapGetters } from "vuex";

import settings from "@/settings";
let stripe = Stripe(settings.stripePK),
  elements = stripe.elements(),
  card = undefined;

export default {
  name: "Checkout",
  props: {
    teamId: {},
    startProduct: {},
    resourceId: {},
    successUrl: {},
    lite: {},
    buttonText: {
      default: "BUY NOW"
    },
    pre: { default: null },
    post: { default: null }
  },

  data() {
    return {
      ready: false,
      loadingAnimation: loadingAnimation,

      coupon: null,
      showCouponBox: false,
      error: null,
      product: {
        label: null,
        currency: null,
        price: 1
      },
      userToProcess: null
    };
  },
  computed: {
    buttonLabel() {
      return this.product.price == 0
        ? "Let's Go"
        : this.product.trialDays > 0
        ? "Start Trial"
        : "Buy Now";
    }
  },
  mounted: function() {
    this.getProduct(this.startProduct);
    this.loadStripe();
  },
  beforeDestroy() {
    card.unmount();
    card.destroy();
  },
  methods: {
    ...mapActions({
      signIn: "signIn"
    }),
    loadStripe() {
      // if (!card) {
      card = elements.create("card", {
        style: {
          base: {
            iconColor: '#2A2A2A',
            color: '#2A2A2A',
            fontWeight: 300,
            fontFamily: 'Lato, Open Sans, Segoe UI, sans-serif',
            fontSize: '19px',
            // fontSmoothing: 'antialiased',
            // background: '#f1f1f1',
            '::placeholder': {
              color: '#2A2A2A',
              fontSize: '19px',
            },
          },
          invalid: {
            // All of the error styles go inside of here.
          }
        }
      });
      card.mount(this.$refs.card);
      // card.mount('#example-card');
      // }
      // registerElements([card], 'example1');
    },














    couponBox() {
      this.showCouponBox = true;
    },
    getCoupon() {
      this.getProduct(this.startProduct, this.coupon);
    },
    getProduct(label, coupon) {
      const that = this;
      that.error = null;

      productService.getProduct({ label: label, coupon: coupon }).then(
        d => {
          that.product = d;
          that.ready = true;
        },
        e => {
          that.error = e;
        }
      );
    },
    approvePayment(request) {
      return new Promise((resolve, reject) => {
        const that = this;
        productService.buyProductNewUser(request).then(
          d => {
            if (d.status == "approved_by_network") {
              resolve();
            } else {
              that.error = `The payment has failed because ${d.message}(${
                d.status
              }). Please check your card or contact us if you are not sure what went wrong.`;
              that.ready = true;
              reject();
            }
          },
          e => {
            that.error = e;
            that.ready = true;
            reject();
          }
        );
      });
    },
    getToken() {
      return new Promise((resolve, reject) => {
        const that = this;

        if (that.product.price == 0) {
          resolve();
          return;
        }

        that.error = null;
        stripe.createToken(card).then(function(result) {
          if (result.error) {
            that.error = result.error.message;
            that.ready = true;
            reject();
          } else {
            resolve(result.token);
          }
        });
      });
    },
    checkout() {
      let c = () => {
        return new Promise((resolve, reject) => {
          this.getToken().then(token => {
            let request = {
              Label: this.product.label,
              Token: token ? token.id : null,
              UserId: this.userToProcess.userId,
              TeamId: this.userToProcess.teamId
            };
            this.approvePayment(request).then(() => {
              resolve();
            });
          });
        });
      };

      this.ready = false;
      if (this.pre && !this.userToProcess) {
        this.pre().then(
          user => {
            this.userToProcess = user;
            c().then(d => {
              if (this.post) {
                this.post();
              }
              this.ready = true;
            });
          },
          e => {
            this.ready = true;
            console.log("nein nein");
          }
        );
      } else {
        c().then(d => {
          if (this.post) {
            this.post();
          }
          this.ready = true;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.account-details {
  background-color: transparent;
  border: none;
  display: block;
  font-family: sans-serif;
  margin: 0;
  width: 100%;
  font-size: 1em;
  line-height: 1.2em;
  height: 2.2em;
  font-size: 24px;
  color: "#555";
  padding: 10px 10px 10px 0;

  // &::placeholder {
  //   font-size: 18px;
  //   color: "#55555582";
  //   opacity: 1;
  //   font-style: italic;
  // }

  &::-ms-input-placeholder {
    color: "#55555582";
    opacity: 1;
    font-style: italic;
  }
}

.product-details {
  background-color: transparent;
  border: none;
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;

  width: 100%;

  line-height: 1.2em;
  // height: 2.2em;
  font-size: 20px;
  color: "#555";

  .name {
    font-weight: 700;
  }
  .details {
  }
  .price {
    font-weight: 700;
  }
}

.error {
  background-color: transparent;
  border: none;
  display: block;

  margin-top: 20px;
  width: 100%;
  font-size: 1em;

  font-size: 24px;
  color: #e91e63;
  padding: 10px 10px 10px 0;
}

.checkout-button {
  margin-top: 20px;
}


.coupon-link {
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 19px;
    line-height: 31px;
    letter-spacing: 0.04em;
    color: #F3414F;
}

input.account-details {
  border: 1px solid #f1f1f1;
  // height: 60px;
  background: #F1F1F1;
  border-radius: 3px;
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 19px;
  line-height: 31px;
  letter-spacing: 0.04em;
  color: #2A2A2A;
  margin-top: 15px;
  width: 93%;
  padding-left: 5%;
}

.card-container {
  background-color: #F1F1F1;
  height: 40px;
  padding-top: 20px;
  padding-left: 5%;
  padding-right: 5%;
}

.heading-small {
  font-size: 30px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 200;
  color: #2F2F2F;
  line-height: 1.2;
  .pink {
    color: #F3414F;
  }
  .bold {
    font-weight: 700;
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
  width: 50%;
  border-radius: 7px;
  height: 64px;
  line-height: 64px;
  text-decoration: none;
  text-align: center;
  // margin-top: -100px;
  margin-bottom: 40px;
  transition: 0.2s;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:hover {
    box-shadow: 8px 12px 28px rgba(198, 0, 0, 0.51);
    transition: 0.2s;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  &:disabled{
    background: #7b7b7b
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

@media (max-width: 910px) {
  .content-container {
    .get-started-button {
      width: 50%;
      font-size: 14px;
    }
  }
}


// #example-card input {
//   background-color: #f1f1f1;
// }











</style>
