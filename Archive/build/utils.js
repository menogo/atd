const CopyWebpackPlugin = require('copy-webpack-plugin');
const ejs = require('ejs');
const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');
const htmlLoader = require.resolve('./lib/loader/html');
const _ = require('lodash');

const base = require('./base');
/**
 * 需要ssi情况下所有html/sthml都需要经过HtmlWebpackPlugin处理
 * 已保证所有的shtml/html里面的<%= =>变量都能被解析
 * @param {Object} config - webpack chain config, see https://github.com/neutrinojs/webpack-chain
 * @param {Object} htmlOpt - html plugin config
 * @param {String} base - base path
 * @param {Object} pattern - glob pattern param
 * @param {Object} globOpt - glob options
 * @param {Object} dist - dist path
 */
function processHTMLWithSSI(config, htmlOpt) {
    let pattern = path.resolve(process.cwd(), 'public/{htdocs,template}/**/*.{html,shtml}');
    let ignore = [];

    // 忽略入口模板
    if (base.pages && !_.isEmpty(base.pages)) {
        Object.keys(base.pages).forEach(k => {
            let template = base.pages[k].template;
            if (template.startsWith('!!')) {
                template = template.slice(2).split('!')[1];
            }
            ignore.push(template);
        });
    } else if (base.spa) {
        if (base.cgi) {
            ignore.push(path.resolve(base.templateBase, base.index));
        } else {
            ignore.push(path.resolve(base.uiBase, base.index));
        }
    }

    let files = glob.sync(pattern, { ignore });

    // 排除多余/不构建的入口模板
    files = files.filter(f => {
        const content = fs.readFileSync(f, { encoding: 'utf-8' });
        return !content.includes('htmlWebpackPlugin');
    });

    const copyConfigs = files.map(file => {
        const filename = path.relative(path.resolve(process.cwd(), 'public'), file);
        return {
            from: file,
            to: path.resolve(base.uiDist, filename),
            transform(content, path) {
                return ejs.render(fs.readFileSync(path, { encoding: 'utf-8' }), htmlOpt.templateParameters);
            }
        };
    });
    config.plugin('copy-ssi').use(CopyWebpackPlugin, [copyConfigs]);
}

/**
 * 指定html模板模板loader
 * @param {String} template - html模板路径
 */
function injectHTMLLoader(template) {
    return `!!${htmlLoader}!${template}`;
}

module.exports = {
    processHTMLWithSSI,
    injectHTMLLoader
};
