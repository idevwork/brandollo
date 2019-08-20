
import settings from '@/settings'
import api from '../services/RestService'


export function getMarketGapSchema() {  
    const resourceUrl = `${settings.api}questions/schema`;   
    return api.get(resourceUrl);
}

export function checkHasFormData(params){  
    const resourceUrl = `${settings.api}questions/${params.teamId}/filled/${params.formId}`;   
    return api.get(resourceUrl);
}

export function getUserQuestions(params){
    let resourceUrl = `${settings.api}questions/user`;      
    if(params && params.category){
        resourceUrl = resourceUrl += `?category=${params.category}`;
    }
    return api.get(resourceUrl);
}

export function getUserQuestion(params){
    const resourceUrl = `${settings.api}questions/${params.id}`;   
    return api.get(resourceUrl);
}

export function postAnswers(payload) {
    const resourceUrl = `${settings.api}questions/${payload.TeamId}`;   
    return api.post(resourceUrl, payload);
}

export function getPdfLink(params){
    const resourceUrl = `${settings.api}dashboard/reports/${params.id}/download`;   
    return api.get(resourceUrl);
}

export default {
    getMarketGapSchema, 
    postAnswers,
    checkHasFormData, 
    getUserQuestions, 
    getUserQuestion, 
    getPdfLink
} 