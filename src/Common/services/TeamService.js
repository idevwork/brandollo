
import settings from '@/settings'
import api from '../services/RestService'

// get teams request
export function getTeams() {
  const resourceUrl = `${settings.accountApi}team`;
  return api.get(resourceUrl);
}

// update team request
export function updateTeam(payload) {
  const resourceUrl = `${settings.accountApi}team`;
  return api.put(resourceUrl, payload);
}

// get team by id request
export function getTeamById(payload) {
  const resourceUrl = `${settings.accountApi}team/${payload.id}`;
  return api.get(resourceUrl);
}

export function addMember(payload) {
  const resourceUrl = `${settings.accountApi}team/member`;
  return api.post(resourceUrl, payload);  
}

export function removeMember(payload) {
  const resourceUrl = `${settings.accountApi}team/member`;
  return api.del(resourceUrl, payload);  
}

export function updateMemberRole(payload) {
  const resourceUrl = `${settings.accountApi}team/member`;
  return api.put(resourceUrl, payload);  
}

export function getProfile(payload) {
  const resourceUrl = `${settings.accountApi}user/profile`;
  return api.get(resourceUrl);
}

export default {
  getTeams,
  updateTeam,
  getTeamById,
  addMember,
  removeMember,
  updateMemberRole
}