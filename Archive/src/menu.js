const menuData = [
    {
        key: 'experiment',
        text: '实验管理',
        url: 'experiment',
        leaf: 'false',
        icon: 'menu',
        menu: [
            {
                key: 'create',
                text: '创建实验',
                url: '/experiment/create',
                leaf: 'true'
            },
            // {
            //     key: 'tags',
            //     text: '标签管理',
            //     url: '/experiment/tags',
            //     leaf: 'true'
            // },
            {
                key: 'list',
                text: '实验列表',
                url: '/experiment/list',
                leaf: 'true'
            }
        ]
    }
    // {
    //     key: 'users',
    //     text: '用户管理',
    //     url: 'users',
    //     leaf: 'false',
    //     menu: [
    //         {
    //             key: 'list',
    //             text: '创建实验',
    //             url: '/users/list',
    //             leaf: 'true'
    //         },
    //         {
    //             key: 'tags',
    //             text: '标签管理',
    //             url: '/users/tags',
    //             leaf: 'true'
    //         },
    //         {
    //             key: 'visit',
    //             text: '其它管理',
    //             url: '/users/visit',
    //             leaf: 'true'
    //         }
    //     ]
    // },
    // {
    //     key: 'authority',
    //     text: '权限管理',
    //     url: 'authority',
    //     leaf: 'false',
    //     menu: [
    //         {
    //             key: 'list',
    //             text: '创建实验',
    //             url: '/authority/list',
    //             leaf: 'true'
    //         },
    //         {
    //             key: 'tags',
    //             text: '标签管理',
    //             url: '/authority/tags',
    //             leaf: 'true'
    //         },
    //         {
    //             key: 'visit',
    //             text: '其它管理',
    //             url: '/authority/visit',
    //             leaf: 'true'
    //         }
    //     ]
    // },
    // {
    //     key: 'demo',
    //     text: 'DEMO',
    //     url: 'demo',
    //     leaf: 'false',
    //     icon: 'data-line',
    //     menu: [
    //         {
    //             key: 'create',
    //             text: 'CREATE',
    //             url: '/demo/create',
    //             leaf: 'true'
    //         },
    //         {
    //             key: 'tags',
    //             text: 'TAGS',
    //             url: '/demo/tags',
    //             leaf: 'true'
    //         }
    //     ]
    // }
];

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

//遍历后台传来的路由字符串，转换为菜单数据列表
function filterMenuList(asyncRouterMap) {
    const accessedMenuList = asyncRouterMap.filter(route => {
        if (route.path) {
            route.key = route.path;
            route.text = route.name;

            if (route.component === 'Layout') {
                route.url = route.path;
                route.leaf = 'false';
            } else {
                let url = route.component;
                let urlList = url.split('/');
                url = urlList.pop();
                url = '/' + urlList.join('/');
                route.url = url;
                route.leaf = 'true';
            }

            delete route.name;
            delete route.path;
            delete route.component;
        }
        if (route.children && route.children.length) {
            route.menu = filterMenuList(route.children);
            delete route.children;
        }
        return true;
    });

    return accessedMenuList;
}
let menuList = filterMenuList(fakeRouter);

menuList.forEach(menu => {
    menuData.push(menu);
});

export default menuData;
