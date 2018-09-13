import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "babel-polyfill"; // 默认主题
import VueResource from "vue-resource";
import constants from './js/constants';
import TreeView from "vue-json-tree-view"
const vueConfig = require('vue-config');

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(vueConfig, constants);
Vue.use(TreeView)


Vue.prototype.$env = 'dev';
Vue.http.options.root = 'http://localhost:1987/';
Vue.http.interceptors.push((request, next) => {
    let token = localStorage.getItem('AuthenticationToken');
    if (token) {
        request.headers.set('Authorization', token);
    }
    next((response) => {
        return response;
    });
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
