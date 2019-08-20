import settings from '../settings'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueMeta from 'vue-meta'
import VueRollbar from 'vue-rollbar';
import VueAxios from 'vue-axios'
import VueSweetAlert2 from 'vue-sweetalert2';
import VueStripeCheckout from "vue-stripe-checkout";


import axios from 'axios'
// import BootstrapVue from 'bootstrap-vue'

import App from './App'
import router from './router'

import store from '../App/store/store'

// Vue.config.devtools = true

//Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)

Vue.use(VueAnalytics, {
  id: settings.googleAnalytics,
  router
})
if (settings.env === 'production') {
  Vue.use(VueRollbar, {
    accessToken: settings.rollbarKey,
    payload: {
      environment: settings.host
    }
  })
  Vue.config.errorHandler = function (err) {
    console.log(err);
    Vue.rollbar.error(err);
  }
}

Vue.use(VueAxios, axios)
Vue.use(VueMeta)


Vue.use(VueSweetAlert2);

import logoSquare from "./assets/img/sqaure-logo.png";
const options = {
  key: settings.stripePK,
  image: logoSquare,
  locale: "auto",
  billingAddress: false,
  panelLabel: "Buy {{amount}}"
};

Vue.use(VueStripeCheckout, options);



import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faComment, 
  faEnvelope, 
  faUserSecret, 
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faComment, 
  faEnvelope, 
  faUserSecret, 
  faDownload
)

//<font-awesome-icon icon="bullseye"/>

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
}).$mount("#app");





