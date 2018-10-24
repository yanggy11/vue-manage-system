export default {
    OK: '1',
    api: 'api/',
    unhandled_message: 'unhandled_message',
    handled_message: 'handled_message',
    recieved_message: 'recieved_message',
    sended_message: 'sended_message',
    user_url: {
        user_login_url: 'resources/auth/login',
        user_upload_url: 'resources/user/uploa',
        user_list_url: 'resources/user/userList',
        user_edit_url: 'resources/user/updateUserInfo',
        user_delete_url: 'resources/user/delete',
        user_add_url: 'resources/user/register',
        user_delete_all_url: 'resources/user/deleteAll'
    },
    routes_url: {
        get_routes_url: 'resources/route/getAllRoutesInPage',
        routes_disable_url: 'resources/route/disableRoute',
        delete_routes_url: '',
        edit_routes_url: '',
        add_routes_url: ''
    },
    role_url: {
        get_roles_by_page: 'resources/role/getRolesByCriteria',
        add_role_url: 'resources/role/addRole',
        edit_role_url: 'resources/role/editRole',
        delete_role_url: 'resources/role/deleteRole',
        get_all_roles_url: 'resources/role/getAllRoles'
    },
    resources_url: {
        delete_resources_url: 'resources/resources/deleteResource',
        get_resources_url: 'resources/resources/getResourceTrees',
        add_resources_url: 'resources/resources/addResource',
        edit_resources_url: 'resources/resources/editResource',
        get_resoures_trees: 'resources/resources/getResourceTrees'
    },
    rabbit_msg_url: {
        get_msg_url: 'resources/rabbit/msg/getRabbitMsg',
        delete_msg_url: '',
        send_msg_url: ''
    },
    time_format: {
        date_time_format: 'yyyy-MM-dd hh:mm:ss'
    },
    web_request_url: {
        file_upload_url: 'web/upload',
        todo_add_url: 'web/todos/addTodos',
        todo_get_url:'web/todos/getTodos',
        todo_finish_url: 'web/todos/finish',
        todo_delete_url: 'web/todos/delete',
        orders: {
            url_get_orders: 'web/order/getOrders'
        }
    },
    upload_url: 'upload/upload'
};
