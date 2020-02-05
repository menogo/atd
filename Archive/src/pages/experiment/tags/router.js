import Layout from '@/components/common/Layout';

export default {
    path: '/experiment/tags',
    component: Layout,
    children: [
        {
            path: '',
            component: () => import('./tags')
        }
    ]
};
