import { DateTime, IANAZone } from "luxon";
import DateLib from "@/Common/functions/Dates";

//TODO move to date lib
function getSmaller(current, contendant) {
	let curr = DateTime.fromISO(current).setZone("Australia/Melbourne");
	let conn = DateTime.fromISO(contendant).setZone("Australia/Melbourne");
	if (conn < curr) {
		return conn;
	}
	return curr;
}

function getLarger(current, contendant) {
	let curr = DateTime.fromISO(current).setZone("Australia/Melbourne");
	let conn = DateTime.fromISO(contendant).setZone("Australia/Melbourne");
	if (conn > curr) {
		return conn;
	}
	return curr;
}

function getDuration(startDate, endDate) {
	let start = DateTime.fromISO(startDate);
	let end = DateTime.fromISO(endDate);
	let dur = end.diff(start, "days").toObject();
	return dur.days + 1;
}

//   this.timelineStart
function getStartX(startPoint, startDate) {
	let start = DateTime.fromISO(startPoint);
	let end = DateTime.fromISO(startDate);
	let dur = end.diff(start, "days").toObject();
	return Math.round(dur.days);
}

const state = {
	dragMode: false,

	changeMode: null,
	changingAction: null,
	offsetX: null,
	initialXPos: null,

	options: {
		unit: 50,
		largeUnit: 50,
		calendar: {
			rowHeight: 60
		},
		activities: {
			heightStart: 30 * 2, // this should update based on cal height
			height: 60
		}
	},
	viewWindow: {
		minX: 0,
		maxX: 0,
		width: 0
	},
	scrollY,
	split: 40,
	todayPosition: null
};

const mutations = {
	DRAG_START(state) {
		state.dragMode = true;
	},
	DRAG_END(state) {
		state.dragMode = false;
	},
	RESIZE_START(state) {
		state.resizeMode = true;
	},
	RESIZE_END(state) {
		state.resizeMode = false;
	},
	SET_RESIZE_CARET(state, caret) {
		state.resizeCaret = caret;
	},
	SET_RESIZE_START_X(state, x) {
		state.resizeStartX = x;
	},
	SET_RESIZE_ACTION_ID(state, id) {
		state.resizeActionId = id;
	},
	EXPAND_START(state) {
		state.expandMode = true;
	},
	EXPAND_END(state) {
		state.expandMode = false;
	},
	CHANGE_ZOOM(state, z) {
		state.options.unit = z;
	},
	CHANGE_SPLIT(state, x) {
		state.split = x;
	},
	CHANGE_VIEW_WINDOW(state, viewWindow) {
		state.viewWindow = viewWindow;
	},
	CHANGE_SCROLL_Y(state, y) {
		state.scrollY = y;
	},
	SET_CHANGE_MODE(state, change) {
		state.changeMode = change;
	},
	SET_CHANGING_ACTION(state, action) {
		state.changingAction = action;
	},
	SET_OFFSET_X(state, x) {
		state.offsetX = x;
	},
	SET_INITIAL_X_POS(state, xPos) {
		state.initialXPos = xPos;
	}
};
const actions = {
	setZoom({ commit }, level) {
		commit("CHANGE_ZOOM", level);
	},
	dragStarted({ commit }) {
		commit("DRAG_START");
	},
	dragEnded({ commit }) {
		commit("DRAG_END");
	},
	resizeStarted({ commit }) {
		commit("DRAG_START");
		commit("RESIZE_START");
	},
	resizeEnded({ commit }) {
		commit("RESIZE_END");
		commit("DRAG_END");
	},
	setResizeCaret({ commit }, caret) {
		commit("SET_RESIZE_CARET", caret);
	},
	setResizeStartX({ commit }, x) {
		commit("SET_RESIZE_START_X", x);
	},
	setResizeActionId({ commit }, id) {
		commit("SET_RESIZE_ACTION_ID", id);
	},
	expandStarted({ commit }) {
		commit("EXPAND_START");
	},
	expandEnded({ commit }) {
		commit("EXPAND_END");
	},
	changeSplit({ commit }, mode) {
		if (mode == "left") {
			commit("CHANGE_SPLIT", 70);
		}
		if (mode == "middle") {
			commit("CHANGE_SPLIT", 50);
		}
		if (mode == "right") {
			commit("CHANGE_SPLIT", 30);
		}
	},
	updateViewWindow({ commit }, viewWindow) {
		commit("CHANGE_VIEW_WINDOW", viewWindow);
	},
	updateScrollY({ commit }, y) {
		commit("CHANGE_SCROLL_Y", y);
	},
	setChangeMode({ commit }, change) {
		let c = null;
		const changeModes = ["left", "right", "move", "create"];

		if (changeModes.indexOf(change) !== -1) {
			c = change;
		}

		commit("SET_CHANGE_MODE", c);
	},
	setChangingAction({ commit }, action) {
		commit("SET_CHANGING_ACTION", action);
	},
	setOffsetX({ commit }, offsetX) {
		commit("SET_OFFSET_X", offsetX);
	},
	setInitialXPos({ commit }, initialX) {
		commit("SET_INITIAL_X_POS", initialX);
	},
	startChange({ commit, state, dispatch, getters }, { id, x, type }) {
		const activity = getters.activities.find(a => a.object.id === id);
		const changingAction = {
			id,
			width: activity.width,
			x: activity.x
		};

		(async () => {
			await dispatch("setChangingAction", changingAction);
			await dispatch("setChangeMode", type);

			switch (type) {
				case "left":
					await dispatch("setOffsetX", x - activity.x);
					break;
				case "right":
					await dispatch("setOffsetX", activity.x + activity.width - x);
					break;
				case "move":
					await dispatch("dragStarted");
					await dispatch("setOffsetX", x);
					break;
			}
		})();
	}
};
const getters = {
	leftPane: state => {
		return state.split;
	},
	rightPane: state => {
		return 100 - state.split;
	},
	height: (state, getters) => {
		return (
			getters.activities.length * state.options.activities.height +
			state.options.calendar.rowHeight * 2
		);
	},
	width: (state, getters) => {
		let start = DateTime.fromISO(getters.dateBounds.start);

		let end = DateTime.fromISO(getters.dateBounds.end);
		let days = end.diff(start, "days").toObject();
		return days.days * state.options.unit;
	},
	activities: (state, getters, rootState, rootGetters) => {
		let zone = rootState.userStore.user.profile.zoneinfo;

		let mapAction = (a, sa) => {
			let userStart = DateLib.getUserDate(zone, a.planStart);
			let userEnd = DateLib.getUserDate(zone, a.planFinish);

			return {
				label: a.title,
				x:
					getStartX(getters.dateBounds.start, userStart) *
					state.options.unit,
				y:
					a.pos * state.options.activities.height +
					state.options.activities.height,
				width: getDuration(userStart, userEnd) * state.options.unit,
				height: state.options.activities.height,
				object: a,
				subAction: sa,
				expanded: a.expanded,
				color: rootGetters.getPlanColor(a.planId)
			};
		};

		let actions = rootGetters.actions;

		if (!actions) {
			return [];
		}

		let result = [];
		let i = 0;
		actions.forEach(a => {
			a.pos = i;
			i++;
			result.push(mapAction(a, false));
			if (a.actions && a.actions.length && a.expanded) {
				a.actions.forEach(s => {
					s.pos = i;
					i++;
					result.push(mapAction(s, true));
				});
			}
		});

		return result;
	},
	dateBounds: (state, getters, rootState, rootGetters) => {
		let zone = rootState.userStore.user.profile.zoneinfo;
		let actions = rootGetters.actions;

		if (!actions) {
			return [];
		}

		let minDate = DateTime.local();
		let maxDate = DateTime.local();
		let i = 0;
		actions.forEach(a => {
			let userStart = DateLib.getUserDate(zone, a.planStart);
			let userEnd = DateLib.getUserDate(zone, a.planFinish);
			a.pos = i;
			i++;
			minDate = getSmaller(minDate, userStart);
			maxDate = getLarger(maxDate, userEnd);
		});

		let result = {
			start: minDate.plus({ months: -1 }).toISODate(),
			end: maxDate.plus({ month: 3 }).toISODate()
		};
		return result;
	},
	viewWindow: state => {
		return state.viewWindow;
	},
	todayPosition: (state, getters) => {
		const zone = new IANAZone("Australia/Melbourne");

		let start = DateTime.fromISO(getters.dateBounds.start, { zone: zone });
		let today = DateTime.utc().setZone(zone);
		//test day break
		// let today = DateTime.fromISO('2019-06-07T13:00:00',{zone: 'utc'}).setZone(zone);
		let period = today.diff(start, "days").toObject();

		return {
			x: Math.floor(period.days) * state.options.unit,
			y: state.options.calendar.rowHeight / 3,
			width: state.options.unit,
			height: getters.height
		};
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
};
