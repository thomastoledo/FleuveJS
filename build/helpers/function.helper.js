"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNonFunctions = exports.isFunction = void 0;
function isFunction(fn) {
    return typeof fn === 'function';
}
exports.isFunction = isFunction;
function filterNonFunctions() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return fns.filter(function (f) { return isFunction(f); });
}
exports.filterNonFunctions = filterNonFunctions;
