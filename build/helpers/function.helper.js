export function isFunction(fn) {
    return typeof fn === 'function';
}
export function filterNonFunctions() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return fns.filter(function (f) { return isFunction(f); });
}
/* istanbul ignore next */
export function fail(message) {
    if (message === void 0) { message = ""; }
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var errorMsg = "Test failed\n".concat(message, " ").concat(args.reduce(function (acc, curr) { return "".concat(acc, " ").concat(curr); }, ""));
    throw new Error(errorMsg);
}
