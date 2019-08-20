import * as teamService from "@/Common/services/TeamService";
import { some, every } from 'lodash';
const CurrentTeamStorageKey = 'CurrentTeamId';

const state = {
    teamStoreReady: false,
    teams: [],
    currentTeamId: null,
    currentTeam: { allowTrial: false },
    currentPermissions: {
        owner: false,
        changeteam: false,
        changestatus: false,
        viewall: false,
        member: false
    },
    subscription: {
        name: null,
        product: null,
        expiry: null
    },
    // currentSubscription: null,
    // currentSubscriptionExpiry: null,
    isOperationPending: false,
}

const mutations = {
    'RESET_TEAM_STORE'(state) {
        state.teamStoreReady = false;
    },
    'LOADING_TEAM_COMPLETE'(state) {
        state.teamStoreReady = true;
    },
    'GET_TEAMS_REQUEST'(state) {
    },
    'SET_TEAMS'(state, teams) {
        state.teams = teams
    },
    'SET_CURRENT_TEAM_ID'(state, teamId) {
        state.currentTeamId = teamId;
    },
    'SET_CURRENT_TEAM'(state, team) {
        state.currentTeam = team;
    },
    'RESET_CURRENT_PERMISSION'(state) {
        state.currentPermissions = {
            owner: false,
            changeteam: false,
            changestatus: false,
            viewall: false,
            member: false
        };
    },
    'SET_CURRENT_PERMISSION'(state, payload) {
        state.currentPermissions = payload
    },
    'SET_ACTIVE_SUBSCRIPTION'(state, payload) {
        state.subscription = payload;
    },
    // 'SET_ACTIVE_SUBSCRIPTION_EXPIRY'(state, payload) {
    //     state.currentSubscriptionExpiry = payload;
    // },
    /** Add team member */
    'ADD_TEAM_MEMBER_REQUEST'(state) {
        state.isOperationPending = true
    },
    'ADD_TEAM_MEMBER_SUCCESS'(state, payload) {
        state.isOperationPending = false
        state.currentTeam.members.push(payload)
    },
    'ADD_TEAM_MEMBER_FAIL'(state, payload) {
        state.isOperationPending = false
    },
    /** Remove team member */
    'REMOVE_TEAM_MEMBER_REQUEST'(state) {
        state.isOperationPending = true
    },
    'REMOVE_TEAM_MEMBER_SUCCESS'(state, payload) {
        state.isOperationPending = false

        const recordIndex = state.currentTeam.members.findIndex(element => element.userEmail === payload.userEmail)
        state.currentTeam.members.splice(recordIndex, 1)
    },
    'REMOVE_TEAM_MEMBER_FAIL'(state, payload) {
        state.isOperationPending = false
    }
}

const actions = {
    initTeam: ({ dispatch, commit, state }) => {
        return new Promise(function (resolve, reject) {
            if (state.teamStoreReady) {    //only load once              
                resolve();
            }

            dispatch('getTeams')
                .then(() => dispatch("setCurrentTeam"), f => reject(f))
                .then(() => dispatch('getTeam'))
                .then(() => dispatch('updatePermission'))
                .then(() => {
                    commit('LOADING_TEAM_COMPLETE');
                    resolve();
                })
        });
    },
    setCurrentTeam: ({ commit, state }) => {
        return new Promise(function (resolve, reject) {
            let currentTeam = localStorage.getItem(CurrentTeamStorageKey);
            // let currentTeam = null; 

            if (!some(state.teams, { 'teamId': currentTeam })) {
                console.log("Invalid team id in cache");
                currentTeam = null;
            }

            if (!currentTeam) {
                currentTeam = state.teams[0].teamId;
                localStorage.setItem(CurrentTeamStorageKey, currentTeam);
            }
            commit('SET_CURRENT_TEAM_ID', currentTeam);
            resolve();
        });
    },
    getTeams: ({ commit, state }) => {
        return new Promise(function (resolve, reject) {

            commit('GET_TEAMS_REQUEST')

            teamService.getTeams()
                .then(teams => {
                    commit('SET_TEAMS', teams)
                    resolve();
                }, f => reject(f))
        })
    },
    getTeam: ({ dispatch, commit, state }) => {
        return new Promise(function (resolve, reject) {
            //  dispatch('initTeam').then(_ => {
            teamService.getTeamById({ id: state.currentTeamId })
                .then(team => {

                    commit('SET_CURRENT_TEAM', team)
                    resolve();
                }, f => reject(f))
            //   })
        })
    },
    updatePermission: ({ dispatch, commit, state, rootState }) => {
        return new Promise(function (resolve, reject) {
            commit('RESET_CURRENT_PERMISSION');
            commit('SET_ACTIVE_SUBSCRIPTION', [{
                name: null,
                product: null,
                expiry: null
            }])
            // commit('SET_ACTIVE_SUBSCRIPTION_EXPIRY', null)


            let perms = {
                owner: false,
                changeteam: some(state.currentTeam.permissions, { 'normalizedName': 'changeteam' }),
                changestatus: some(state.currentTeam.permissions, { 'normalizedName': 'changestatus' }),
                viewall: some(state.currentTeam.permissions, { 'normalizedName': 'viewall' }),
                member: some(state.currentTeam.permissions, { 'normalizedName': 'member' })
            }

            if (some(state.currentTeam.permissions, { 'normalizedName': 'owner' })) {
                perms = {
                    owner: true,
                    changeteam: true,
                    changestatus: true,
                    viewall: true,
                    member: true
                };
            }
            commit('SET_CURRENT_PERMISSION', perms);

            //TODO do something with multiple subs 
            if (state.currentTeam.subscriptions.length > 0) {
                commit('SET_ACTIVE_SUBSCRIPTION', state.currentTeam.subscriptions)
            }
            resolve();
            //  })
        });
    },
    changeCurrentTeam: ({ dispatch, commit, state }, teamId) => {
        return new Promise((resolve, reject) => {
            commit('SET_CURRENT_TEAM_ID', teamId);
            localStorage.setItem(CurrentTeamStorageKey, teamId);
            console.log('current team changed to', teamId)
            //TODO Update currentTeam 
            // dispatch('updatePermission')
            dispatch('getTeam').then(_ => {
                resolve();
            })

        })
    },
    clearCurrentTeam: ({ }) => {
        localStorage.removeItem(CurrentTeamStorageKey);
    },
    // Add team member
    addTeamMember({ dispatch, commit, state }, payload) {
        commit('ADD_TEAM_MEMBER_REQUEST')

        return new Promise((resolve, reject) => {
            teamService.addMember(payload)
                .then(res => {
                    console.log('teamStore_addTeamMember', res)
                    if (res.member !== null) {
                        commit('ADD_TEAM_MEMBER_SUCCESS', res.member)
                    }

                    resolve(res)
                })
                .catch(err => {
                    console.log('teamStore_addTeamMember', err)
                    commit('ADD_TEAM_MEMBER_FAIL')
                    reject(err)
                })
        })
    },
    // Remove team member
    removeTeamMember({ dispatch, commit, state }, payload) {
        commit('REMOVE_TEAM_MEMBER_REQUEST')

        return new Promise((resolve, reject) => {
            teamService.removeMember(payload)
                .then(res => {
                    console.log('teamstore_removeTeamMember', res)
                    commit('REMOVE_TEAM_MEMBER_SUCCESS', payload)

                    resolve(res)
                })
                .catch(err => {
                    console.log('teamStore_removeTeamMember', err)
                    commit('REMOVE_TEAM_MEMBER_FAIL')
                    reject(err)
                })
        })

    },
    //update team
    updateTeam({ dispatch, commit, state }, payload) {
        return new Promise((resolve, reject) => {
            // request via team service
            teamService.updateTeam(payload).then(res => {
                dispatch('getTeams')
                resolve(res)
            })
                .catch(err => {
                    // commit('REMOVE_TEAM_MEMBER_FAIL')
                    reject(err)
                })
        });
    },
    //update role
    updateMemberRole({ dispatch, commit, state }, payload) {
        new Promise((resolve, reject) => {
            teamService.updateMemberRole(payload)
                .then(res => resolve(res))
                .catch(err => resolve(err))
        })
    }
}

const getters = {
    currentTeamId: state => {
        return state.currentTeamId
    },
    currentTeam: state => {
        return state.currentTeam
    },
    teams: state => {
        return state.teams
    },
    getTeamMemberName: (state) => (userId) => {
        if (!state.currentTeam) {
            return;
        }
        let user = state.currentTeam.members.find(m => m.userId == userId);
        if (!user) {
            return;
        }
        return user.userDetailsFirstName;
    },
    getTeamMember: (state) => (userId) => {
        if (!state.currentTeam) {
            return;
        }
        let user = state.currentTeam.members.find(m => m.userId == userId);
        if (!user) {
            return;
        }
        return user;
    },
    isPremium: state => {
        return some(state.subscription, { 'product': 'basic-subscription' })
        //return state.subscription.product === "basic-subscription";
    },
    isTrial: state => {
        if (!every(state.subscription, { 'label': 'basic-subscription-trial' })) {
            return false;
        }
        return some(state.subscription, { 'label': 'basic-subscription-trial' })
        //return state.subscription.name === "basic-subscription-trial";
    },
    isFree: state => {
        if (some(state.subscription, { 'product': 'basic-subscription' })) {
            return false;
        }
        return true; 
        //return state.subscription.product === "free-subscription";
    }


}


export default {
    state,
    mutations,
    actions,
    getters
}