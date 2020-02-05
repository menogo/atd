import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import user from './modules/user';
import business from './modules/business';
import createExp from './modules/createExp';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        business,
        createExp
    },
    getters
});

export default store;
