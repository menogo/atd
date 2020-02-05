import Layout from '@/components/common/Layout';

export default {
    path: '/experiment/list',
    component: Layout,
    children: [
        {
            path: '',
            component: () => import('./list')
        }
    ]
};
