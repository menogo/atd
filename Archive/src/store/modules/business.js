import API from '@/pages/common/api';

const state = {
    list: [],
    activeCode: '',
    activeName: '',
    isDefault: ''
};

const mutations = {
    SET_BUSINESS_LIST: (states, list) => {
        states.list = list;
    },
    SET_BUSINESS_CODE: (states, code) => {
        states.activeCode = code;
    },
    SET_BUSINESS_NAME: (states, name) => {
        states.activeName = name;
    },
    SET_DEFAULT: (states, isDefault) => {
        states.isDefault = isDefault;
    }
};

const actions = {
    getBusinessList({ commit }) {
        return new Promise((resolve, reject) => {
            API.getBusinessList()
                .then(res => {
                    if (res.status === 'success') {
                        let list = res.data.businesss;
                        let business = list.filter(item => {
                            return item.default === 'true';
                        });
                        let activeCode = business[0].businessCode;
                        let activeName = business[0].businessName;
                        let isDefault = res.data.default;

                        commit('SET_BUSINESS_LIST', list);
                        commit('SET_BUSINESS_CODE', activeCode);
                        commit('SET_BUSINESS_NAME', activeName);
                        commit('SET_DEFAULT', isDefault);
                        resolve({
                            list: list,
                            activeCode: activeCode,
                            activeName: activeName,
                            isDefault: isDefault
                        });
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    updateBusinessCode({ commit }, code) {
        return new Promise((resolve, reject) => {
            API.updateBusinessCode({ businessCode: code })
                .then(res => {
                    if (res.status === 'success') {
                        commit('SET_BUSINESS_CODE', code);
                        resolve(code);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    setActiveName({ commit }, name) {
        commit('SET_BUSINESS_NAME', name);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
