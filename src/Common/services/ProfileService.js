import settings from '@/settings'
import api from '../services/RestService'

export function getProfile(){
    const resourceUrl = `${settings.api}profile`;   
    return api.get(resourceUrl);
}

export function getProfileQuestions(params){
    const resourceUrl = `${settings.api}profile/${params.id}`;   
    return api.get(resourceUrl);
}




export default{
    getProfile,
    getProfileQuestions
}