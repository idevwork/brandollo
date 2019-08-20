import Oidc from "oidc-client";
import settings from "@/settings";
import axios from 'axios'
import router from '@/App/router';

Oidc.Log.logger = console;

let oidcUserManager = new Oidc.UserManager({
    userStore: new Oidc.WebStorageStateStore(
        { store: window.localStorage }),
    authority: settings.authority,
    client_id: "vueapp",
    redirect_uri: settings.host + "/callback",
    response_type: "id_token token",
    scope: "openid profile email account engine b.profile",
    post_logout_redirect_uri: settings.host,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: settings.host + "/silent-callback"
});



const state = {
    userStoreReady: false,
    user: null,
    signedIn: false,
    isHeadless: false
}

const mutations = {
    'RESET_USER_STORE'(state) {
        state.userStoreReady = false;
    },
    'LOADING_USER_COMPLETE'(state) {
        state.userStoreReady = true;
    },
    'SET_USER'(state, user) {
        state.user = user;
    },
    'SET_SIGN_STATUS'(state, status) {
        state.signedIn = status;
    },
    // 'SET_HEADLESS'(state, status) {
    //     state.isHeadless = status;
    // }
}

const actions = {
    initUser: ({ dispatch, commit, state }) => {
        return new Promise(function (resolve, reject) {

            if (state.userStoreReady) {
                resolve(state.signedIn);
                return;
            }

            oidcUserManager.clearStaleState();
            oidcUserManager.startSilentRenew();

            oidcUserManager.events.addSilentRenewError(function (err) {
                console.log("Auth: Silent renew error: " + err.message);
            });

            oidcUserManager.events.addAccessTokenExpired(() => {
                console.log('Auth: Token expired');
                oidcUserManager.removeUser();
            });

            oidcUserManager.events.addUserSignedOut(function () {
                console.log("Auth: User signed out of OP");
                oidcUserManager.removeUser();
            });

            oidcUserManager.events.addUserLoaded(function (user) {
                console.log("Auth: User has been Loaded");
            });

            // dispatch('setupHeadlessMode').then(isHeadless => {
            //     if (!isHeadless) {
            //         oidcUserManager.signinSilentCallback().then(_ => {
            //             dispatch('setupUser').then(_ => {
            //                 commit('LOADING_USER_COMPLETE');
            //                 resolve(state.signedIn);
            //             })
            //         })
            //     } else {
            //         resolve(state.signedIn);
            //     }
            // })


            dispatch('setupUser').then(_ => {
                commit('LOADING_USER_COMPLETE');
                resolve(state.signedIn);
            })

        });
    },
    setupUser({ dispatch, commit }) {
        return new Promise(function (resolve, reject) {
            oidcUserManager.getUser()
                .then(user => {
                    if (user == null) {
                        commit('SET_USER', null);
                        commit('SET_SIGN_STATUS', false);
                        dispatch('setAuthenticationHeader');
                    } else {
                        commit('SET_USER', user);
                        commit('SET_SIGN_STATUS', true);
                        dispatch('setAuthenticationHeader');

                    }
                    resolve(state.signedIn);
                })
        });
    },
    signIn({ }, payload) {
        let destination = payload.destination;
        let register = payload.register;

        if (!destination) {
            destination = window.location.href;
        }

        if (!destination.startsWith(settings.host)) {
            destination = settings.host + destination;
        }

        if (register) {
            let intermediate = settings.host + '/rediect?destination=' + destination;
            window.location = `${settings.authority}/Account/Register?returnurl=` + encodeURI(intermediate);
        } else {
            oidcUserManager
                .signinRedirect({
                    data: destination
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    },
    signInCallback() {
        oidcUserManager.signinRedirectCallback()
            .then(function (user) {
                window.location.href = user.state;
            }).catch(function (err) {
                console.log(err);
                if (err.indexOf('exp is in') !== -1) {
                    err = "Your system time is out of the sync with the rest of the world. You'll need to update it before logging in."
                }
                window.location = "/error?message=" + err;
            });
    },
    signInSilent(){
        oidcUserManager.signinSilentCallback().then(function (user) {
            console.log('Auth: Silent Callback');         
        }).catch(function (err) {
            console.log("Auth: Silent Callback: ", err);
        });
    },
    signOut({ commit }) {
        oidcUserManager
            .signoutRedirect()
            .then(resp => {
                commit('SET_SIGN_STATUS', false);
                console.log("signed out", resp);
            })
            .catch(function (err) {
                console.log(err);
            });
    },
    refreshToken({ dispatch }) {
        return new Promise(function (resolve, reject) {

            oidcUserManager.signinSilentCallback().then(e => {
                //reject(); 
            })

            oidcUserManager.signinSilent().then(_ => {
                dispatch('setupUser').then(_ => {
                    resolve()
                });
            },e=> {
                reject(e); 
            })
        });
    },
    setAuthenticationHeader: ({ state }) => {
        axios.defaults.headers.common.Authorization = state.user && state.user.access_token
            ? `Bearer ${state.user.access_token}`
            : "";
    },
    // setupHeadlessMode({ commit }) {
    //     return new Promise(function (resolve, reject) {
    //         let value = "; " + document.cookie;
    //         let parts = value.split("; remote-token=");
    //         let token = parts.pop().split(";").shift();
    //         if (token) {
    //             commit('SET_SIGN_STATUS', true);
    //             console.log('Auth: Found user token, Updating axios header');
    //             axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    //             resolve(true);
    //         }
    //         resolve(false);
    //     })
    // }
}

const getters = {
    username: state => {
        if (state.user == null) {
            return;
        }
        if (state.user.profile == null) {
            return;
        }
        let name = state.user.profile.name;
        if (name.constructor === Array) {
            return name[name.length - 1];
        }
        return name;
    },
    userId: state => {
        if (state.user == null) {
            return;
        }
        if (state.user.profile == null) {
            return;
        }
        let id = state.user.profile.sub;
        return id;
    }

}

export default {
    state,
    mutations,
    actions,
    getters
}