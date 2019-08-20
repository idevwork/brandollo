/* eslint-disable prettier/prettier */
import * as learnService from "@/Common/services/LearnService";
import { find } from "lodash";

export default {
	namespaced: true,
	state: {
		// If initial load is finished
		ready: false,

		isOperationReady: true,

		formPages: {},
		articles: [],
		bookmarks: [],
		filters: {
			text: null,
			categories: [] // show all if empty
		},
		fullArticles: [],
		categoryColors: ["#6979F8", "#4AACFF", "#FFA26B", "#BE52F2", "#00C48C"],
		allFilterColor: "#F2229C",
		categories: []
	},
	mutations: {
		RESET_LEARN_STORE(state) {
			state.ready = false;
		},
		SET_READY(state, payload) {
			state.ready = payload;
		},
		SET_OPERATION_PENDING(state) {
			state.isOperationReady = false;
		},
		SET_OPERATION_FINISHED(state) {
			state.isOperationReady = true;
		},
		SET_ARTICLES(state, articles) {
			articles.forEach(article => {
				let mainCategory = article.categories.find(cat => {
					return cat.categoryTypeName === "Learn-Main";
				});
				if (mainCategory) {
					let mainCategoryWithColor = state.categories.find(cat => {
						return cat.id === mainCategory.id;
					});

					article.mainCategory = mainCategoryWithColor;
				}
			});

			state.articles = articles;
			state.ready = true;
		},
		SET_ARTICLE(state, article) {
			state.fullArticles.push(article);
		},
		SET_TEXT_FILTER(state, filter) {
			state.filters.text = filter;
		},
		SET_CATEGORY_FILTER(state, categories) {
			state.filters.categories = categories;
		},
		SET_CATEGORIES(state, categories) {
			let sortedCategories = categories.sort((a, b) =>
				a.name < b.name ? -1 : 1
			);

			// assign colors to main categories
			let mainCategories = sortedCategories.filter(
				cat => cat.categoryTypeName === "Learn-Main"
			);

			let nColors = state.categoryColors.length;

			// assign all categories default color in case categories have no main category
			categories.forEach(cat => {
				cat.color = state.allFilterColor;
			});

			mainCategories.forEach((cat, i) => {
				cat.color = state.categoryColors[i % nColors];
			});

			state.categories = sortedCategories;
		},
		SET_BOOKMARKS(state, bookmarks) {
			bookmarks.forEach(bookmark => {
				let mainCategory = bookmark.Categories.find(cat => {
					return cat.categoryTypeName === "Learn-Main"
				});

				if (mainCategory) {
					let mainCategoryWithColor = state.categories.find(cat => {
						return cat.id === mainCategory.id;
					});

					bookmark.mainCategory = mainCategoryWithColor;
				} else {
					bookmark.mainCategory = {
						color: state.allFilterColor
					};
				}
			});

			state.bookmarks = bookmarks;
		},
		ADD_BOOKMARK(state, bookmark) {
			state.bookmarks.push(bookmark);
		}
	},
	getters: {
		articles: state => {
			return state.articles;
		},
		categories: state => {
			return state.categories;
		},
		bookmarks: state => {
			return state.bookmarks;
		},
		categoryFilters: state => {
			return state.filters.categories;
		},
		textFilter: state => {
			return state.filters.text;
		},
		allFilterColor: state => {
			return state.allFilterColor;
		}
	},
	actions: {
		searchArticles: ({ dispatch, commit, state }, filterOptions) => {
			commit("SET_OPERATION_PENDING", state);
			return new Promise(function(resolve, reject) {
				let catIds = state.filters.categories.map(cat => {
					return cat.id;
				});

				let params = {
					search: state.filters.text,
					categories: catIds
				};

				if(filterOptions) {
					params.search = filterOptions.text ? filterOptions.text : "";
					params.categories = filterOptions.catIds ? filterOptions.catIds : [];
				}

				learnService.getLearnContent(params).then(
					d => {
						commit("SET_ARTICLES", d);
						commit("SET_OPERATION_FINISHED", state);
						resolve();
					},
					e => reject(e)
				);
			});
		},
		setTextFilter: ({ commit, dispatch }, text) => {
			commit("SET_TEXT_FILTER", text);
			dispatch("searchArticles");
		},
		setCategoryFilter({ commit, dispatch }, categories) {
			commit("SET_CATEGORY_FILTER", categories);
			dispatch("searchArticles");
		},
		getArticle: ({ dispatch, commit, state }, articleId) => {
			commit("SET_OPERATION_PENDING", state);
			return new Promise(function(resolve, reject) {
				let cached = find(state.fullArticles, r => {
					return articleId == r.id;
				});

				if (cached) {
					commit("SET_OPERATION_FINISHED", state);
					resolve(cached);
				} else {
					learnService.getSingleContentById(articleId).then(d => {
						commit("SET_ARTICLE", d);
						commit("SET_OPERATION_FINISHED", state);
						resolve(d);
					});
				}
			});
		},
		getCategories: ({ dispatch, commit, state }) => {
			commit("SET_OPERATION_PENDING", state);
			return new Promise((resolve, reject) => {
				learnService.getCategories().then(
					d => {
						commit("SET_CATEGORIES", d);
						commit("SET_OPERATION_FINISHED", state);
						resolve();
					},
					e => reject(e)
				);
			});
		},
		getBookmarks: ({ dispatch, commit, state }) => {
			commit("SET_OPERATION_PENDING", state);
			return new Promise((resolve, reject) => {
				learnService.getBookmarks().then(
					d => {
						commit("SET_BOOKMARKS", d);
						commit("SET_OPERATION_FINISHED", state);
						resolve();
					},
					e => reject(e)
				);
			});
		},
		addBookmark: ({ dispatch, commit, state }, article) => {
			// check for duplicates
			if (!state.bookmarks.find(b => b.resourceId === article.id)) {
				let newBookmark = {
					resourceId: article.id,
					Title: article.title,
					Categories: article.categories
				};

				commit("ADD_BOOKMARK", newBookmark);
				commit("SET_BOOKMARKS", state.bookmarks);
			}

			commit("SET_OPERATION_PENDING", state);
			return new Promise((resolve, reject) => {
				learnService.addBookmark(article.id).then(
					d => {
						commit("SET_OPERATION_FINISHED", state);
						resolve(d);
					},
					e => {
						dispatch("getBookmarks");
						reject(e);
					}
				);
			});
		},
		removeBookmark: ({ dispatch, commit, state }, articleId) => {
			// remove them visually
			let newBookmarks = state.bookmarks.filter(
				b => b.resourceId !== articleId
			);
			commit("SET_BOOKMARKS", newBookmarks);

			// actually remove them
			commit("SET_OPERATION_PENDING", state);
			return new Promise((resolve, reject) => {
				learnService.removeBookmark(articleId).then(
					d => {
						commit("SET_OPERATION_FINISHED", state);
						resolve(d);
					},
					e => {
						// rollback and return bookmarks
						dispatch("getBookmarks");
						reject(e);
					}
				);
			});
		},
		createActionFromArticle: ({ commit, state }, payload) => {
			commit("SET_OPERATION_PENDING", state);
			return new Promise((resolve, reject) => {
				learnService.createActionFromArticle(payload).then(
					() => {
						commit("SET_OPERATION_FINISHED", state);
						resolve();
					},
					e => reject(e)
				);
			});
		}
	}
};
