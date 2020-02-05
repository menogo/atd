const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
const SSIWebpackPlugin = require('./lib/webpack-ssi-plugin');
const TemplatePlugin = require('./lib/webpack-template-plugin');
const { processHTMLWithSSI, injectHTMLLoader } = require('./utils');
const base = require('./base');

const mode = process.env.NODE_ENV;
const isProd = mode === 'production';
const isDevBuild = process.argv.indexOf('--dev-build') !== -1;
const rootPath = process.cwd();
const publicPath = path.resolve(rootPath, 'public');
const srcPath = path.resolve(rootPath, 'src');
const pageKeys = Object.keys(base.pages);
const isSpa = pageKeys.length === 1;
const spaIndex = path.resolve(base.uiDist, path.relative(publicPath, base.pages[pageKeys[0]].template));

const templateParameters = base.templateParameters;
const devServer = base.devServer;

let aliasPaths = {};
try {
    aliasPaths = require('../jsconfig.json').compilerOptions.paths;
} catch (e) {}

module.exports = {
    filenameHashing: !isDevBuild,
    outputDir: base.cdnDist,
    publicPath: base.publicPath,
    indexPath: spaIndex,
    css: {
        extract: isProd && !isDevBuild
    },
    pages: isSpa
        ? undefined
        : pageKeys.reduce((pages, key) => {
              const page = base.pages[key];
              const template = path.resolve(rootPath, page.template);
              page.entry = path.resolve(rootPath, page.entry);
              page.template = template;
              page.minify = page.minify || false;
              page.inject = page.inject || false;
              page.chunks = page.chunks || ['chunk-vendors', 'chunk-common', key];
              if (isProd) page.filename = path.resolve(base.uiDist, path.relative(publicPath, template));

              pages[key] = page;
              return pages;
          }, {}),
    configureWebpack: config => {
        config.externals = {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            'element-ui': 'ELEMENT'
        };
        // if (isProd) {
        //     config.devtool = 'cheap-module-source-map';
        // } else {
        //     config.devtool = 'source-map';
        // }
    },
    configureWebpack: config => {
        config.externals = {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            'element-ui': 'ELEMENT'
        };
        config.devtool = 'source-map';
    },
    chainWebpack: config => {
        // 单页应用支持
        if (isSpa) {
            const page = base.pages[pageKeys[0]];
            // 改写入口js
            const entry = page.entry;
            config
                .entry('app')
                .clear()
                .add(path.resolve(rootPath, entry));

            // 改写入口模板以及构建后模板存放路径
            const template = path.resolve(rootPath, page.template);
            const filename = path.resolve(base.uiDist, path.relative(publicPath, template));
            // const filename = 'index.shtml'; //path.resolve(base.uiDist, path.relative(publicPath, template));
            config.plugin('html').tap(args => {
                if (!args || args.length === 0) return args;
                args[0].template = injectHTMLLoader(template); // 后端cgi模板
                args[0].minify = page.minify || false;
                args[0].inject = page.inject || false;
                if (isProd) args[0].filename = filename;
                return args;
            });
        } else {
            pageKeys.forEach(key => {
                // @FIX: https://github.com/vuejs/vue-cli/issues/3976
                config.plugin(`html-${key}`).tap(args => {
                    if (!args || args.length === 0) return args;
                    args[0].template = injectHTMLLoader(args[0].template); // 后端cgi模板
                    return args;
                });
            });
        }

        // 只有开发构建需要处理后端include语法
        if (!isProd) {
            // 开发构建处理shtml的include语法
            // 构建发布包时, 直接copy shtml及资源即可, ssi的处理由后端完成
            config.plugin('ssi').use(SSIWebpackPlugin, [
                {
                    base: base.uiBase,
                    templateParameters
                }
            ]);
            // 开发构建处理后端模板的include语法
            // 构建发布包时, 直接copy shtml及资源即可, 后端模板的拼接由后端完成
            config.plugin('cgi-template').use(TemplatePlugin, [
                {
                    base: base.templateBase,
                    templateParameters
                }
            ]);
        }

        if (isProd) {
            // 生产构建时需要复制静态资源
            config.plugin('copy').tap(args => {
                const patterns = [
                    // src/static/* -> cdn.dist/*
                    {
                        from: path.resolve(srcPath, 'static'),
                        to: base.cdnDist,
                        ignore: ['.*']
                    } //,
                    // public/template -> ui.dist/template
                    // {
                    //     from: path.resolve(publicPath, 'template'),
                    //     to: path.resolve(base.uiDist, 'template'),
                    //     ignore: ['.*', '*.shtml', '*.html']
                    // },
                    // public/htdocs -> ui.dist/htdosc
                    // {
                    //     from: path.resolve(publicPath, 'htdocs'),
                    //     to: path.resolve(base.uiDist, 'htdocs'),
                    //     ignore: ['.*', '*.shtml', '*.html']
                    // }
                ];
                return [patterns];
            });

            // 处理所有html模板片段, 处理html片段中的ejs变量语法
            // <%= BASE_URL %> -> https://mqq-imgcache.gtimg.cn/xxx/yyy/zzz （即在config.js中配置cdn url）
            processHTMLWithSSI(config, { templateParameters });
        }

        // 处理生成manifest
        config.optimization.runtimeChunk({ name: entry => `runtime.${entry.name}` });

        if (process.argv && process.argv.indexOf('--report') !== -1) {
            // 静态资源引用分析
            config.plugin('analyzer').use(new BundleAnalyzerPlugin.BundleAnalyzerPlugin());
        }

        // 路径别名, import 'fitTheme/xxx.css' => import 'src/g/fit-ui/themes/default/xxx.css'
        // 注意需要下载 `g` 子模块
        Object.keys(aliasPaths).forEach(k => {
            let v = aliasPaths[k][0];
            v = v.substring(0, v.length - 2);
            k = k.split('/')[0];
            config.resolve.alias.set(k, path.resolve(__dirname, '..', v));
        });

        // g模块别名
        // config.resolve.alias.set('fitTheme', '@tencent/fit-h5-global/g/fit-ui/themes/default');
        // config.resolve.alias.set('g', '@tencent/fit-h5-global/g');

        // 开发build, 不生成vendor
        if (isDevBuild) {
            config.optimization.clear();
            config.plugins.delete('named-chunks');
            config.plugins.delete('hash-module-ids');
        }
    },
    devServer: {
        ...devServer,
        contentBase: [path.resolve(srcPath, 'static'), publicPath],
        // 跨域处理
        host: '0.0.0.0', //ip地址
        port: 8080 //端口
        // proxy: {
        // 'http://testabt.oa.com/': {
        //     target: 'http://127.0.0.1:8080/', //对应自己的接口
        //     changeOrigin: true,
        //     ws: true,
        //     pathRewrite: {
        //         'http://testabt.oa.com/': ''
        //     }
        // }
        // }
    }
};
