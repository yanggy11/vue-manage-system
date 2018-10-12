import {Message} from "element-ui";
import Router from "../../router/index";

let handleResponse = response => {
    let status = response.status;
    switch(status) {
        case 200:
            if(response.body.status !== '1') {
                Message({
                    message: response.body.msg,
                    type: 'error',
                    center: true
                });
            }
            break;
        case 500:
            Message({
                message: response.bodyText,
                type: 'error',
                center: true
            });
            break;
        case 400:
            break;
        case 404:
            Router.push("/404");
            break;
        case 403:
            Router.push("/403");
            break;
        case 401:
            Router.push("/login");
            break;
        default:
            Message({
                message: response.bodyText,
                type: 'error',
                center: true
            });
    }

    return response;
};

const interceptors = (request, next) => {
    let token = localStorage.getItem('AuthenticationToken');
    if (token) {
        request.headers.set('Authorization', token);
    }
    next((response) => {
        handleResponse(response);
        return response;
    });
};

export default interceptors;
