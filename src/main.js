import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "babel-polyfill"; // 默认主题
import VueResource from "vue-resource";
import constants from './js/constants';
import TreeView from "vue-json-tree-view"
import hasResources from '@/js/directive/hasResources'
import hasAnyResources from '@/js/directive/hasAnyResources'

const vueConfig = require('vue-config');

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(vueConfig, constants);
Vue.use(TreeView);

Vue.http.options.root = 'http://localhost:1987/';

const intercepters = (request, next) => {
    let token = localStorage.getItem('AuthenticationToken');
    if (token) {
        request.headers.set('Authorization', token);
    }
    next((response) => {
        return response;
    });
};

Vue.http.interceptors.push(intercepters);

// 绑定自定义指令
Vue.directive('hasResource', hasResources);
Vue.directive('hasAnyResources',hasAnyResources);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
