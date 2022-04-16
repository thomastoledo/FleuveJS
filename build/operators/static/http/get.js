import { PromiseObservable } from "../../../observable/promise-observable";
export var get = function (url, options) {
    if (options === void 0) { options = {
        queryParams: {},
        type: 'json'
    }; }
    return new PromiseObservable(new Promise(function (resolve, reject) {
        fetch(url)
            .then(function (res) {
            if (options.type === 'json') {
                return resolve(res.json());
            }
            if (options.type === 'text') {
                return resolve(res.text());
            }
            if (options.type === 'blob') {
                return resolve(res.blob());
            }
        })
            .catch(function (err) { return reject(err); });
    }));
};
