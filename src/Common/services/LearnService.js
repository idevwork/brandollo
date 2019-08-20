/* eslint-disable prettier/prettier */
import settings from "@/settings";
import api from "../services/RestService";

export function getSingleContent(params) {
	const resourceUrl = `${settings.api}learn/label/${params.name}`;
	return api.get(resourceUrl);
}

export function getSingleContentById(params) {
	const resourceUrl = `${settings.api}learn/${params}`;
	return api.get(resourceUrl);
}


export function getSubContentById(params) {
	const resourceUrl = `${settings.api}learn/sub/${params}`;
	return api.get(resourceUrl);
}

export function getLearnContent(params) {
	let resourceUrl = `${settings.api}learn?`;
	if (params && params.search) {
		resourceUrl += `search=${params.search}`;
	}
	if (params && params.categories) {
		params.categories.forEach(cat => {
			resourceUrl += `&categories=${cat}`;
		});
	}

	return api.get(resourceUrl);
}

export function getCategories() {
	const resourceUrl = `${settings.api}learn/categories`;
	return api.get(resourceUrl);
}

export function getBookmarks() {
	const resourceUrl = `${settings.api}learn/bookmarks`;
	return api.get(resourceUrl);
}

// payload is resourceId for an article
export function addBookmark(resourceId) {
	let payload = {
		ResourceId: resourceId,
	};

	const resourceUrl = `${settings.api}learn/bookmarks`;
	return api.post(resourceUrl, payload);
}

// payload is resourceId for an article
export function removeBookmark(resourceId) {
	let payload = {
		ResourceId: resourceId,
	};

	const resourceUrl = `${settings.api}learn/bookmarks`;
	return api.del(resourceUrl, payload);
}

export function createActionFromArticle(payload) {
	const resourceUrl = `${settings.api}action/${payload.teamId}/action/learnCreate`
	return api.post(resourceUrl, payload);
}

export default {
	getSingleContent,
	getLearnContent,
	getSingleContentById,
	getCategories,
	getBookmarks,
	addBookmark,
	removeBookmark,
	createActionFromArticle,
};
