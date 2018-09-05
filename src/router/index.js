import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router= new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页',requireAuth: true }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' ,requireAuth: true}
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' ,requireAuth: true}
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' ,requireAuth: true}
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' ,requireAuth: true}
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' ,requireAuth: true}
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' ,requireAuth: true}
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' ,requireAuth: true}
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' ,requireAuth: true}
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', requireAuth: true }
                },
                {
                    // 用户管理
                    path: '/usersList',
                    component: resolve => require(['../components/page/userList.vue'], resolve),
                    meta: { title: '用户管理', requireAuth: true }
                },
                {
                    // 资源管理
                    path: '/resources',
                    component: resolve => require(['../components/page/resources.vue'], resolve),
                    meta: { title: '资源管理', requireAuth: true }
                },
                {
                    // 路由管理
                    path: '/routes',
                    component: resolve => require(['../components/page/routes.vue'], resolve),
                    meta: { title: '路由管理', requireAuth: true }
                },
                {
                    // 角色管理
                    path: '/routes',
                    component: resolve => require(['../components/page/role.vue'], resolve),
                    meta: { title: '角色管理', requireAuth: true }
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
    //调到登录页面之前，判断是否有token，如有token，则跳入主页
    if(to.fullPath == '/login' && token) {
        next('/dashboard');
    }
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
        if (localStorage.getItem('AuthenticationToken')) {// 判断是否登录
            next()
        } else {// 没登录则跳转到登录界面
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }
    } else {
        next()
    }
});

export default router;
