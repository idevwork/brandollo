import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import store from '@/App/store/store' //this is a smell. the sign in checkout should be part of app not website.

function scrollTo(to, from) {
  if (to.name == from.name) {
    return;
  }
  if (to.hash) {
    return { selector: to.hash, offset: { x: 0, y: 100 } }
  } else {
    return { x: 0, y: 0 }
  }
}

function redirectToDefaultTeam(to, from, next) {
  const { hash, params, query } = to

  if (!to.params.team) {
    console.log("Router: Missing TeamId");
    store.dispatch('InitStore').then(_ => {
      if (store.state.userStore.signedIn) {
        let teamId = store.getters.currentTeamId;
        console.log(teamId)
        if (teamId) {
          let q = "";
          if (Object.keys(to.query).length > 0) {
            q = "?" + Object.keys(to.query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(to.query[k])}`).join('&');
          }
          next(`/${teamId}${to.path}${q}`);
        } else {
          next("NotFound");
        }
      }
      else {
        console.log("Router: Not logged in, redirecting to sign in page");
        store.dispatch('signIn', { destination: `${window.location.origin}${to.fullPath}` });
      }
    });
  }
}


let router = new Router({
  scrollBehavior: scrollTo,
  mode: 'history',
  routes: [
    {
      path: '',
      component: () => import("./layouts/Landing"),
      props: { checkAccess: false },
      children: [
        {
          path: '/',
          name: 'Landing',
          component: () => import("./views/LandingPage")
        },
        {
          path: '/alt',
          name: 'Landing-alt',
          component: () => import("./views/LandingPage")
        },
        {
          path: '/product',
          name: 'Product',
          component: () => import("./views/Product")
        },
        {
          path: '/free',
          name: 'free',
          alias: ['/get-started-gap-tool', '/get-started-gap-tool-2', '/get-started-gap-tool-3'],
          component: () => import("./views/TrailBlazer")
        },
        {
          path: '/get-started',
          name: 'Get Started',
          alias: ['/myriad',
            '/pausefest',
            '/pause-fest',
            '/beta-start',
            '/create-your-marketing-strategy',
            '/learn-how-to-market-your-business',
            '/the-brandollo-platform',
            '/free-trial'],
          component: () => import('./views/Conference')
        },
        {
          path: '/learn-more',
          name: 'learn-more',
          alias: ['/about', '/team'],
          component: () => import("./views/LearnMore"),
        },
        {
          path: '/terms-and-conditions',
          name: 'terms',
          component: () => import("./views/Terms"),
        },
        {
          path: '/privacy-policy',
          name: 'privacy',
          component: () => import("./views/Privacy"),
        },
        {
          path: '/pricing',
          name: 'pricing',
          component: () => import('./views/Pricing')
        },
        {
          path: '/enquire',
          name: 'enquire',
          alias: 'grow',
          component: () => import('./views/Enquire'),
          props: (route) => ({ list: route.query.list })
        },
        {
          path: '/preview',
          name: 'preview',
          component: () => import('./views/Preview')
        },
        {
          path: '/preview/demo',
          name: 'preview-demo',
          component: () => import('./views/PreviewEmail')
        },
        {
          path: '/preview/startup',
          name: 'preview-startup',
          component: () => import('./views/PreviewStartup')
        },
        {
          path: '/for-startup',
          name: 'for-startup',
          component: () => import("./views/landing/StartupLanding")
        },
        {
          path: '/for-accelerators',
          name: 'for-accelerators',
          component: () => import("./views/landing/AcceleratorLanding")
        },
        {
          path: '/for-small-business',
          name: 'for-small-business',
          component: () => import('./views/landing/SmallBusinessLanding')
        },
        {
          path: '/for-marketing-agency',
          name: 'for-marketing-agency',
          component: () => import('./views/ForMarketingAgency')
        },
        {
          path: '/download-ebook',
          name: 'download-ebook',
          component: () => import('./views/EbookDownload')
        },
        {
          path: '/register/checkout',
          name: 'Register Checkout',
          component: () => import("./views/checkout/RegisterCheckout"),
          props: true
        },
        {
          path: '/register/checkout/complete',
          name: 'Register Checkout Complete',
          component: () => import("./views/checkout/PostRegisterCheckout"),
          props: true
        },

      ]
    },
    {
      path: '/',
      component: () => import("./layouts/Landing"),
      props: { checkAccess: true },
      children: [
        {
          path: '/:team/expired',
          name: 'Account Expired',
          component: () => import("./views/checkout/Expired"),
          props: true
        },
        {
          path: '/:team/upgrade',
          name: 'Account Upgrade',
          component: () => import("./views/checkout/Upgrade"),
          props: true
        },
        {
          path: '/:team/checkout',
          name: 'SignedIn Checkout',
          component: () => import("./views/checkout/SignInCheckout"),
          props: true
        },
        {
          path: '/checkout',
          beforeEnter: redirectToDefaultTeam
        },
      ]
    },
    ,
    {
      path: '/',
      component: () => import("./layouts/Landing"),
      props: { checkAccess: false },
      children: [
        {
          path: 'callback',
          name: 'SignInCallback',
          component: () => import('./views/system/Callback')
        },
        {
          path: 'silent-callback',
          name: 'SilentCallback',
          component: () => import('./views/system/CallbackSilent')
        },
        {
          path: '/offline',
          name: 'offline',
          component: () => import("./views/Offline")
        },
        {
          path: '/redirect',
          component: () => import("@/Common/views/Redirect")
        },
        {
          path: '/error',
          component: () => import("./views/Error")
        },
        {
          path: '/404',
          name: 'NotFound-Alt',
          component: () => import("./views/NotFound")
        },
        {
          path: '*',
          name: 'NotFound',
          component: () => import("./views/NotFound")
        }]
    }
  ]
})

router.afterEach((to, from) => {
  if (typeof freshsales !== 'undefined') {
    //freshsales.trackPageView(to.fullPath);
  }
  if (typeof mixpanel !== 'undefined') {
    mixpanel.track(to.name, { ...to.params, ...to.query });
  }
  if (typeof fbq !== 'undefined') {
    fbq('track', 'PageView');
  }
  if (typeof _agile !== 'undefined') {
    _agile.track_page_view();
  }

})

export default router;
