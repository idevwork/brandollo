import axios from 'axios'

export function get(url, params) {
    return new Promise(function (resolve, reject) {
        axios.get(url, { params: params })
            .then(response => {
                if (response.data.success) {
                    resolve(response.data.data);
                }
                else {
                    reject();
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    if (window.location.href.indexOf('refresh') == -1) {
                        window.location.href = '/app/refresh';
                    }
                }
                console.log(error);
                if (error && error.response && error.response.data) {
                    reject(error.response.data);
                }

            });
    })
}

export function post(url, payload) {
    
    return new Promise(function (resolve, reject) {
        axios.post(url, payload)
            .then(response => {
                if (response.data.success) {
                    resolve(response.data.data);
                }
                else {
                    reject();
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    window.location.href = '/app/refresh';
                }
                console.log(error.response.data);
                reject(error.response.data);
            });
    })
}

export function put(url, payload) {
    return new Promise(function (resolve, reject) {
        axios.put(url, payload)
            .then(response => {
                if (response.data.success) {
                    resolve(response.data.data);
                }
                else {
                    reject();
                }
            })
            .catch(error => {
                console.log(error.response.data);
                reject(error.response.data);
            });
    })
}

export function del(url, payload) {
    return new Promise(function (resolve, reject) {
        axios.delete(url, { data: payload })
            .then(response => {
                if (response.data.success) {
                    resolve(response.data.data);
                }
                else {
                    reject();
                }
            })
            .catch(error => {
                console.log(error.response.data);
                reject(error.response.data);
            });
    })
}

export function postMultipart(url, formData, requestConfig) {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        },
    };

    // Merge provided config with the created one
    if (requestConfig) {
      Object.assign(config, requestConfig);
    }

    return new Promise(function (resolve, reject) {
        axios.post(url, formData, config)
            .then(response => {
                if (response.data.success) {
                    resolve(response.data.data);
                }
                else {
                    reject();
                }
            })
            .catch(error => {
                console.log(error.response.data);
                reject(error.response.data);
            });
    })
}

export default {
    get,
    put,
    post,
    del,
    postMultipart
}