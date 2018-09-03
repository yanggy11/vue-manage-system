/**
 * @Author derrick.yang
 * @Date 8/23/18
 */

import Vue from 'vue'
let vue = new Vue()

export function getData(url, params) {
    return new Promise((resolve, reject) => {
        vue.$http({
            url: url,
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
        vue.$http.post(url, body
        ).then(response => {
            resolve(response.body);
        }, response => {
            reject(response.bodyText);
        });
    })
}
export function deleteData(url, body) {
    return new Promise((resolve, reject) => {
        vue.$http.delete(url, {body: body}).then(
            response => {
                resolve(response);
            },
            response => {
                reject(response);
            }
        );
    })
}
