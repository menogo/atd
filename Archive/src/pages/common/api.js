export default {
    async getUserInfo() {
        const res = await app.$axios.get('user/info');
        return res;
    },

    async getBusinessList() {
        const res = await app.$axios.get('user/business');
        return res;
    },

    async updateBusinessCode({ businessCode }) {
        const res = await app.$axios.post(
            'user/business/update',
            { businessCode },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return res;
    },

    async getUserNews() {
        const res = await app.$axios.get('user/user_news', { loading: false });
        return res;
    }
};
