const fs = require('fs-extra');
const path = require('path');
const crossEnv = require('cross-env');
const cwd = process.cwd();

const args = process.argv.slice(2);
const configFile = path.join(cwd, 'config.prod.js');
const configLocalFile = path.join(cwd, 'config.local.js');
const configDefault = path.join(cwd, 'config.default.js');
const vueConfigDefault = process.env.VUE_CLI_SERVICE_CONFIG_PATH || './build/vue.config.js';

if (!fs.pathExistsSync(configFile)) {
    fs.copySync(configDefault, configFile);
}

if (!fs.pathExistsSync(configLocalFile)) {
    fs.copySync(configDefault, configLocalFile);
}

const localConfig = require('../../config.local');

if (process.env.VUE_CLI_SERVICE_CONFIG_PATH) {
    args[0] = `VUE_CLI_SERVICE_CONFIG_PATH=${path.resolve(cwd, args[0].split('=')[1])}`;
} else {
    args.unshift(`VUE_CLI_SERVICE_CONFIG_PATH=${path.resolve(cwd, vueConfigDefault)}`);
}

// 构建 & 非发布
if (args.indexOf('build') !== -1 && args.indexOf('--no-clean') === -1) {
    fs.remove(localConfig.ui.dist);
    fs.remove(localConfig.cdn.dist);
}

crossEnv(args);
