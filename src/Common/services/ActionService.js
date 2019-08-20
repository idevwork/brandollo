
import settings from '@/settings'
import api from '../services/RestService'
import axios from 'axios';


export function getActions(params) {
    const resourceUrl = `${settings.api}action/${params.teamId}`;
    return api.get(resourceUrl);
}

export function reorderActions(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/reorder`;

    return new Promise(function (resolve, reject) {
        axios.post(resourceUrl, payload.actions, { cancelToken: payload.cancelToken.token })
            .then(response => {
                if (response.data.success) {
                    resolve(response.data.data);
                }
                else {
                    reject();
                }
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    reject('cancelled');
                } else {
                    if (error.response.status === 401) {
                        window.location.href = '/app/refresh';
                    }
                    console.log(error.response.data);
                    reject(error.response.data);
                }
            });
    });
}

export function getCategories(params) {
    const resourceUrl = `${settings.api}action/${params.teamId}/category`;
    return api.get(resourceUrl);
}

export function startAction(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/start`;
    return api.put(resourceUrl, payload);
}

export function finishAction(payload) {
    const resourceUrl = `${settings.api}action/${payload[0].teamId}/actions/finish`;
    return api.put(resourceUrl, payload);
}

export function cancelAction(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/cancel`;
    return api.put(resourceUrl, payload);
}

export function skipAction(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/skip`;
    return api.put(resourceUrl, payload);
}

export function planAction(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/plan`;
    return api.put(resourceUrl, payload);
}

export function planActions(payload) {
    const resourceUrl = `${settings.api}action/${payload[0].teamId}/actions/plan`;
    return api.put(resourceUrl, payload);
}

export function assignTask(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/assign`;
    return api.put(resourceUrl, payload);
}

export function changePlan(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/changePlan`;
    return api.put(resourceUrl, payload);
}

export function changeActionTitle(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/changeTitle`;
    return api.put(resourceUrl, payload);
}

export function createAction(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/create`;
    return api.post(resourceUrl, payload);
}

export function createActionFromPlanAction(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/planCreate`;
    return api.post(resourceUrl, payload);
}

export function createActionFromLearn(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/learnCreate`;
    return api.post(resourceUrl, payload);
}

export function removeAction(payload) {
    const resourceUrl = `${settings.api}action/${payload.teamId}/action/remove`;
    return api.del(resourceUrl, payload);
}


export default {
    getActions,
    getCategories,
    startAction,
    finishAction,
    cancelAction,
    skipAction,
    planAction,
    assignTask,
    changePlan,
    createAction,
    createActionFromPlanAction,
    createActionFromLearn,
    removeAction
}