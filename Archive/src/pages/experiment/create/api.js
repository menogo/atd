export default {
    async getCommonConfigDatas() {
        const res = await app.$axios.get('/experiment/commonConfigDatas');
        return res;
    },

    // 获取对应模块的参数列表与剩余流量
    async getNewModuleConfigDatas({ moduleCode }) {
        const res = await app.$axios.get('/experiment/newModuleConfigDatas', {
            params: { moduleCode },
            loading: false
        });
        return res;
    },

    // 获取当前登录业务的指标列表数据，创建实验时需要使用
    async loadExperimentIndicatorDatas() {
        const res = await app.$axios.get('/experiment/load_experiment_indicator_datas', { loading: false });
        return res;
    },

    // 选择层
    async newComGrayStrategy({ moduleCode }) {
        const res = await app.$axios.get('/experiment/new_com_gray_strategy', {
            params: { moduleCode }
        });
        return res;
    },

    // 创建或编辑实验配置信息接口，编辑时fid必传
    async saveGrayExperiment(data) {
        const res = await app.$axios.post('/experiment/save_gray_experiment', data);
        return res;
    },

    async loadGrayExperimentDatas({ fexpId }) {
        const res = await app.$axios.get('/experiment/load_gray_experiment_datas', { params: { fexp_id: fexpId } });
        return res;
    },

    // 获取对应下发方式的剩余可分配流量
    async getTrafficRemainProportion(data) {
        const res = await app.$axios.post('/experiment/getTrafficRemainProportion', data, { loading: false });
        return res;
    },

    // 获取按标签下发时的标签列表
    async getIssueTag() {
        const res = await app.$axios.get('/experiment/issue_tag', { loading: false });
        return res;
    },

    // 获取按画像规则下发时的规则集列表
    async getIssuePortrait() {
        const res = await app.$axios.get('/experiment/issue_portrait', { loading: false });
        return res;
    },

    async getApprovalInfo({ businessCode, expId, expLogId, approvalType }) {
        const res = await app.$axios.get('approval/info', { params: { businessCode, expId, expLogId, approvalType } });
        return res;
    },

    async getApprovalSubmit({ businessCode, expId, expLogId, approvalType }) {
        const res = await app.$axios.post(
            'approval/release',
            {
                businessCode,
                expId,
                expLogId,
                approvalType
            },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return res;
    },
    async getApprovalFlow({ businessCode, expId, expLogId, approvalType }) {
        const res = await app.$axios.get('approval/flow', { params: { businessCode, expId, expLogId, approvalType } });
        return res;
    }
};
