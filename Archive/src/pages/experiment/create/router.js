import Layout from '@/components/common/Layout';

export default {
    path: '/experiment/create',
    component: Layout,
    children: [
        {
            path: '',
            component: () => import('./step1')
        },
        {
            path: 'step2',
            component: () => import('./step2')
        },
        {
            path: 'step3',
            component: () => import('./step3')
        },
        {
            path: 'step4',
            component: () => import('./step4'),
            children: [
                {
                    path: '',
                    component: () => import('./components/ApprovalSearch')
                },
                {
                    path: 'check',
                    component: () => import('./components/ApprovalResult')
                }
            ]
        }
    ]
};
