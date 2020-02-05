import Layout from '@/components/common/Layout';

export default {
    name: 'operation',
    path: '/experiment/operation/:fexp_id',
    component: Layout,
    children: [
        {
            path: '',
            component: () => import('./operation')
        }
    ]
};
