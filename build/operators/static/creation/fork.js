var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ObservableFork } from "../../../observable/observable-fork";
export var fork = function (obs) {
    var operators = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        operators[_i - 1] = arguments[_i];
    }
    var rest = new (ObservableFork.bind.apply(ObservableFork, __spreadArray([void 0, obs], operators, false)))();
    return rest;
};
