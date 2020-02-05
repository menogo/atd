export default {
    // 获取 层级
    async getCommonConfigDatas() {
        const res = await app.$axios.get('experiment/commonConfigDatas');
        return res;
    },

    // 获取 创建者
    async getParamsDatas() {
        const res = await app.$axios.get('/experiment/get_params');
        return res;
    },

    // 获取实验列表
    async getAnalyticsList({ module, creator, status }) {
        const res = await app.$axios.get('experiment/new_gray_exp_strategy_get_list', {
            params: { module, creator, status }
        });
        return res;
    },

    // 获取收藏实验列表
    async getFavoriteList() {
        const res = await app.$axios.get('experiment/favorite/new_favorite_list');
        return res;
    },

    // 添加收藏实验
    async addFavoriteList({ exp_id }) {
        const res = await app.$axios.post(
            'experiment/favorite/new_add',
            { exp_id },
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
        return res;
    },

    // 取消收藏实验
    async delFavoriteList({ exp_id }) {
        const res = await app.$axios.post(
            'experiment/favorite/new_delete',
            { exp_id },
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
        return res;
    },

    // 实验复制
    async copyExperiment({ id }) {
        const res = await app.$axios.post(
            'experiment/new_clone_gray_exp',
            { id },
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
        return res;
    },

    // 删除实验
    async delExperiment({ exp_id }) {
        const res = await app.$axios.post(
            'experiment/new_deleteGrayExp',
            { exp_id },
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
        return res;
    }

    // export const grantRoleRight = (roleId, rids) => {
    // return axios.post(`roles/${roleId}/rights`, rids).then(res => res.data)
    // }
};
