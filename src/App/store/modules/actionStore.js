/* eslint-disable prettier/prettier */
import Vue from "vue";
import * as actionService from "@/Common/services/ActionService";
import * as planService from "@/Common/services/PlanService";
import * as commentService from "@/Common/services/CommentService";
import _ from "lodash";
import Dates from "@/Common/functions/Dates";
import axios from "axios";
const uuid = require("uuid/v4");

// Debounce timeout for actions reorder
export const DEBOUNCE_REORDER_TIMEOUT = 2000;

// Function to handle nulls
function handleNullOrders(actions, nullsOrdersCount) {
	const actionsCopy = _.cloneDeep(actions);
	const minimumOrder = Math.min(...actionsCopy.map(a => a.order)) || 0;

	for (
		let i = 0, order = minimumOrder - nullsOrdersCount;
		i < actionsCopy.length;
		i++
	) {
		if (
			actionsCopy[i].order === null ||
			actionsCopy[i].order === undefined
		) {
			actionsCopy[i].order = order;
			actionsCopy[i].unsavedOrder = true;
			order++;
		}
	}

	return actionsCopy;
}

const state = {
	// If Initial load is finished
	actionStoreReady: false,

	// If state change is being saved to server
	isOperationReady: true,

	actionFilters: {
		showAll: false, // when true ignore everything else, else use other filters
		myActions: false,
		showPlans: [], //show all if empty, either put in planIds of plans you want to display
		actionCompleted: false, // null show all, true show only complete, false show only non complete,
		sortBy: "order" // sort by a specific column order | start | end
	},
	actions: [],
	actionsOrdersCopy: [],
	actionsOrderRequestToken: null,
	planActions: [],
	plans: [],
	plansColors: [
		"#B359A4",
		"#2389C7",
		"#82B960",
		"#DE8E30",
		"#E1C014",
		"#B54E4E"
	],

	// Lightbox data
	lightboxImages: [],
	lightboxVisible: false
};

const mutations = {
	RESET_ACTION_STORE(state) {
		state.actionStoreReady = false;
	},
	LOADING_ACTION_COMPLETE(state) {
		state.actionStoreReady = true;
	},
	SET_OPERATION_PENDING(state) {
		state.isOperationReady = false;
	},
	SET_OPERATION_FINISHED(state) {
		state.isOperationReady = true;
	},
	SET_PLAN_ACTIONS(state, actions) {
		state.planActions = actions;
		state.isOperationReady = true;
	},
	SET_PLANS(state, plans) {
		state.plans = plans;
		state.isOperationReady = true;
	},
	SET_EDIT_MODE(state, { actionId, mode }) {
		const action = state.actions.find(action => action.id === actionId);
		action.editMode = mode;
	},
	SET_LIGHTBOX_DATA(state, { images, visible }) {
		if (images) {
			state.lightboxImages = images;
		} else {
			state.lightboxImages = [];
		}

		state.lightboxVisible = visible;
	},
	REMOVE_PLAN(state, planId) {
		_.remove(state.plans, p => p.id == planId);
		state.isOperationReady = true;
	},
	SET_ACTIONS(state, actions) {
		state.actions = actions;
		state.isOperationReady = true;
	},
	SET_ACTIONS_ORDER_REQUEST_TOKEN(state, token) {
		state.actionsOrderRequestToken = token;
	},
	// Update actions copy
	UPDATE_ACTIONS_COPY(state) {
		state.actionsOrdersCopy = state.actions.map(a => {
			return _.pick(a, ["id", "order", "unsavedOrder"]);
		});
	},
	PLAN_ACTION_SUCCESS(state, payload) {
    let action = state.actions.find(action => action.id === payload.id);
		if (payload) {
			action.planStart = payload.planStart;
			action.planFinish = payload.planFinish;
			action.planLane = payload.planLane;
		}

		state.isOperationReady = true;
  },
  PLAN_ACTIONS_SUCCESS(state, payload) {
    payload.forEach( p => {
      let action = state.actions.find(action => action.id === p.id);
      if (p) {
        action.planStart = p.planStart;
        action.planFinish = p.planFinish;
        action.planLane = p.planLane;
      }

      state.isOperationReady = true;
    })
  },
	PLAN_ACTION_FAILED(state, payload) {
		let action = state.actions.find(action => action.id === payload.id);
		if (payload) {
			action.planStart = payload.planStart;
			action.planFinish = payload.planFinish;
			action.planLane = payload.planLane;
		}

		state.isOperationReady = true;
  },
  PLAN_ACTIONS_FAILED(state, payload) {
    payload.forEach( p => {
      let action = state.actions.find(action => action.id === p.id);
      if (p) {
        action.planStart = p.planStart;
        action.planFinish = p.planFinish;
        action.planLane = p.planLane;
      }

      state.isOperationReady = true;
    })
  },
	// change state temporarily
	PLAN_ACTION_PENDING(state, payload) {
		let action = state.actions.find(action => action.id === payload.id);

		if (payload) {
			action.planStart = payload.planStart;
			action.planFinish = payload.planFinish;
			action.planLane = payload.planLane;
		}
  },
  PLAN_ACTIONS_PENDING(state, payload) {
    payload.forEach( p => {
      let action = state.actions.find(action => action.id === p.id);
      if (p) {
        action.planStart = p.planStart;
        action.planFinish = p.planFinish;
        action.planLane = p.planLane;
      }      
    })
  },
	SET_ACTION_DATES(state, { startDate, finishDate, actionId }) {
		const action = state.actions.find(a => a.id === actionId);

		if (action) {
			action.planStart = startDate ? startDate : action.planStart;
			action.planFinish = finishDate ? finishDate : action.planFinish;
		}
	},
	START_ACTION_SUCCESS(state, payload) {
		let action = state.actions.find(action => action.id === payload.id);
		action.startedOn = Dates.getUtcNow();
		action.completed = null;
		action.finishedOn = null;
		state.isOperationReady = true;
	},
	FINISH_ACTION_SUCCESS(state, payload) {
		let action = state.actions.find(action => action.id === payload.id);
		action.completed = true;
		action.finishedOn = Dates.getUtcNow();
		state.isOperationReady = true;
	},
	CANCEL_ACTION_SUCCESS(state, payload) {
		let action = state.actions.find(action => action.id === payload.id);
		action.startedOn = null;
		action.completed = null;
		action.finishedOn = null;
		state.isOperationReady = true;
	},
	SKIP_ACTION_SUCCESS(state) {
		state.isOperationReady = true;
	},
	ASSIGN_TASK_SUCCESS(state, payload) {
		let action = state.actions.find(action => action.id === payload.id);
		action.assignedUserId = payload.assignedUserId;
		state.isOperationReady = true;
	},
	ADD_ACTION_SUCCESS(state, payload) {
		state.actions.unshift(payload);
		state.isOperationReady = true;
	},
	// Replace unsaved dummy with saved action
	REPLACE_ACTION_SUCCESS(state, action) {
		const actionToUpdate = state.actions.find(
			act => act.transitionId === action.transitionId
		);

		Object.keys(action).forEach(key => {
			if (actionToUpdate[key] !== undefined) {
				actionToUpdate[key] = action[key];
			} else {
				Vue.set(actionToUpdate, key, action[key]);
			}
		});

		actionToUpdate.unsaved = false;
		state.isOperationReady = true;
	},
	// Update actions
	UPDATE_ACTIONS_ORDER(state, { actions, unsaved }) {
		// Update order and mark unsaved
		actions.forEach(action => {
			const actionToUpdate = state.actions.find(
				act => act.id === action.id
			);
			actionToUpdate.order = action.order;
			actionToUpdate.unsavedOrder = unsaved;
		});
	},
	// Change action title
	CHANGE_ACTION_TITLE(state, { id, title }) {
		const action = state.actions.find(action => action.transitionId === id);
		if (action) {
			action.title = title;
		}
		state.isOperationReady = true;
	},
	// Add dummy unsaved action
	ADD_UNSAVED_ACTION(state, payload) {
		state.actions.unshift(payload);
	},
	// Clear all unsaved actions
	CLEAR_UNSAVED_ACTIONS(state) {
		state.actions = state.actions.filter(
			action => action.title || !action.unsaved
		);
	},
	ADD_ACTION_FAIL(state) {
		state.isOperationReady = true;
	},
	REMOVE_ACTION(state, actionId) {
		const i = _.findIndex(state.actions, p => {
			return p.id == actionId;
		});

		state.actions.splice(i, 1);
		// state.actionFilters.showAll = false;
		// state.actionFilters.showAll = true;
		state.isOperationReady = true;
	},
	CHANGE_PLAN(state, action) {
		const act = state.actions.find(act => act.id === action.id);
		if (act) {
			act.planId = action.planId;
			act.planName = action.planName;
		}

		if (action.actions && action.actions.length) {
			action.actions.forEach(subact => {
				const subaction = state.actions.find(
					act => act.id === subact.id
				);

				if (subaction) {
					subaction.planId = action.planId;
					subaction.planName = action.planName;
				}
			});
		}

		state.isOperationReady = true;
	},
	ACTION_FILTER_CLEAR(state) {
		state.actionFilters = {
			showAll: false,
			myActions: false,
			showPlans: []
		};
	},
	ACTION_FILTER_MY_ACTIONS(state, payload) {
		// state.actionFilters.showAll = false;
		state.actionFilters.myActions = payload;
	},
	ACTION_FILTER_COMPLETED(state, payload) {
		state.actionFilters.actionCompleted = payload;
	},
	ACTION_FILTER_ADD_PLAN(state, planId) {
		//state.actionFilters.showAll = false;
		let p = state.actionFilters.showPlans.indexOf(planId);
		if (p === -1) {
			state.actionFilters.showPlans.push(planId);
		}
	},
	ACTION_FILTER_REMOVE_PLAN(state, planId) {
		//state.actionFilters.showAll = false;
		let i = state.actionFilters.showPlans.indexOf(planId);
		if (i !== -1) {
			state.actionFilters.showPlans.splice(i, 1);
		}
	},
	ACTION_FILTER_SORT_By(state, payload) {
		state.actionFilters.sortBy = payload;
	},
	ACTION_CHANGE_TOGGLE(state, payload) {
		let action = state.actions.find(action => action.id === payload.id);
		Vue.set(action, "expanded", payload.isExpanded);
	},
	SET_UNREAD_COMMENTS(state, payload) {
		payload.map(actionid => {
			let currentAction = state.actions.find(action => {
				return action.id === actionid.resourceId;
			});

			// update unread commments
			currentAction.unreadComments = actionid.totalUnread;
			currentAction.totalComments = actionid.totalComments;
			currentAction.hasAttachment = actionid.hasAttachment;

			return currentAction;
		});
	},
	UPDATE_TOTAL_COMMENTS(state, payload) {
		let currentAction = state.actions.find(action => {
			return action.id === payload;
		});

		// update comment values
		currentAction.totalComments += 1;
	},
	UPDATE_UNREAD_COMMENTS(state, payload) {
		let currentAction = state.actions.find(action => {
			return action.id === payload;
		});

		// update unread comments
		currentAction.unreadComments = 0;
	},
	UPDATE_PLAN(state, updatedPlan) {
		let index = state.plans.findIndex(p => p.id === updatedPlan.id);
		if (index !== -1) {
			state.plans.splice(index, 1, updatedPlan);
		}
		state.isOperationReady = true;
	}
};

const actions = {
	initAction: ({ dispatch, commit, state, rootState }) => {
		if (state.actionStoreReady) {
			//only load once
			return;
		}
		dispatch("refreshActionStore");
	},
	refreshActionStore: ({ commit, dispatch, rootState }) => {
		let teamId = rootState.teamStore.currentTeamId;
		commit("SET_OPERATION_PENDING");
		dispatch("getActions", teamId).then(() => {
			dispatch("getUnreadComments");
		});
		dispatch("getPlanActions", teamId);
		dispatch("getPlans", teamId);
	},
	getPlans: ({ commit, state }, teamId) => {
		planService.getPlans({ teamId }).then(actions => {
			commit("SET_OPERATION_PENDING");
			commit("SET_PLANS", actions);
		});
	},
	removePlan: ({ dispatch, commit }, payload) => {
		return new Promise((resolve, reject) => {
			commit("SET_OPERATION_PENDING");
			planService
				.removePlan(payload)
				.then(d => {
					commit("ACTION_FILTER_REMOVE_PLAN", payload.planId);
					commit("REMOVE_PLAN", payload.planId);
					dispatch("refreshActionStore");
					resolve();
				})
				.catch(e => reject(e));
		});
	},
	getPlanActions: ({ dispatch, commit, state }, teamId) => {
		planService.getPlanActions({ teamId }).then(actions => {
			commit("SET_PLAN_ACTIONS", actions);
		});
	},
	getActions: ({ dispatch, commit, state }, teamId) => {
		return new Promise((resolve, reject) => {
			actionService.getActions({ teamId }).then(actions => {
				// Generate IDs for transitions
				actions = actions.map(a => {
					a.transitionId = uuid();
					a.editMode = false;
					a.unreadComments = 0;
					a.totalComments = 0;
					a.hasAttachment = false;

					return a;
				});

				if (!actions || !actions.length) {
					commit("SET_ACTIONS", []);
					commit("LOADING_ACTION_COMPLETE");
					resolve();
				}

				// Handle null orders
				if (
					actions.every(
						a => a.order !== null && a.order !== undefined
					)
				) {
					// Nothing to do
					commit("SET_ACTIONS", actions);
				} else {
					// Group them
					const activityGroups = _.groupBy(actions, "parentId");

					// Parent level actions
					const activities = activityGroups["null"];

					// Some bug occured - only child actions are present
					if (!activities || activities.length === 0) {
						commit("SET_ACTIONS", []);
						commit("LOADING_ACTION_COMPLETE");
						resolve();
					}

					const nullsOrdersCount = activities.reduce((acc, cur) => {
						return cur.order === null ? acc + 1 : acc;
					}, 0);

					// Order parents of needed
					if (nullsOrdersCount) {
						activityGroups["null"] = handleNullOrders(
							activities,
							nullsOrdersCount
						);
					}

					// Order subactions if needed
					activities.forEach(activity => {
						// Find subactions
						let subActions = activityGroups[activity.id];

						if (subActions) {
							// Find if there are nulled orders in subactions
							const nullsOrdersCount = subActions.reduce(
								(acc, cur) => {
									return cur.order === null ? acc + 1 : acc;
								},
								0
							);

							// Handle them
							if (nullsOrdersCount) {
								activityGroups[activity.id] = handleNullOrders(
									subActions,
									nullsOrdersCount
								);
							}
						}
					});

					// Flatten the groups and commit them
					let result = [];
					Object.keys(activityGroups).forEach(key => {
						result.push(...activityGroups[key]);
					});

					commit("SET_ACTIONS", result);
				}

				commit("LOADING_ACTION_COMPLETE");

				resolve();
			});
		});
	},
	getUnreadComments: ({ dispatch, commit, state }) => {
		return new Promise((resolve, reject) => {
			let comments = state.actions.map(action => action.id);

			commentService.getUnreadComments(comments).then(actions => {
				commit("SET_UNREAD_COMMENTS", actions);
				resolve();
			});
		});
	},
	updateTotalComments: ({ commit }, actionId) => {
		return new Promise(resolve => {
			commit("UPDATE_TOTAL_COMMENTS", actionId);
			resolve();
		});
	},
	updateUnreadComments: ({ commit }, actionId) => {
		return new Promise(resolve => {
			commit("UPDATE_UNREAD_COMMENTS", actionId);
			resolve();
		});
	},
	reorderActions: ({ state, getters, commit, rootState }) => {
		return new Promise((resolve, reject) => {
			commit("SET_OPERATION_PENDING");

			// Save request cancel token in order to be able to cancel it
			commit(
				"SET_ACTIONS_ORDER_REQUEST_TOKEN",
				axios.CancelToken.source()
			);

			// Find all actions with unsaved order
			const actions = getters.actionsWithUnsavedOrder;

			// Update actions
			actionService
				.reorderActions({
					actions,
					teamId: rootState.teamStore.currentTeamId,
					cancelToken: state.actionsOrderRequestToken
				})
				.then(actions => {
					// Success - actions were updated => update actions copy
					commit("UPDATE_ACTIONS_ORDER", { actions, unsaved: false });
					commit("UPDATE_ACTIONS_COPY");
					resolve();
				})
				.catch(error => {
					// Fail - rollback, if request wasn't simply cancelled
					if (error !== "cancelled") {
						commit("UPDATE_ACTIONS_ORDER", {
							actions: state.actionsOrdersCopy,
							unsaved: false
						});
					}
					reject(error);
				})
				.finally(() => {
					commit("SET_OPERATION_FINISHED");
				});
		});
	},

	setEditMode: ({ commit }, payload) => {
		commit("SET_EDIT_MODE", payload);
	},
	planAction: ({ state, dispatch, commit }, payload) => {
		return new Promise((resolve, reject) => {
			commit("SET_OPERATION_PENDING");

      // save old action in case of revert
      let oldActions = [getters.getActionbyId(payload.id)];    
      let allChangedActions = [payload];

      // check and update child actions (if needed)
      if (payload.actions) {
        // iterate through each subaction
        payload.actions.forEach(subAction => {
          
          // if they have dates 
          if (subAction.planStart && subAction.planFinish) {
            let subActionStart = subAction.planStart;
            let subActionFinish = subAction.planFinish;

            let newStart = subActionStart;
            let newFinish = subActionFinish;
            let change = false;

            if (Dates.smallerThan(subActionStart, payload.planStart)) {
              newStart = payload.planStart;
              change = true;
            }

            if (Dates.largerThan(subActionStart, payload.planFinish)) {
              newStart = payload.planFinish;
              change = true;
            }

            if (Dates.largerThan(subActionFinish, payload.planFinish)) {
              newFinish = payload.planFinish;
              change = true;
            }

            if (Dates.smallerThan(subActionFinish, payload.planStart)) {
              newFinish = payload.planStart;
              change = true;
            }

            // update activities if changed
            if (change) {
              // if change is true
              let updatedSubAction = {
                ...subAction,
                planStart: newStart,
                planFinish: newFinish,
              }
              allChangedActions.push(updatedSubAction);

              // store previous action in case of rollback
              oldActions.push(subAction);
            }
          }
        });
      }

      // check and update parent actions (if needed)
      if (payload.parentId) {
        let parent = state.actions.find(
          action => action.id === payload.parentId
        );

        let parentStart = parent.planStart ? parent.planStart : payload.planStart;
        let parentFinish = parent.planFinish ? parent.planFinish : payload.planStart;

        let newStart = parentStart;
        let newFinish = parentFinish;
        let change = false;

        if (Dates.largerThan(parentStart, payload.planStart)) {
          newStart = payload.planStart;
          change = true;
        }

        if (Dates.smallerThan(parentFinish, payload.planFinish)) {
          newFinish = payload.planFinish;
          change = true;
        }

        // update parent if changed
        if (change) {
          let updatedParentAction = {
            ...parent,
            planStart: newStart,
            planFinish: newFinish,
          }

          allChangedActions.push(updatedParentAction);

          // keep old actions in case of rollback
          oldActions.push(parent);
        }
      }

      commit("PLAN_ACTIONS_PENDING", allChangedActions);
			actionService
				.planActions(allChangedActions)
				.then(updatedActions => {
					commit("PLAN_ACTIONS_SUCCESS", updatedActions);
					resolve();
				})
				.catch(e => {
					commit("PLAN_ACTIONS_FAILED", oldActions);
					reject(e);
				});
		});
	},
	startAction: ({ commit }, payload) => {
		commit("SET_OPERATION_PENDING");
		actionService.startAction(payload).then(() => {
			commit("START_ACTION_SUCCESS", payload);
		});
	},
	finishAction: ({ commit }, payload) => {
		commit("SET_OPERATION_PENDING");

		let allActions = [payload];
		if (payload.actions) {
			allActions = allActions.concat(payload.actions);
		}
		if (payload.hiddenActions) {
			allActions = allActions.concat(payload.hiddenActions);
		}

		actionService.finishAction(allActions).then(() => {
			allActions.forEach(a => {
				commit("FINISH_ACTION_SUCCESS", a);
			});
		});
	},
	cancelAction: ({ commit }, payload) => {
		commit("SET_OPERATION_PENDING");
		actionService.cancelAction(payload).then(() => {
			commit("CANCEL_ACTION_SUCCESS", payload);
		});
	},
	skipAction: ({ commit }, payload) => {
		commit("SET_OPERATION_PENDING");
		actionService.skipAction(payload).then(() => {
			commit("SKIP_ACTION_SUCCESS");
		});
	},
	assignTask: ({ commit }, payload) => {
		commit("SET_OPERATION_PENDING");
		return new Promise((resolve, reject) => {
			actionService.assignTask(payload).then(() => {
				commit("ASSIGN_TASK_SUCCESS", payload);
				resolve();
			});
		});
	},
	changePlan({ commit }, { activity: action, plan }) {
		commit("SET_OPERATION_PENDING");
		return new Promise((resolve, reject) => {
			if (action) {
				const editedAction = {
					...action,
					planName: plan.label,
					planId: plan.id
				};
				actionService
					.changePlan(editedAction)
					.then(() => {
						// Update action in store
						commit("CHANGE_PLAN", editedAction);
						resolve();
					})
					.catch(err => {
						reject(err);
					});
			} else {
				reject("No action provided");
			}
		});
	},
	updatePlan({ commit }, payload) {
		commit("SET_OPERATION_PENDING");
		return new Promise((resolve, reject) => {
			planService
				.updatePlan(payload)
				.then(res => {
					commit("UPDATE_PLAN", res);
					resolve();
				})
				.catch(e => reject(e));
		})
	},
	changeActionTitle({ commit }, action) {
		commit("SET_OPERATION_PENDING");
		return new Promise((resolve, reject) => {
			if (action) {
				actionService
					.changeActionTitle(action)
					.then(() => {
						// Update action in store
						commit("CHANGE_ACTION_TITLE", {
							id: action.transitionId,
							title: action.title
						});
						resolve();
					})
					.catch(err => {
						reject(err);
					});
			} else {
				reject("No action provided");
			}
		});
	},
	removeAction: ({ commit }, payload) => {
		commit("SET_OPERATION_PENDING");
		return new Promise((resolve, reject) => {
			actionService.removeAction(payload).then(d => {
				commit("REMOVE_ACTION", payload.id);
				resolve();
			});
		});
	},
	createUnsavedAction: (
		{ dispatch, commit, rootState, state, getters },
		parentId
	) => {
		return new Promise((resolve, reject) => {
			// Reject if no plans in state
			if (!getters.plans || !getters.plans.length) {
				reject();
			}

			const transitionId = uuid();
			let teamId = rootState.teamStore.currentTeamId;

			const dummyAction = {
				transitionId,
				parentId: parentId || null,
				title: "",
				teamId: teamId,
				unsaved: true
			};

			if (parentId) {
				// Subaction dummies should be at the bottom
				dummyAction.order =
					getters.getBoundaryOrder("max", parentId) + 1;

				let parentAction = getters.getActionbyId(parentId);
				dummyAction.planId =
					(parentAction && parentAction.planId) || "";
				dummyAction.planName =
					(parentAction && parentAction.planName) || "";
			} else {
				// Get a plan for action
				let allPlan = _.every(getters.plans, ["filterBy", false]);
				let plan = allPlan
					? getters.plans[0]
					: _.filter(getters.plans, p => {
							return p.filterBy;
					  })[0];
				dummyAction.planId = plan.id;
				dummyAction.planName = plan.label;

				// Action dummies should be at the top
				dummyAction.order = getters.getBoundaryOrder("min") - 1;
			}

			commit("ADD_UNSAVED_ACTION", dummyAction);

			resolve(transitionId);
		});
	},
	createAction: ({ commit }, originalAction) => {
		commit("SET_OPERATION_PENDING");
		return new Promise((resolve, reject) => {
			actionService
				.createAction(originalAction)
				.then(action => {
					// Create new or replace dummy
					if (originalAction.unsaved) {
						action.transitionId = originalAction.transitionId;
						action.editMode = false;
						commit("REPLACE_ACTION_SUCCESS", action);
					} else {
						action.transitionId = uuid();
						action.editMode = false;
						commit("ADD_ACTION_SUCCESS", action);
					}
					resolve(action);
				})
				.catch(err => {
					commit("ADD_ACTION_FAIL", err);
					reject(err);
				});
		});
	},
	createActionFromPlan: ({ commit }, payload) => {
		commit("SET_OPERATION_PENDING");
		return new Promise((resolve, reject) => {
			actionService.createActionFromPlanAction(payload).then(response => {
				response.forEach(a => {
					// Assign id
					a.transitionId = uuid();
					a.editMode = false;
					a.order = getters.getBoundaryOrder("min") - 1;
					commit("ADD_ACTION_SUCCESS", a);
				});
				resolve();
			});
		});
	},
	setActionCompleteFilter: ({ commit, state }, payload) => {
		commit("ACTION_FILTER_COMPLETED", payload);
	},
	toggleMyActions: ({ commit, state }, status) => {
		commit("ACTION_FILTER_MY_ACTIONS", status);
	},
	togglePlanFilter: ({ commit, state }, planId) => {
		let pos = state.actionFilters.showPlans.indexOf(planId);
		if (pos === -1) {
			commit("ACTION_FILTER_ADD_PLAN", planId);
		} else {
			commit("ACTION_FILTER_REMOVE_PLAN", planId);
		}
	},
	toggleActivity: ({ commit }, payload) => {
		commit("ACTION_CHANGE_TOGGLE", payload);
	},
	changeSort: ({ commit, state }, column) => {
		commit("ACTION_FILTER_SORT_By", column);
	}
};

const getters = {
	plans: state => {
		return _.map(state.plans, p => {
			let pf = p;
			if (state.actionFilters.showPlans.indexOf(p.id) !== -1) {
				pf.filterBy = true;
			} else {
				pf.filterBy = false;
			}
			return pf;
		});
	},
	plansExceptId: state => planId =>
		state.plans.filter(plan => plan.id !== planId),
	planActionsByCategory: state => {
		return _.groupBy(state.planActions, a => {
			if (a.resource && a.resource.categories.length > 0) {
				return a.resource.categories[0].name;
			}
			return "Uncategorized";
		});
	},
	planCompleteCount: state => planId => {
		let completeActions = _.filter(state.actions, a => {
			return a.completed && !a.unsaved && a.planId === planId;
		});

		let planActions = _.filter(state.actions, a => {
			return !a.unsaved && a.planId === planId;
		});

		return Math.round((completeActions.length / planActions.length) * 100);
	},

	// Actions with unsaved order
	actionsWithUnsavedOrder: state =>
		state.actions
			.filter(a => a.unsavedOrder === true && !a.unsaved)
			.map(a => {
				return { id: a.id, order: a.order };
			}),

	// Get min/max order value
	getBoundaryOrder: (state, getters) => (boundary, parentActionId) => {
		// We look for a value either in actions or subactions
		let actionsScope;

		if (parentActionId) {
			const parentAction = getters.actions.find(
				action => action.id === parentActionId
			);

			if (parentAction) {
				actionsScope = parentAction.actions;
			}
		} else {
			actionsScope = getters.actions;
		}

		// If we actually have actions
		if (actionsScope && actionsScope.length) {
			const orders = actionsScope.map(action => action.order);

			switch (boundary) {
				case "max":
					return Math.max(...orders);
				case "min":
					return Math.min(...orders);
				default:
					return 0;
			}
		}

		return 0;
	},
	hasSubactions: (state, getters) => id => {
		const action = getters.actions.find(act => act.id === id);
		return Boolean(action.actions && action.actions.length);
	},
	editMode: (state, getters) => actionId => {
		const action = getters.getActionbyId(actionId);
		return action.editMode;
	},
	actions: (state, getters, rootState, rootGetters) => {
		let currentUserId = rootGetters.userId;
		let filteredActions = state.actions.map(action => {
			return { ...action };
		});

		filteredActions = state.actionFilters.showAll
			? filteredActions
			: _.chain(filteredActions)
					// Show only my actions
					.filter(a => {
						if (
							state.actionFilters.myActions &&
							a.assignedUserId !== currentUserId
						) {
							return false;
						}
						return true;
					})
					//Filter by plan Ids
					.filter(a => {
						if (state.actionFilters.showPlans.length === 0) {
							return true;
						}
						if (
							state.actionFilters.showPlans.indexOf(a.planId) !==
							-1
						) {
							return true;
						}
					})
					.filter(a => {
						if (state.actionFilters.actionCompleted == null) {
							return true;
						}
						if (
							state.actionFilters.actionCompleted == a.completed
						) {
							return true;
						}
						if (
							!state.actionFilters.actionCompleted &&
							!a.completed
						) {
							return true;
						}
					})
					.value();

		var activityGroups = _.groupBy(filteredActions, "parentId");

		// Parent level actions
		var activities = activityGroups["null"];
		if (!activities) {
			return null;
		}

		//customize order
		switch (state.actionFilters.sortBy) {
			case "start":
				activities = _.sortBy(activities, ["planStart"]);
				break;
			case "end":
				activities = _.sortBy(activities, a => a.planFinish);
				break;
			default:
				activities.sort((a, b) => a.order - b.order);
		}

		activities.forEach(activity => {
			let actions = activityGroups[activity.id];
			if (actions) {
				actions.sort((a, b) => a.order - b.order);
				activity.actions = actions;

				// if (actions.length == 1) {
				//     //merge it in instead
				//
				//     activity.contentResourceId = actions[0].contentResourceId;
				//     activity.title = actions[0].title //+ '(A)'
				//     activity.hiddenActions = actions;
				// } else {
				//     activity.actions = actions;
				// }
			}
		});

		return activities;
	},
	getActionbyId: state => id => {
		return state.actions.find(action => action.id === id);
	},
	getActionByTransitionId: state => id => {
		return state.actions.find(action => action.transitionId === id);
	},
	getActionIndexById: state => id => {
		return state.actions.findIndex(action => action.id === id);
	},
	getActionIndexByTransitionId: state => id => {
		return state.actions.findIndex(action => action.transitionId === id);
	},
	getPlanbyId: state => id => {
		return state.plans.find(plan => plan.id === id);
	},
	getPlanColor: (state, getters) => id => {
		const plan = getters.getPlanbyId(id);
		if (plan && plan.position) {
			const color = state.plansColors[plan.position];
			return color ? color : state.plansColors[0];
		}

		return state.plansColors[0];
	}
};

export default {
	state,
	mutations,
	actions,
	getters
};
