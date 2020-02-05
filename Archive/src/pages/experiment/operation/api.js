export default {
    async getTypeList() {
        const res = await app.$axios.get('experiment/new_experiment_log_params');
        return res;
    },
    async getDataList({ id, modifier, status }) {
        let data = {
            id,
            modifier,
            status
        };
        for (let i in data) {
            if (data.hasOwnProperty(i) && !data[i] && data[i] !== 0) {
                delete data[i];
            }
        }
        const res = await app.$axios.get('experiment/new_gray_experiment_log', {
            params: data
        });
        return res;
    }
};
