const path = require('path');
const release = require('../config.prod');
const local = require('../config.local');
const URL = require('url').URL;

const args = process.argv;
const mode = process.env.NODE_ENV;
const isProd = mode === 'production';

const isRelease = args.indexOf('--no-clean') !== -1;
const getUrl = url => {
    let realURL = '';
    if (url.startsWith('https:') || url.startsWith('http:')) {
        realURL = url;
    } else if (url.startsWith('//')) {
        realURL = `https:${url}`;
    } else {
        realURL = `https://${url}`;
    }
    return realURL;
};

const opt = isRelease ? release : local;
const cdnUrl = opt.cdn.url;
// const cdnPath = new URL(getUrl(cdnUrl)).pathname.slice(1);
const cdnDist = opt.cdn.dist;
const uiDist = opt.ui.dist;

let devServer = {
    host: '0.0.0.0',
    disableHostCheck: true,
    allowedHosts: []
};

if (opt.ui.url) {
    let url = new URL(getUrl(opt.ui.url));
    devServer.allowedHosts.push(url.host);
}

if (opt.proxy && Object.keys(opt.proxy).length !== 0) {
    devServer = Object.assign({}, devServer, { proxy: opt.proxy });
}

/**
 * 项目通用配置
 * @property {Object} pages - 多页应用配置, 见 https://cli.vuejs.org/zh/config/#pages
 * @property {Sintrg} uiBase - 用于shtml拼接时的根目录
 * @property {Sintrg} templateBase - 用于shtml拼接时的根目录
 * @property {Object} templateParameters - 模板变量替换
 * @property {String} publicPath - see vue config
 * @property {String} cdnDist - CDN构建发布包存放目录
 * @property {String} uiDist - UI构建发布包存放目录
 * @property {String} devServer - webpack dev server配置
 */
module.exports = {
    pages: {
        // 如果只配置一个页面, 会按单页页面处理
        app: {
            // 构建入口
            entry: 'src/app.js',
            template: 'public/index.html'
        }
    },
    uiBase: path.resolve(__dirname, '../public'),
    templateBase: path.resolve(__dirname, '../public'),
    templateParameters: {
        BASE_URL: isProd ? cdnUrl : '/' // html模板中使用 <%= BASE_URL %> 会被转化成 `${cdnUrl}/`
    },
    publicPath: isProd ? cdnUrl : '/',
    cdnDist,
    uiDist,
    devServer
};
