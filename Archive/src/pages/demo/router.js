import Layout from '@/components/common/Layout';

export default {
    path: '/demo',
    component: Layout,
    children: [
        {
            path: 'create',
            component: () => import('./create')
        },
        {
            path: 'tags',
            component: () => import('./tags')
        }
    ]
};
