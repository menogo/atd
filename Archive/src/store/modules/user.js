import API from '@/pages/common/api';

const state = {
    name: '',
    avatar: '',
    news: []
};

const mutations = {
    SET_NAME: (states, name) => {
        states.name = name;
    },
    SET_AVATAR: (states, avatar) => {
        states.avatar = avatar;
    },
    SET_NEWS: (states, news) => {
        states.news = news;
    }
};

const actions = {
    getUserInfo({ commit }) {
        return new Promise((resolve, reject) => {
            API.getUserInfo()
                .then(res => {
                    if (res.status === 'success') {
                        let userName = res.data.userName;
                        commit('SET_NAME', userName);
                        resolve(userName);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    getUserNews({ commit }) {
        return new Promise((resolve, reject) => {
            API.getUserNews()
                .then(res => {
                    if (res.status === 'success') {
                        let news = res.data.businesss;
                        commit('SET_NEWS', news);
                        resolve(news);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
