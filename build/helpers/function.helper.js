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
