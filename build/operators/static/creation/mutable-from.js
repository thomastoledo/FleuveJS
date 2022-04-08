var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { MutableObservable } from "../../../observable/mutable-observable";
export var mutableFrom = function (values) {
    return new (MutableObservable.bind.apply(MutableObservable, __spreadArray([void 0], values)))();
};
