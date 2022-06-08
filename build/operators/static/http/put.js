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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { PromiseObservable } from "../../../observable/promise-observable";
export var put = function (url, _a) {
    if (_a === void 0) { _a = { type: "json" }; }
    var type = _a.type, init = __rest(_a, ["type"]);
    return new PromiseObservable(new Promise(function (resolve, reject) {
        fetch(url, __assign(__assign({}, init), { method: "PUT" }))
            .then(function (res) {
            if (!res.ok) {
                throw Error(res.statusText);
            }
            return res;
        })
            .then(function (res) {
            if (type === "text") {
                return resolve(res.text());
            }
            if (type === "blob") {
                return resolve(res.blob());
            }
            return resolve(res.json());
        })
            .catch(function (err) { return reject(err); });
    }));
};
