import Vue from 'vue'
import Vuex from 'vuex'

import userStore from './modules/userStore'
import teamStore from './modules/teamStore'
import actionStore from './modules/actionStore'
import questionStore from './modules/questionStore'
import ganttStore from './modules/ganttStore'
import learnStore from './modules/learnStore'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        userStore,
        teamStore,
        actionStore, 
        question: questionStore, 
        timeline: ganttStore,
        article: learnStore
    },
    actions: {
        InitStore: ({ dispatch }) => {
            return new Promise(function (resolve, reject) {
                dispatch('initUser').then(signedIn => {                    
                    if (signedIn) {
                        dispatch('initTeam').then(_ => {
                            resolve(signedIn);                            
                        })
                    }
                    else {
                        resolve(signedIn);
                    }
                });
            })
        },
        ResetStore: ({ commit, dispatch }) => {
            return new Promise(function (resolve, reject) {
                commit('RESET_USER_STORE');
                commit('RESET_TEAM_STORE');
                commit('RESET_ACTION_STORE');                
                dispatch('InitStore').then(signedIn => {
                    resolve(signedIn);
                })
            });
        }
    }
})
