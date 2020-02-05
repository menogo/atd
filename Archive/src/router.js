import IndexView from '@/pages/experiment/list/list.vue';
import Layout from '@/components/common/Layout';
import util from '@/assets/js/util';

// 导入各模块路由
// import demo from '@/pages/demo/router';
import experiment from '@/pages/experiment/create/router';
import tags from '@/pages/experiment/tags/router';
import operation from '@/pages/experiment/operation/router';
import list from '@/pages/experiment/list/router';
import sideBar from '@/pages/sideBar/router';
const modules = [experiment, tags, list, operation];
sideBar.forEach(route => {
    modules.push(route);
});

const routesList = {
    routes: [
        {
            path: '/',
            beforeEnter(to, from, next) {
                // 实现后台302跳转不能带hash跳转页面情况
                // 例如：http://example.com#index => 302 => http://example.com?hash=index
                const page = util.getParameter('hash');

                // 路由为空时以page参数值作为默认路由
                let path = '/experiment/list';
                if (page) {
                    path = '/' + page;
                }

                next({ path: path, replace: true });
            }
        },
        {
            path: '/index',
            component: Layout,
            children: [
                {
                    path: '',
                    component: IndexView
                }
            ]
        },
        {
            // 空白视图,用于刷新
            path: '/blank',
            component: {
                template: '<div></div>',
                beforeRouteEnter(to, from, next) {
                    next(vm => {
                        vm.$router.replace(from);
                    });
                }
            }
        },
        {
            // 系统错误捕捉
            path: '/error',
            component: () => import('./pages/errors/index.vue')
        },
        {
            path: '*',
            component: () => import('./pages/errors/404.vue')
        }
    ]
};

//合并其他模块路由
modules.forEach(item => {
    routesList.routes.push(item);
});

console.log('Logs::routesList', routesList);
export default new VueRouter(routesList);
