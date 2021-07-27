"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
var map = function (f) {
    return function (source) {
        return f(source);
    };
};
exports.map = map;
