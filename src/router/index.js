import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {title: '系统首页', requireAuth: true, resource: 'P_INDEX'}
                },
                {
                    path: '/rabbitMsg',
                    component: resolve => require(['../components/page/rabbitMsg.vue'], resolve),
                    meta: {title: '消息管理', requireAuth: true, resource: 'P_MESSAGE'}
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: {title: '基本表单', requireAuth: true, resource: 'P_BASE_FORM'}
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: {title: '富文本编辑器', requireAuth: true, resource: 'P_EDITORS'}
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: {title: 'markdown编辑器', requireAuth: true}
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: {title: 'schart图表', requireAuth: true, resource: 'P_CHART'}
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: {title: '拖拽列表', requireAuth: true, resource: 'P_DRAG'}
                },
                {
                    // 用户管理
                    path: '/usersList',
                    component: resolve => require(['../components/page/userList.vue'], resolve),
                    meta: {title: '用户管理', requireAuth: true, resource: 'P_USERS'}
                },
                {
                    // 资源管理
                    path: '/resources',
                    component: resolve => require(['../components/page/resources.vue'], resolve),
                    meta: {title: '资源管理', requireAuth: true, resource: 'P_RESOURCES'}
                },
                {
                    // 路由管理
                    path: '/routes',
                    component: resolve => require(['../components/page/routes.vue'], resolve),
                    meta: {title: '路由管理', requireAuth: true, resource: 'P_ROUTES'}
                },
                {
                    // 角色管理
                    path: '/roles',
                    component: resolve => require(['../components/page/role.vue'], resolve),
                    meta: {title: '角色管理', requireAuth: true, resource: 'P_ROLE'}
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('AuthenticationToken');
    if (to.fullPath == '/login' && token) {
        next('/dashboard');
    }
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
        if (localStorage.getItem('AuthenticationToken')) {// 判断是否登录

            if (to.fullPath === '/dashboard') {
                next();
            } else {
                let resources = JSON.parse(localStorage.getItem('resources'));

                let flag = resources.some(value => {
                    return value.authority === to.meta.resource;
                });
                if (flag) {
                    next()
                } else {
                    next({
                        path: '/403',
                        query: {redirect: to.fullPath}
                    })
                }
            }
        } else {// 没登录则跳转到登录界面
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    } else {
        next()
    }
});

export default router;
