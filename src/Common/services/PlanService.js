
import settings from '@/settings'
import api from '../services/RestService'


export function getPlanActions(params) {
    const resourceUrl = `${settings.api}plan/${params.teamId}/actions`;
    return api.get(resourceUrl);
}

export function getPlans(payload) {
    const resourceUrl = `${settings.api}plan/${payload.teamId}`;
    return api.get(resourceUrl, payload);
}


export function getAvailablePlans(payload) {
    const resourceUrl = `${settings.api}plan?category=plan`;
    return api.get(resourceUrl, payload);
}

export function getFeaturedPlans(payload) {
    const resourceUrl = `${settings.api}plan?category=plan-featured`;
    return api.get(resourceUrl, payload);
}


export function getAvailablePlanTypes(payload) {
    const resourceUrl = `${settings.api}plan?category=plan-type`;
    return api.get(resourceUrl, payload);
}

export function removePlan(payload) {
    const resourceUrl = `${settings.api}plan/${payload.teamId}/delete/${payload.planId}`;
    return api.del(resourceUrl, payload);
}

export function getCustomPlanActions(payload) {
    const resourceUrl = `${settings.api}plan/custom?categories=custom-digital&categories=custom-offline&categories=custom-sales`;
    return api.get(resourceUrl, payload);
}

export function updatePlan(payload) {
    const resourceUrl = `${settings.api}plan/${payload.teamId}`
    return api.put(resourceUrl, payload.plan);
}

export default {
    getPlanActions,
    getPlans,
    removePlan, 
    getAvailablePlans, 
    getFeaturedPlans,
    getCustomPlanActions,
    updatePlan,
}