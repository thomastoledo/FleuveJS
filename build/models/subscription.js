"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber = exports.Subscription = void 0;
var function_helper_1 = require("../helpers/function.helper");
var Subscription = /** @class */ (function () {
    function Subscription(_unsubscribeCallback) {
        this._unsubscribeCallback = _unsubscribeCallback;
    }
    Subscription.prototype.unsubscribe = function () {
        this._unsubscribeCallback();
    };
    return Subscription;
}());
exports.Subscription = Subscription;
var Subscriber = /** @class */ (function () {
    function Subscriber(_onNext, _onError, _onComplete) {
        this._onNext = _onNext;
        this._onError = _onError;
        this._onComplete = _onComplete;
    }
    Subscriber.isInstanceOfSubscriber = function (obj) {
        return obj instanceof Subscriber;
    };
    Subscriber.of = function (onNext, onError, onComplete) {
        if (!function_helper_1.isFunction(onNext) || (!!onError && !function_helper_1.isFunction(onError)) || (!!onComplete && !function_helper_1.isFunction(onComplete))) {
            throw new Error("Please provide functions for onNext, onError and onComplete");
        }
        return new Subscriber(onNext, onError, onComplete);
    };
    Subscriber.prototype.onNext = function (t) {
        return this._onNext(t);
    };
    Subscriber.prototype.onError = function (err) {
        return this._onError && this._onError(err);
    };
    Subscriber.prototype.onComplete = function (value) {
        return this._onComplete && this._onComplete(value);
    };
    return Subscriber;
}());
exports.Subscriber = Subscriber;
;
