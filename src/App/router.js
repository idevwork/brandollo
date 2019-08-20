import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import store from './store/store'

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
        store.dispatch('signIn', { destination: `${window.location.origin}/app${to.fullPath}` });
      }
    });
  }
}

let router = new Router({
  scrollBehavior: scrollTo,
  mode: 'history',
  routes: [  
    {
      path: "/",
      component: () => import("./layouts/Dashboard"),
      meta:{ section: 'app'},
      props: { checkAccess: true },
      children: [
        {
          path: '/:team/questions/:id',
          name: 'question view',
          meta: { hideMenuF: id => id === '1' ? true : false },
          props: true,
          component: () => import("./views/questions/FormViewer"),
        },
        {
          path: '/questions/:id',
          beforeEnter: redirectToDefaultTeam
        },
        {
          path: '/intro',
          alias: ['/market-gap-tool/', '/market-gap-tool/2'],
          beforeEnter: (to, from, next) => {
            store.dispatch('InitStore').then(_ => {
              let teamId = store.getters.currentTeamId;
              if (next(`/${teamId}/questions/1`)) {
                next("NotFound")
              }
            })
          }
        },
        {
          path: '/:team/actions-list',
          name: 'actions-list',
          component: () => import("./views/actions/ActionTool2"),
          props: route => ({
            team: route.params.team,
            actionId: route.params.actionId,
            disableTimeline: true,
            learn: route.params.learn
          }),
          children: [
            {
              path: "timeline", 
              name: 'gantt-timeline',
              meta: { 'splitView': true }, 
              component: () => import('./components/Actions/ActionGantt')
            },
            {
              path: ':actionId',
              name: 'actionDetails',
              meta: { 'splitView': true }, 
              component: () => import('./views/actions/ActionDetail'),
              props: { format: 'DD/MM/YY' },
            },
            
          ],
        },
        {
          path: '/:team/actions2/:actionId?/:learn?',
          name: 'actions2',
          props: route => ({
            team: route.params.team,
            actionId: route.params.actionId,
            disableTimeline: false,
            learn: route.params.learn
          }),
          component: () => import("./views/actions/ActionTool2")
        },
        {
          path: '/:team/learn',
          name: 'learn-tool',
          component: () => import("./views/learn/LearnTool2"),
        },
        {
          path: '/:team/learn/:articleId',
          name: 'learn-article',
          props: true,
          component: () => import("./views/learn/LearnArticle")
        },
        {
          path: '/:team/learn/old',
          name: 'learn-tool-old',
          props: true,
          component: () => import("./views/learn/LearnTool2")
        },
        {
          path: '/:team/plan/create',
          name: 'plan-create',
          meta: { 'hideMenu': true },
          component: () => import("./views/plans/PlanTypePickerView")
        },
        {
          path: '/:team/plan/create-more',
          name: 'plan-create-more',
          meta: { 'hideMenu': false },
          props: true,
          component: () => import("./views/plans/PlanTypePickerView")
        },
        {
          path: '/:team/plan/create/packaged',
          name: 'create-ready-plan',
          meta: { 'hideMenu': false },
          props: true,
          component: () => import("./views/actions/PlanCreate")
        },
        {
          path: '/actions-list',
          beforeEnter: redirectToDefaultTeam
        },
        {
          path: '/actions2',
          beforeEnter: redirectToDefaultTeam
        },
        {
          path: '/learn',
          beforeEnter: redirectToDefaultTeam
        },
        {
          path: '/plan/create',
          beforeEnter: redirectToDefaultTeam
        },  
        {
          path: '/download-pdf/:id',
          name: 'download pdf',
          props: true,
          component: () => import("./views/DownloadPdf")
        },
        {
          path: '/team/:team/settings',
          name: 'team settings',
          component: () => import("./views/UserPreferences/Team")
        },
        {
          path: '/team/:team/notifications',
          name: 'notification settings',
          props: true,
          component: () => import("./views/UserPreferences/Notifications")
        },
        {
          path: '/invite',
          name: 'invite',
          meta: { 'hideMenu': true },
          component: () => import("./views/invite/Invite")
        },
        {
          path: '/help', 
          name: 'help',
          component:() => import("./views/help/Help")
        }

      ]
    },
    {
      path: "/",
      component: () => import("./layouts/Dashboard"),
      props: { checkAccess: false },
      children: [
        {
          path: 'refresh',
          name: 'Refresh',
          component: () => import("./views/Refresh")
        },
        {
          path: '/error',
          component: () => import("./views/PublicPages/Error")
        },
        {
          path: '*',
          name: 'NotFound',
          component: () => import("./views/PublicPages/NotFound")
        }
      ]
    }
  ]
})

router.afterEach((to, from) => {
  if (typeof drift !== 'undefined') {
    drift.page();
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