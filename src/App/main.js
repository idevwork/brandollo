import settings from '@/settings'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueMeta from 'vue-meta'
import VueRollbar from 'vue-rollbar';
import VueAxios from 'vue-axios'
import VueSweetAlert2 from 'vue-sweetalert2';
import VueStripeCheckout from "vue-stripe-checkout";
import VueTour from 'vue-tour';
import 'vue-tour/dist/vue-tour.css';

import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'

import App from './App'
import router from './router'

import store from './store/store'

// Vue.config.devtools = true

Vue.use(BootstrapVue)
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

import logoSquare from "./assets/images/logo_sm.png";
const options = {
  key: settings.stripePK,
  image: logoSquare,
  locale: "auto",
  billingAddress: false,
  panelLabel: "Buy {{amount}}"
};

Vue.use(VueStripeCheckout, options);
Vue.use(VueTour);



import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBullseye,
  faBars,
  faTrash,
  faTimes,
  faVideo,
  faSpinner,
  faPlusSquare,
  faPlayCircle,
  faCheck,
  faUserCircle,
  faPlay,
  faPencilAlt,
  faPaperclip,
  faGripVertical,
  faPlaneDeparture,
  faEdit,
  faCaretLeft,
  faCaretRight,
  faCaretDown,
  faCommentDollar,
  faUser,
  faNewspaper,
  faRocket, 
  faQuestionCircle, 
  faChevronDown,
  faBookmark,
  faAngleDown,
  faAngleRight,
  faComment,
  faExclamation,
  faSearch,
  faPlus,
  faMinus,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faBullseye,
  faBars,
  faTrash,
  faTimes,
  faVideo,
  faSpinner,
  faPlusSquare,
  faPlayCircle,
  faCheck,
  faUserCircle,
  faPlay,
  faPencilAlt,
  faPaperclip,
  faGripVertical,
  faPlaneDeparture,
  faEdit,
  faCaretLeft,
  faCaretRight,
  faCaretDown,
  faCommentDollar,
  faUser,
  faNewspaper,
  faRocket, 
  faQuestionCircle, 
  faChevronDown,
  faBookmark,
  faAngleDown,
  faAngleRight,
  faComment,
  faExclamation,
  faSearch,
  faPlus,
  faMinus,
  faExternalLinkAlt,
);

//<font-awesome-icon icon="bullseye"/>

Vue.component('font-awesome-icon', FontAwesomeIcon)

import Date from "@/Common/functions/Dates"

Vue.filter('formattedDate', value => {

  if(!store.state.userStore || !store.state.userStore.user){
    return; 
  }

  let zoneName = store.state.userStore.user.profile.zoneinfo;  
  return Date.getUserDateString(value,zoneName);  
})

Vue.filter('userISODate', value => {

  if(!value) {
    return 
  }
  
  if(!store.state.userStore || !store.state.userStore.user){
    return; 
  }

  let zoneName = store.state.userStore.user.profile.zoneinfo;  
  return Date.getUserDate(zoneName,value);  
})




Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
}).$mount("#app");





