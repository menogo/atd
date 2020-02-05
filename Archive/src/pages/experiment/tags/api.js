export default {
    async getModuleList() {
        const res = await app.$axios.get('experiment/get_module_list_for_experiment_list');
        return res;
    },

    async getMenuList() {
        const res = await app.$axios.get('getMenuList');
        return res;
    }
};
