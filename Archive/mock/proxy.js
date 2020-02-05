module.exports = {
    // 请接口没有命中任何mock数据时, 会自动将请求转发到线上服务器
    // 如果想将请求转发到特定服务器(如开发/测试服务器), 可在此进行指定
    'api.target.com': 'https://10.xx.yy.zz' // 注意协议必须指定
    // 这样配置之后, 没有命中mock的host为api.mock.com的请求都会转发至 https://10.xx.yy.zz'
};
