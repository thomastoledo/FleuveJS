var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { ObservableFork } from "../../../observable";
export var fork = function (obs) {
    var operators = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        operators[_i - 1] = arguments[_i];
    }
    var rest = new (ObservableFork.bind.apply(ObservableFork, __spreadArray([void 0, obs], operators)))();
    return rest;
};
