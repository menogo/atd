import Vue from 'vue';
import VueRouter from 'vue-router';
import VCharts from 'v-charts';
const moment = require('moment');

import Mixins from '@/assets/js/mixins';
import Filters from '@/assets/js/filters';
import Extends from '@/assets/js/extends';
import RouterIntercept from '@/assets/js/intercept';

import App from './App.vue';
import Router from './router';
import store from './store';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/icon.css'; // 加载element-ui icon图标
import '@/assets/css/style.css'; // 加载element-ui icon图标

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VCharts);
Vue.use(Filters);
Vue.use(require('vue-moment'), {
    moment
});

// Vue实例定时器、延时器等能力增强
Vue.mixin(Mixins);

// 扩展全局对象app
const app = (window.app = Object.assign({}, Extends));

const instance = {
    /**
     * 页面初始化，初始化路由和根节点
     * @param  {Array} router 业务视图路由对象
     */
    init(router) {
        // 路由拦截规则
        const intercept = new RouterIntercept();

        // // 路由拦截例子：检查用户是否登录
        // intercept.add(() => {
        //     return !window.G_userInfo || window.G_userInfo.retcode !== '0'
        // }, '/error');
        Router.beforeEach((to, from, next) => {
            // app.$pageLoading.show();
            let rule = intercept.get(to, from);

            // 如命中拦截规则，则导航到指定视图
            if (rule) {
                if (to.path === rule.path) {
                    next();
                } else {
                    next({ path: rule.path, replace: true });
                }
            } else {
                //获取当前用户
                store.dispatch('user/getUserInfo');
                //首次获取  用户消息通知
                store.dispatch('user/getUserNews');
                //获取用户通知消息 轮询
                // setInterval(() => {
                //     store.dispatch('user/getUserNews');
                // }, 10000);
                //获取业务列表接口
                store.dispatch('business/getBusinessList');

                next();
            }
        });

        new Vue({
            router: router,
            store: store,
            watch: {
                $route: () => {
                    // 销毁所有弹框
                    app.$dialog.destroy();
                }
            },
            render: h => h(App)
        }).$mount('#app');

        // 将 router 挂载到 app
        app.$router = router;
    }
};

instance.init(Router);

export default {};
