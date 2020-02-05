const path = require('path');

module.exports = {
    cdn: {
        dist: path.resolve(__dirname, './dist'), // 本地目录, 构建发布包直接打包放到的发布仓库本地目录
        url: './' // 线上域名, 请带上完整子路径
    },
    ui: {
        dist: path.resolve(__dirname, './dist'), // 本地目录, 构建发布包直接打包放到的发布仓库本地目录,
        url: '' // ui线上域名, 不需要子路径
    },
    // proxy 配置详情参考 https://github.com/chimurai/http-proxy-middleware
    proxy: null
};
