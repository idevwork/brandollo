import settings from "@/settings";
import api from "../services/RestService";

export function getComments(recourceId) {
  const resourceUrl = `${settings.commentApi}comment/${recourceId}`;
  return api.get(resourceUrl);
}

export function updateComment(payload) {
  const resourceUrl = `${settings.commentApi}comment/edit`;
  return api.put(resourceUrl, payload);
}

export function createComment(formData, requestConfig) {
  const resourceUrl = `${settings.commentApi}comment/create`;
  return api.postMultipart(resourceUrl, formData, requestConfig);
}

export function deleteComment(payload) {
  const resourceUrl = `${settings.commentApi}comment/delete/${payload.id}`;
  return api.del(resourceUrl);
}

export function getUnreadComments(payload) {
  const resourceUrl = `${settings.commentApi}comment/unread`;
  return api.post(resourceUrl, payload);
}

export default {
  getComments,
  updateComment,
  createComment,
  deleteComment
};
