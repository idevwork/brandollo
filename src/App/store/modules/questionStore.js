import schemaService from "@/Common/services/SchemaService";
import { forEach, map, filter, every, findIndex } from 'lodash';


export default {
    namespaced: true,
    state: {
        ready: false,
        formSchema: {
            options: {},
            pageDefinition: [
                {
                    page: [{ label: "Let's create your plan" }]
                }
            ]
        },
        formPages: {},
        formValues: [],
        disableSubmit: false,
        customSelectedActions: [],
    },
    mutations: {
        'SET_READY'(state, payload) {
            state.ready = payload;
        },
        'SET_SCHEMA'(state, payload) {
            state.formSchema = payload;
            state.formPages = payload.pageDefinition;
        },
        'SET_SUBMIT_STATUS'(state, payload) {
            state.disableSubmit = payload;
        },
        'INIT_VALIDATION'(state) {
            state.formValues = [];
            let pageIndex = 0;
            forEach(state.formPages, page => {
                forEach(page.page, f => {

                    state.formValues.push({
                        pageIndex: pageIndex,
                        fieldDefinitionId: f.id,
                        id: f.id,
                        position: f.position,
                        value: null,
                        isValid: false,
                        isTouched: false
                    });
                })
                pageIndex++;
            });
        },
        'SET_RESULT'(state, payload) {
            let i = findIndex(state.formValues, r => { return r.id == payload.id });
            state.formValues[i].value = payload.value;
        },
        'SET_VALIDATION'(state, payload) {
            let i = findIndex(state.formValues, r => { return r.id == payload.id });
            state.formValues[i].isValid = payload.isValid;
        },
        'SET_TOUCH'(state, p) {
            let pageFields = filter(state.formValues, f => { return p.index == f.pageId });
            forEach(pageFields, f => f.isTouched = p.state)
        },
        'SET_CUSTOM_ACTIONS'(state, p) {
            state.customSelectedActions = p;
        }
    },
    getters: {
        checkUseLimit: state => {
            let options = state.formSchema.options;
            let limit = options && options.limit ? options.limit : 1;
            let uses = state.formSchema.submissions;
            if (uses >= limit) {
                return true;
            }
            return false;
        },
        getTouchStatus: state => fieldId => {
            let fieldIndex = findIndex(state.formValues, f => { return fieldId == f.id });
            return state.formValues[fieldIndex].isTouched;
        },
        getSchema: state => (pageIndex, fieldIndex) => {
            if (state.formPages) {
                if (state.formPages[pageIndex].page) {
                    return state.formPages[pageIndex].page[fieldIndex];
                }
            }
        },
    },
    actions: {
        loadStore: ({ commit }, formId) => {
            return new Promise(function (resolve, reject) {
                commit('SET_READY', false);
                if (formId != null) {
                    schemaService.getUserQuestion({ id: formId })
                        .then(d => {
                            commit('SET_SCHEMA', d);
                            commit('INIT_VALIDATION');

                            commit('SET_READY', true);
                            resolve();
                        }, f => reject(f));
                }
            })
        },
        pushToServer: ({ commit, state }, teamId) => {
            return new Promise(function (resolve, reject) {
                commit('SET_SUBMIT_STATUS', true);
                let values = filter(state.formValues,v=> v.value)
                const payload = {
                    FormDefinitionId: state.formSchema.id,
                    FieldValues: Object.values(values),
                    TeamId: teamId
                };

                schemaService.postAnswers(payload).then(
                    d => {

                        commit('SET_SUBMIT_STATUS', false);
                        resolve(d);

                    },
                    f => {
                        console.log("something went wrong");
                        commit('SET_SUBMIT_STATUS', false);
                        reject(f);

                    }
                );
            });
        },
        updateResults: ({ commit }, payload) => {
            commit('SET_RESULT', payload);
        },
        updateValidation: ({ commit }, payload) => {
            commit('SET_VALIDATION', payload);
        },
        updateCustomActions: ({ commit }, payload) => {
            commit('SET_CUSTOM_ACTIONS', payload)
        },
        touchPage: ({ commit, state }, pageIndex) => {
            return new Promise(resolve => {
                commit('SET_TOUCH', { index: pageIndex, state: true });
                resolve(true);

            });
        },
        allowPageChange: ({ commit, state }, pageIndex) => {

            return new Promise(resolve => {
                let pageFields = filter(state.formValues, f => { return pageIndex == f.pageIndex });
                if (every(pageFields, ["isValid", true])) {
                    resolve(true);
                }
                resolve(false);

            });
        }


    }
}
