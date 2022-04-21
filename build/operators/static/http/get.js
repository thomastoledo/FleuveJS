import { PromiseObservable } from "../../../observable/promise-observable";
export var get = function (url, init, type) {
    if (type === void 0) { type = 'json'; }
    return new PromiseObservable(new Promise(function (resolve, reject) {
        fetch(url)
            .then(function (res) {
            if (type === 'json') {
                return resolve(res.json());
            }
            if (type === 'text') {
                return resolve(res.text());
            }
            if (type === 'blob') {
                return resolve(res.blob());
            }
        })
            .catch(function (err) { return reject(err); });
    }));
};
