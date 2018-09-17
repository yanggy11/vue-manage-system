<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index" v-has-any-resources="item.resources">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index" v-has-any-resources="subItem.resources">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index" v-has-resource="subItem.resources">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-has-resource="item.resources">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'dashboard',
                        title: '系统首页',
                        resources:'P_INDEX'
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: '4',
                        title: '数据管理',
                        resources: ['P_DATA_MANAGE','P_USERS', 'P_RESOURCES', 'P_ROUTES', 'P_ROLE'],
                        subs: [
                            {
                                index: 'usersList',
                                title: '用户管理',
                                resources:'P_USERS'

                            },{
                                index: 'resources',
                                title: '资源管理',
                                resources: 'P_RESOURCES'
                            },{
                                index: 'routes',
                                title: '路由管理',
                                resources:'P_ROUTES'
                            },{
                                index: 'roles',
                                title: '角色管理',
                                resources: 'P_ROLE'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-message',
                        index: 'rabbitMsg',
                        title: '消息管理',
                        resources: 'P_MESSAGE'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
