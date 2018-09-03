import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "babel-polyfill";    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import VueResource from "vue-resource";

Vue.use(ElementUI);
Vue.use(VueResource);

Vue.prototype.$env = 'dev';
Vue.http.options.root = 'http://localhost:1987/';
Vue.http.interceptors.push((request, next) => {
    let token = localStorage.getItem('AuthenticationToken');
    if (token) {
        request.headers.set('Authorization', token);
    }
    next((response) => {
        let status = response.status;
        if(200!= status) {
            Vue.$message({message:response.statusText,
                type:'error',
                center: true
            })
        }
        return response;
    });
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
