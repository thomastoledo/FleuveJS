"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
var errors_1 = require("../models/errors");
var filter = function (f) {
    return function (source) {
        if (f(source)) {
            return source;
        }
        throw new errors_1.FilterError();
    };
};
exports.filter = filter;
