"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
var errors_1 = require("../../models/errors");
var filter = function (f) {
    return function (source) {
        return new Promise(function (resolve, reject) {
            try {
                if (!f(source)) {
                    throw new errors_1.FilterError();
                }
                resolve(source);
            }
            catch (error) {
                reject(error);
            }
        });
    };
};
exports.filter = filter;
