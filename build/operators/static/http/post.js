var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { PromiseObservable } from "../../../observable/promise-observable";
export var post = function (url, type, init) {
    if (type === void 0) { type = 'json'; }
    return new PromiseObservable(new Promise(function (resolve, reject) {
        fetch(url, __assign(__assign({}, init), { method: 'POST' }))
            .then(function (res) {
            if (type === 'text') {
                return resolve(res.text());
            }
            if (type === 'blob') {
                return resolve(res.blob());
            }
            return resolve(res.json());
        })
            .catch(function (err) { return reject(err); });
    }));
};
