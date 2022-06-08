var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { MutableObservable } from "../../../observable/mutable-observable";
export var mutableFrom = function (values) {
    return new (MutableObservable.bind.apply(MutableObservable, __spreadArray([void 0], values, false)))();
};
