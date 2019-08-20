
import settings from '@/settings'
import api from '../services/RestService'



export function registerUser(payload){
    const resourceUrl = `${settings.accountApi}user/register`;
    return api.post(resourceUrl, payload);
}

export function getProduct(params) {
    const resourceUrl = `${settings.accountApi}product/${params.label}` + (params.coupon ? `?coupon=${params.coupon}` : ``);
    return api.get(resourceUrl);
}

export function buyProduct(payload) {
    const resourceUrl = `${settings.accountApi}product/purchase`;
    return api.post(resourceUrl, payload);
}

export function buyProductNewUser(payload) {
    const resourceUrl = `${settings.accountApi}product/purchase/new`;
    return api.post(resourceUrl, payload);
}


export function getPurchases(params) {
    const resourceUrl = `${settings.accountApi}product/purchase/unassigned`;
    return api.get(resourceUrl, params);
}


export function linkPurchase(payload) {
    const resourceUrl = `${settings.accountApi}product/purchase/unassigned`;
    return api.put(resourceUrl, payload);
}

export default {
    getProduct,
    buyProduct,
    buyProductNewUser,
    getPurchases,
    linkPurchase, 
    registerUser
}