"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
var map = function (f) {
    return function (source) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(f(source));
            }
            catch (error) {
                reject(error);
            }
        });
    };
};
exports.map = map;
