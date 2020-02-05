import Layout from '@/components/common/Layout';
const _import = require('./_import_' + process.env.NODE_ENV); //获取组件的方法

//fakeRouter 通过后台接口请求回来的数据
let fakeRouter = [
    {
        path: '/experiment',
        component: 'Layout',
        name: '动态路由',
        icon: 'setting',
        children: [
            {
                path: 'business',
                name: '全部业务',
                component: 'experiment/business/list'
            }
            // ,{
            //     path: 'list',
            //     name: '实验列表',
            //     component: 'experiment/list/list'
            // }
        ]
    }
];

//遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.path) {
            if (route.component === 'Layout') {
                //Layout组件特殊处理
                route.component = Layout;
            } else {
                route.component = _import(route.component);
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children);
        }
        return true;
    });

    return accessedRouters;
}

//路由列表
let routesList = filterAsyncRouter(fakeRouter);

export default routesList;
