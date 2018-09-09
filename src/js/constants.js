export default {
    OK: "1",
    api: 'api/',
    unhandled_message: 'unhandled_message',
    handled_message: 'handled_message',
    recieved_message: 'recieved_message',
    sended_message: 'sended_message',
    user_url: {
        user_login_url: 'auth/login',
        user_upload_url: 'users/user/uploa',
        user_list_url: 'users/user/userList',
        user_edit_url: 'users/user/updateUserInfo',
        user_delete_url: 'users/user/delete',
        user_add_url: 'users/user/register',
        user_delete_all_url: 'users/user/deleteAll'
    },
    routes_url: {
        get_routes_url: 'users/route/getAllRoutesInPage',
        routes_disable_url: 'users/route/disableRoute',
        delete_routes_url: '',
        edit_routes_url: '',
        add_routes_url: ''
    },
    role_url: {
        get_roles_by_page: 'users/role/getRolesByCriteria',
        add_role_url: 'users/role/addRole',
        edit_role_url: 'users/role/editRole',
        delete_role_url: 'users/role/deleteRole',
        get_all_roles_url: 'users/role/getAllRoles'
    },
    resources_url: {
        delete_resources_url: 'users/resources/deleteResource',
        get_resources_url: 'users/resources/getResourceTrees',
        add_resources_url: 'users/resources/addResource',
        edit_resources_url: 'users/resources/editResource'
    },
    rabbit_msg_url: {
        get_msg_url: 'users/rabbit/msg/getRabbitMsg',
        delete_msg_url: '',
        send_msg_url: ''
    }
};
