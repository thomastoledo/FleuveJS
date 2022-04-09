import { PromiseObservable } from "../../../observable/promise-observable";
export var get = function (url) {
    return new PromiseObservable(new Promise(function (resolve, reject) {
        fetch(url).then(function (res) { console.log(res); return res; }).then(function (res) { return resolve(res.json()); }).catch(function (err) { return reject(err); });
    }));
};
