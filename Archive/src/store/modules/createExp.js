import API from '@/pages/common/api';

const state = {
    createExpData: {
        name: '',
        charger: '',
        type: [],
        purpose: ''
    },
    remainFlowValue: 0
};

const mutations = {
    SET_CREATE_EXP_DATA: (states, formData) => {
        states.createExpData = Object.assign(state.createExpData, formData);
    },
    SET_REMAIN_FLOW_VALUE: (states, remainFlowValue) => {
        states.remainFlowValue = remainFlowValue;
    }
};

const actions = {
    setCreateExpData({ commit }, formData) {
        commit('SET_CREATE_EXP_DATA', formData);
    },
    postCreateExpData({ commit }, formData) {
        commit('SET_CREATE_EXP_DATA', formData);
        return API.postCreateExpData(state.formData);
        // return console.log(state.createExpData);
    },
    setRemainFlowValue({ commit }, remainFlowValue) {
        commit('SET_REMAIN_FLOW_VALUE', remainFlowValue);
    }
};

export default {
    state,
    mutations,
    actions
};
