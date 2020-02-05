const getters = {
    //用户名称
    name: state => state.user.name,
    //用户头像
    avatar: state => state.user.avatar,
    //用户消息列表
    news: state => state.user.news,
    //业务列表
    businessList: state => state.business.list,
    //默认业务Id
    activeBusinessCode: state => state.business.activeCode,
    //默认业务名称
    activeBusinessName: state => state.business.activeName,
    //是否设置默认业务
    isDefault: state => state.business.isDefault,
    createExpData: state => state.createExp.createExpData
};

export default getters;
