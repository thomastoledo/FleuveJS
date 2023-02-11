import { isFunction } from "../helpers/function.helper";
var Subscription = /** @class */ (function () {
    function Subscription(_unsubscribeCallback) {
        this._unsubscribeCallback = _unsubscribeCallback;
    }
    Subscription.prototype.unsubscribe = function () {
        this._unsubscribeCallback && this._unsubscribeCallback();
    };
    return Subscription;
}());
export { Subscription };
export var EMPTY_SUBSCRIPTION = new Subscription();
export function isInstanceOfSubscriber(obj) {
    function hasAtLeastOneOfTheseFieldsAsAFunction(obj) {
        var fields = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            fields[_i - 1] = arguments[_i];
        }
        return fields.some(function (field) {
            return obj[field] !== undefined &&
                obj[field] !== null &&
                isFunction(obj[field]);
        });
    }
    return (!isFunction(obj) &&
        hasAtLeastOneOfTheseFieldsAsAFunction(obj, "next", "error", "complete"));
}
export function subscriberOf(next, error, complete) {
    var subscriber = { next: next, error: error, complete: complete };
    if (!isInstanceOfSubscriber(subscriber)) {
        throw new Error("Please provide functions for next, error and complete");
    }
    return subscriber;
}
