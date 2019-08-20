
import settings from '@/settings'
import api from '../services/RestService'

// get teams request
export function getCalendarUrl(params) {
  const resourceUrl = `${settings.api}notifications/team/${params.teamId}`;
  return api.get(resourceUrl);
}

export function updateNotificationSettings(params, payload) {
  const resourceUrl = `${settings.api}notifications/setting/${params.userId}`;
  return api.put(resourceUrl, payload);
}

export function getNotificationsSettings(params) {
  const resourceUrl = `${settings.api}notifications/settings/${params.userId}`;
  return api.get(resourceUrl);
}

export default{
    getCalendarUrl,
    updateNotificationSettings,
    getNotificationsSettings
}
