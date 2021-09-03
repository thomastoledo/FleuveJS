var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { filterNonFunctions, isFunction } from "../helpers/function.helper";
import { EventSubscription } from "../models/event";
import { OperationResult, OperationResultFlag, } from "../models/operator";
import { isInstanceOfSubscriber, subscriberOf, Subscription, } from "../models/subscription";
var Observable = /** @class */ (function () {
    function Observable() {
        var initialSequence = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            initialSequence[_i] = arguments[_i];
        }
        this._subscribers = [];
        this._isComplete = false;
        this._error = null;
        this._innerSequence = initialSequence;
    }
    /**
     * @param selector
     * @param eventType
     * @param listener
     * @param options
     * @returns
     */
    Observable.prototype.addEventListener = function (selector, eventType, listener, options) {
        var elem = document.querySelector(selector);
        if (!elem) {
            throw new Error("Could not find any element with selector \"" + selector + "\"");
        }
        var eventListener = this._createEventListenerFromListener(listener);
        elem.addEventListener(eventType, eventListener, options);
        return new EventSubscription(elem, eventType, eventListener);
    };
    Observable.prototype.close = function () {
        this._complete();
        this._triggerOnComplete();
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        var obs$ = new Observable();
        if (!!this._error) {
            obs$._error = this._error;
            obs$._complete();
            return obs$;
        }
        var newSequence = [];
        for (var i = 0; i < this._innerSequence.length; i++) {
            try {
                var operationResult = this._executeOperations(this._innerSequence[i], operations);
                if (operationResult.isMustStop() || operationResult.isFilterNotMatched()) {
                    obs$._complete();
                    return obs$;
                }
                newSequence.push(operationResult.value);
            }
            catch (error) {
                obs$._error = error;
                obs$._complete();
                return obs$;
            }
        }
        obs$._innerSequence = newSequence;
        return obs$;
    };
    Observable.prototype.subscribe = function (onNext, onError, onComplete) {
        var _this = this;
        if (!isFunction(onNext) && !isInstanceOfSubscriber(onNext)) {
            throw new Error("Please provide either a function or a Subscriber");
        }
        var subscriber = this._createSubscriber(onNext, onError, onComplete);
        this._doNext(subscriber);
        this._doError(subscriber);
        this._doComplete(subscriber);
        this._subscribers.push(subscriber);
        return new Subscription(function () {
            return (_this._subscribers = _this._subscribers.filter(function (s) { return s !== subscriber; }));
        });
    };
    Observable.prototype._triggerOnError = function () {
        var _this = this;
        this._subscribers.forEach(function (s) { return _this._doError(s); });
    };
    Observable.prototype._triggerOnComplete = function () {
        var _this = this;
        this._subscribers.forEach(function (s) { return _this._doComplete(s); });
    };
    Observable.prototype._createSubscriber = function (onNext, onError, onComplete) {
        if (isFunction(onNext)) {
            return subscriberOf(onNext, (isFunction(onError) && onError) || undefined, (isFunction(onComplete) && onComplete) || undefined);
        }
        return onNext;
    };
    Observable.prototype._doComplete = function (subscriber) {
        if (this._isComplete && subscriber.complete) {
            subscriber.complete();
        }
    };
    Observable.prototype._doError = function (subscriber) {
        if (!!this._error && subscriber.error) {
            subscriber.error(this._error);
        }
    };
    Observable.prototype._doNext = function (subscriber) {
        this._innerSequence.forEach(function (value) { return subscriber.next(value); });
    };
    Observable.prototype._computeValue = function (initValue) {
        var operations = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            operations[_i - 1] = arguments[_i];
        }
        var res = new OperationResult(initValue);
        for (var i = 0; i < operations.length; i++) {
            res = operations[i](res.value);
            switch (res.flag) {
                case OperationResultFlag.FilterNotMatched:
                case OperationResultFlag.MustStop:
                    i = operations.length;
                    break;
                case OperationResultFlag.UnwrapSwitch:
                    res = new OperationResult(res.value._innerValue);
                    break;
                default:
                    break;
            }
        }
        return res;
    };
    Observable.prototype._createEventListenerFromListener = function (listener) {
        var _this = this;
        return function (event) {
            if (!_this._error && !_this._isComplete) {
                _this._innerSequence.forEach(function (value) { return listener(value, event); });
            }
        };
    };
    Observable.prototype._complete = function () {
        this._isComplete = true;
    };
    Observable.prototype._executeOperations = function (value, operators) {
        var computedValue = this._computeValue.apply(this, __spreadArray([value], filterNonFunctions.apply(void 0, operators)));
        return computedValue;
    };
    return Observable;
}());
export { Observable };
