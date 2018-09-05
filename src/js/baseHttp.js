/**
 * @Author derrick.yang
 * @Date 8/23/18
 */

import Vue from 'vue'

let vue = new Vue()

export function getData(url, params) {

    return new Promise((resolve, reject) => {
        vue.$http({
            url: vue.$config.api + url,
            params: params,
            method: 'GET'
        }).then(response => {
            resolve(response.body);
        }, response => {
            reject(response.bodyText);
        });
    })
}

export function postData(url, body, headers) {

    return new Promise((resolve, reject) => {
        vue.$http.post(vue.$config.api + url, body
        ).then(response => {
            resolve(response.body);
        }, response => {
            reject(response.bodyText);
        });
    })
}

export function deleteData(url, body) {

    url = vue.$config.api + url;

    return new Promise((resolve, reject) => {
        vue.$http.delete(vue.$config.api + url, {body: body}).then(
            response => {
                resolve(response);
            },
            response => {
                reject(response);
            }
        );
    })
}
