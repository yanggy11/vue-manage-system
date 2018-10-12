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
import axios from 'axios'
import Interceptors from '@/js/interceptors/interceptors'
import VueI18n from 'vue-i18n'


const vueConfig = require('vue-config');

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(vueConfig, constants);
Vue.use(TreeView);
Vue.use(axios);
Vue.use(VueI18n);

axios.defaults.baseURL='http://localhost:1987/';

Vue.http.options.root = 'http://localhost:1987/';
Vue.http.interceptors.push(Interceptors);

Vue.directive('hasResource', hasResources);
Vue.directive('hasAnyResources',hasAnyResources);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
