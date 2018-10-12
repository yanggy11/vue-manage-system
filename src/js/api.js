import axios from 'axios'
import Vue from 'vue'

let vue = new Vue();
axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
});

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.resolve(error.response)
    }
);

function checkStatus(response) {
    if (response.status === 200) {
        if (response.data.status === '1') {
            return response.data;
        } else {
            vue.$message({
                message: response.data.msg,
                type: 'error',
                center: true
            });
        }
    }else {
        switch (response.status) {
            case 404:
                vue.$router.push("/404");
                break;
            case 400:
                break;
            case 401:
                vue.$router.push('/login');
                break;
            case 403:
                vue.$router.push('/403')
                break;
            case 500:
                vue.$message({
                    message: response,
                    type: 'error',
                    center: true
                });
                break;
            default:
                break;
        }
    }

    return undefined;
}

function checkCode(res) {
    switch (res.status) {
        case 404:
            vue.$router.push("/404");
            break;
        case 400:
            break;
        case 401:
            vue.$router.push('/login');
            break;
        case 403:
            vue.$router.push('/403')
            break;
        case 500:
            break;
        default:
            break;
    }
    return undefined;
}


export default {
    post(url, data) {
        url = vue.$config.api + url;
        return axios({
            method: 'post',
            url,
            data,
            timeout: 60000,
            headers: {
                'Authorization': localStorage.getItem('AuthenticationToken'),
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(checkStatus).catch(checkCode)
    },
    get(url, params) {
        url = vue.$config.api + url
        return axios({
            method: 'get',
            url,
            params,
            timeout: 60000,
            headers: {
                'Authorization': localStorage.getItem('AuthenticationToken')
            }
        }).then(checkStatus).then(checkCode)
    }
}
