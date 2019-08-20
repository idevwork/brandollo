
import settings from '@/settings'
import api from '../services/RestService'

export function referAFriend(payload) {
    const resourceUrl = `${settings.accountApi}/mailinglist/referral`;
    return api.post(resourceUrl, payload);
  }

  export default {
    referAFriend
  }