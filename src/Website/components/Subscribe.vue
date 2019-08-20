<template>
  <div>
    <section
      class="hestia-subscribe subscribe-line subscribe-line-image"
      :class="largePad ? 'large-padding': ''"
      id="subscribe"
      data-sorder="hestia_subscribe"
    >
      <div class="container">
        <!-- <div class="row text-center">
        <div class="col-md-8 col-md-offset-2 text-center">-->
        <!-- <h2 class="title">{{title}}</h2>
        <h5 class="subscribe-description">{{subtitle}}</h5>-->
        <!-- </div>
        </div>-->
        <div v-if="body" class="row text-center">
          <div class="col-md-8 col-md-offset-2">
            <span class="description" v-html="body"></span>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-6">
            <div class="card card-raised card-form-horizontal">
              <div class="content">
                <div class="row">
                  <form
                    v-if="!successMessage"
                    @submit.prevent="subscribe($event)"
                    class="textwidget"
                  >
                    <div class="col-sm-12">
                      <div class="input-group">
                        <div class="form-group is-empty">
                          <input
                            v-model="email"
                            type="email"
                            class="sib-email-area form-control"
                            name="email"
                            required="required"
                            placeholder="Your Email"
                          >
                          <input
                            type="submit"
                            class="btn btn-primary btn-block sib-default-btn"
                            name="submit"
                            value="Start Now"
                          >
                        </div>
                      </div>
                    </div>
                    <!-- <div class="col-sm-4">

                    </div>-->
                  </form>
                </div>
                <div class="row">
                  <div class="col-xs-12">
                    <p v-if="errorMessage && !successMessage" transition="fade">{{ errorMessage }}</p>
                    <p v-if="successMessage" transition="fade">{{ successMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import settings from "@/settings";

export default {
  name: "Subscribe",
  props: {
    list: { default: null },
    title: { default: "Subscribe to our newsletter" },
    subtitle: { default: "Receive updates instantly" },
    body: { default: null },
    largePad: { default: false }
  },
  data() {
    return {
      email: "",
      response: {},
      errorMessage: null,
      successMessage: null
    };
  },
  methods: {
    subscribe: function() {
      let that = this;
      console.log(that.list);
      const payload = {
        source: that.list,
        email: that.email
      };

      const resourceUrl = settings.accountApi + "mailinglist/subscribe";

      that.$http
        .post(resourceUrl, payload)
        .then(response => {
          console.log(response.data);
          if (response.data.success) {
            that.successMessage = response.data.message;
          } else {
            that.errorMessage = response.data.message;
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
.row {
  width: 100%;
}

.text-widget {
  width: 100%;
}

form {
  // float: right;
  width: 100%;
  margin-top: 40px;
  input {
    height: 64px;
    line-height: 64px;
    display: inline;
  }
  input[type="email"] {
    font-family: "Lato";
    font-weight: 300;
    color: #2a2a2a;
    background: #fff;
    border: 1px solid #fff;
    border-radius: 3px;
    font-size: 19px;
    width: 60.66%;
    padding-left: 25px;
  }
  input[type="submit"] {
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

@media (min-width: 992px) and (max-width: 1210px) {
  form {
    input[type="email"] {
      background: #fff;
      border: 1px solid #fff;
      width: 50%;
    }
  }
}

@media (max-width: 991px) {
  .row {
    width: 100vw;
  }
  form {
    width: 80%;
    display: block;
    margin: 0 auto;
  }
}

@media (max-width: 585px) {
  form {
    width: 90%;
    input[type="email"] {
      font-size: 14px;
      width: 60%;
    }
    input[type="submit"] {
      font-size: 14px;
    }
  }
}

@media (max-width: 470px) {
  form {
    width: 90%;
    input[type="email"] {
      font-size: 14px;
      width: 58%;
    }
    input[type="submit"] {
      font-size: 14px;
    }
  }
}

@media (max-width: 365px) {
  form {
    width: 90%;
    input[type="email"] {
      font-size: 14px;
      width: 56%;
    }
    input[type="submit"] {
      font-size: 14px;
    }
  }
}
</style>
