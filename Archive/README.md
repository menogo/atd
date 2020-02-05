# Oteam ABTest

#### 应用类型

单页应用(SPA）

#### 技术栈

webpack3 + ES6 + vue/vue-router/vuex + axios + element-ui

#### Quick Start

首先下载项目依赖, 注意 webpack 模板中包含`package-lock.json`文件, 请使用支持`锁版本(lock)`功能的 npm 版本进行依赖下载

```bash
> git clone http://git.code.oa.com/tencent_abtest/abtest_web.git
> cd abtest_web/src && npm install
> npm run dev

> npm run build # 本地构建, 可用于验证构建物
# 或
> npm run build:report # 可以检查构建的一些信息, 包括体积, 依赖等
> npm run release # 生产构建, 会构建到对应的dist路径
```

其他 webpack 开发流程请参考[Webpack 项目开发指引](https://git.oa.com/G_FIT_MDFT_FD/webpack)

#### 注意

模板中包含符合团队规范的项目通用配置文件(`/build/base.js`)以及个人本地配置模板(`/config.default.js`)

如业务项目需自定义构建功能, 建议优先修改配置文件而非直接复写`vue.config.js`.

项目通用配置文件(`/build/base.js`), 指业务项目内通用, 不存在项目成员内不同的情况

个人本地配置模板(`/config.default.js`), 指本地个性化配置, 如代理, 打包构建目录等

运行`npm run dev`时, 如果本地不存在`/config.js`会自动生成, 开发者也可以自己复制`/config.default.js`并重命名

注意`/config.js`文件**不会被 git 记录并提交**, 只会存在本地副本, 以此来避免协同开发时个人本地配置相互覆盖问题

同时, **切勿删除**本地配置模板文件(`confi.default.js`)

#### 模块/路由划分：

路由配置文件拆分到每个模块下自行管理，模块内页面采用子路由形式串联，便于维护和管理：

```bash
http://localhost:xxxx/#/abtest
http://localhost:xxxx/#/abtest/detail
http://localhost:xxxx/#/project
http://localhost:xxxx/#/project/detail
```

#### 目录规范：

```bash
├─build                 # 打包构建
├─mock                  # Mock Server 非强制，根据熟悉的MOCK方式开发
├─public                # SPA 挂载点
├─src                   # 源码
├─src/assets                # assets
├─src/components            # components
├─src/pages                 # 模块
│  ├─demo                       # demo 模块
│  │  │  router.js              # 当前模块的路由
|  |  |  api.js                 # 当前模块涉及的API
│  │  └─index.vue
│  │  └─detail.vue
├─src/static            # webpack构建不处理的静态资源
├─tests                 # 自动化测试（非强制、可不做）
├─.editorconfig         # 编辑器配置, IDE/代码编辑器请下载editorconfig支持插件, 方便统一规范
├─.eslintignore         # 指定eslint忽略检查的文件, 例如通过vtools配置平台直接发布的文件
├─.eslintrc.je          # 团队代码规范, 确保提交的代码符合规范要求
├─.gitignore
├─.stylelintrc
├─babel.config.js       # babel配置相关, 可根据需求自行扩展
├─config.default.js     # 本地配置默认文件, 根据此文件复制 -> 重命名为`config.js`, 用于本地构建配置
├─config.local.js
├─config.prod.js
├─jsconfig.json         # 路径别名设置
├─package-lock.json     # 依赖版本信息, 请使用支持`lock`功能的npm版本进行依赖下载
├─package.json          # 项目基本信息配置
├─README.md
```

#### 框架现有能力：

-   1)、组件库：已全局注入 element-ui 组件库，直接使用即可
-   2)、util
-   3)、公共弹框：全局 app 对象上扩展了部分通用弹框：

```js
app.$pageLoading.show(); // 展示页面级loading（背景遮挡）
app.$loading.show(); // 展示局部loading(背景半透明)
app.$message.error('error message'); // tips错误消息提示
app.$msgbox.alert('message'); // 弹框提醒相关
// 子视图弹框(可以弹框展示一个视图页面)
app.$dialog
    .show({
        title: '弹出一个视图页面',
        data: { a: 1, b: 2 }, // 传递数据给视图页面，子视图内获取数据方式：this.getParams()
        component: import(/* webpackChunkName: "project-detail" */ '@/pages/abtest/detail')
    })
    .then(res => {
        // 接收弹框视图输出的数据
        // 弹框视图向调用视图输出数据方式：this.submit({a:1,b:2})
        alert(res);
    });
```

-   4)、公共视图基类 viewbase：
    为路由视图和弹框视图提供统一的 api，抹平他们之间的差异:

```js
import viewbase from '@/assets/mod/viewbase';
export default {
    extends: viewbase
};

// 方法调用
this.setTitle(title); // 设置title
this.hideLoading(); // 隐藏loadng （原路由视图隐藏loading方法： app.$pageLoading.hide()，弹框视图隐藏loading方法:  this.$view.hideLoading()）
this.getParams(name); // 获取视图参数
this.goRouter(path); // 路由跳转
this.refreshRouter(); // 路由刷新
this.goBack(); // 路由回退到上级
this.submit(data); // 提交数据（弹框视图专用）
this.close(); // 关闭视图（弹框视图专用）
```

#### 打包配置例子

-   `config.local.js` 打本地包配置
-   `config.prod.js` 打生产包配置
    考虑到每个开发的打包配置可能不一致，所有这两个文件不上传 git repo！

```js
const path = require('path');

module.exports = {
    cdn: {
        // 最终打包, cdn资源将存放在${proj}/dist/cdn/....
        dist: path.resolve(__dirname, '../dist/cdn/htdocs/res/weixin/tax-loan/'),
        url: 'https://mqq-imgcache.gtimg.cn/res/weixin/tax-loan/' // 需要带上完整子路径
    },
    ui: {
        // 最终打包, cdn资源将存放在${proj}/dist/ui/....
        dist: path.resolve(__dirname, '../dist/ui/'),
        url: 'https://happyloan.tenpay.com'
    },
    proxy: {
        '/cgi-bin': {
            // 所有`/cgi-bin`请求会被代理至目标服务器
            // 自行选择代理到fiddler/whistle等代理工具, 或开发/测试服务器
            target: 'http://127.0.0.1:8888',
            headers: {
                host: 'happyloan.tenpay.com'
            },
            onProxyReq: function(proxyReq, req, res) {
                proxyReq.setHeader('host', 'happyloan.tenpay.com');
            }
        }
    }
};

// 例如把所有资源打到 dist/ 文件夹
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
```
