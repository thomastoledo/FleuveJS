import { isFunction } from "../helpers/function.helper";
var Subscription = /** @class */ (function () {
    function Subscription(_unsubscribeCallback) {
        this._unsubscribeCallback = _unsubscribeCallback;
    }
    Subscription.prototype.unsubscribe = function () {
        this._unsubscribeCallback();
    };
    return Subscription;
}());
export { Subscription };
export function isInstanceOfSubscriber(obj) {
    return isFunction(obj.next) && (obj.error === undefined || isFunction(obj.error)) && (obj.complete == undefined || isFunction(obj.complete));
}
export function subscriberOf(next, error, complete) {
    if (!isInstanceOfSubscriber({ next: next, error: error, complete: complete })) {
        throw new Error("Please provide functions for onNext, onError and onComplete");
    }
    return { next: next, error: error, complete: complete };
}
;
