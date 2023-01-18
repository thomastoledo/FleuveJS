var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { Observable } from "../../../observable/observable";
export var from = function (values) {
    return new (Observable.bind.apply(Observable, __spreadArray([void 0], values)))();
};
