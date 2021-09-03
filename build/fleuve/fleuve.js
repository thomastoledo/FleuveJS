var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { filterNonFunctions, isFunction } from "../helpers/function.helper";
import { EventSubscription } from "../models/event";
import { OperationResult, OperationResultFlag, } from "../models/operator";
import { isInstanceOfSubscriber, subscriberOf, Subscription, } from "../models/subscription";
var Fleuve = /** @class */ (function () {
    function Fleuve(_innerValue) {
        this._innerValue = _innerValue;
        this._subscribers = [];
        this._preProcessOperations = [];
        this._forkPipeline = [];
        this._isStarted = false;
        this._isComplete = false;
        this._forks$ = [];
        this._error = null;
        this._isStarted = arguments.length > 0;
    }
    Fleuve.prototype.addEventListener = function (selector, eventType, listener, options) {
        var elem = document.querySelector(selector);
        if (!elem) {
            throw new Error("Could not find any element with selector \"" + selector + "\"");
        }
        var eventListener = this._createEventListenerFromListener(listener);
        elem.addEventListener(eventType, eventListener, options);
        return new EventSubscription(elem, eventType, eventListener);
    };
    Fleuve.prototype.close = function () {
        this._complete();
        this.closeForks();
        this._nextComplete();
    };
    Fleuve.prototype.closeForks = function () {
        this._forks$.forEach(function (fork$) {
            fork$.closeForks();
            fork$._complete();
            fork$._nextComplete();
        });
    };
    Fleuve.prototype.compile = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (this._isFinite || this._isComplete || !!this._error) {
            return this;
        }
        try {
            var operationResult = this._executeOperations(this._innerValue, operations);
            if (operationResult.isMustStop()) {
                this._complete();
                this._nextComplete();
                return this;
            }
            if (operationResult.isFilterNotMatched()) {
                return this;
            }
            this.next(operationResult.value);
        }
        catch (err) {
            this._error = err;
            this._nextError();
            this.close();
        }
        return this;
    };
    Fleuve.prototype.fork = function () {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        var fork$ = new Fleuve();
        fork$._forkPipeline = operators;
        this.subscribe(function (value) {
            if (!!fork$._error) {
                return;
            }
            try {
                var operationResult = fork$._executeOperations(value, fork$._forkPipeline);
                if (operationResult.isMustStop()) {
                    fork$._complete();
                    fork$._nextComplete();
                    return;
                }
                if (operationResult.isFilterNotMatched()) {
                    return;
                }
                fork$.next(operationResult.value);
            }
            catch (err) {
                fork$._error = err;
                fork$._nextError();
            }
        }, function (err) {
            fork$._error = err;
            fork$._nextError();
            fork$.close();
        }, function () { return fork$._complete(); });
        this._forks$.push(fork$);
        return fork$;
    };
    Fleuve.prototype.next = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        if (this._isFinite || this._isComplete || !!this._error || !(this._isStarted = this._isStarted || arguments.length > 0)) {
            return this;
        }
        for (var i = 0; i < events.length; i++) {
            var operationResult = this._executeOperations(events[i], this._preProcessOperations);
            if (operationResult.isMustStop()) {
                this._complete();
                this._nextComplete();
                break;
            }
            if (operationResult.isFilterNotMatched()) {
                break;
            }
            this._innerValue = operationResult.value;
            this._callSubscribers.apply(this, __spreadArray([operationResult.value], this._subscribers));
        }
        return this;
    };
    Fleuve.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        var fleuve$ = new Fleuve();
        if (!!this._error) {
            fleuve$._error = this._error;
            fleuve$.close();
            return fleuve$;
        }
        if (!this._isStarted) {
            return fleuve$;
        }
        try {
            var operationResult = this._executeOperations(this._innerValue, operations);
            if (operationResult.isMustStop() ||
                operationResult.isFilterNotMatched()) {
                fleuve$._complete();
                fleuve$._nextComplete();
                return fleuve$;
            }
            fleuve$.next(operationResult.value);
        }
        catch (err) {
            fleuve$._error = err;
        }
        return fleuve$;
    };
    Fleuve.prototype.subscribe = function (onNext, onError, onComplete) {
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
    Fleuve.prototype._nextError = function () {
        var _this = this;
        this._subscribers.forEach(function (s) { return _this._doError(s); });
    };
    Fleuve.prototype._nextComplete = function () {
        var _this = this;
        this._subscribers.forEach(function (s) { return _this._doComplete(s); });
    };
    Fleuve.prototype._createSubscriber = function (onNext, onError, onComplete) {
        if (isFunction(onNext)) {
            return subscriberOf(onNext, (isFunction(onError) && onError) || undefined, (isFunction(onComplete) && onComplete) || undefined);
        }
        return onNext;
    };
    Fleuve.prototype._doComplete = function (subscriber) {
        var _a;
        if (this._isComplete && subscriber.complete) {
            subscriber.complete((_a = this._error) !== null && _a !== void 0 ? _a : this._innerValue);
        }
    };
    Fleuve.prototype._doError = function (subscriber) {
        if (!!this._error && subscriber.error) {
            subscriber.error(this._error);
        }
    };
    Fleuve.prototype._doNext = function (subscriber) {
        if (this._isStarted && !this._error) {
            subscriber.next(this._innerValue);
        }
    };
    Fleuve.prototype._callSubscribers = function (event) {
        var subscribers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            subscribers[_i - 1] = arguments[_i];
        }
        subscribers.forEach(function (s) { return s.next(event); });
    };
    Fleuve.prototype._computeValue = function (initValue) {
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
    Fleuve.prototype._createEventListenerFromListener = function (listener) {
        var _this = this;
        return function (event) {
            if (!_this._error && !_this._isComplete) {
                listener(_this._innerValue, event);
            }
        };
    };
    Fleuve.prototype._complete = function () {
        this._isComplete = true;
    };
    Fleuve.prototype._executeOperations = function (value, operators) {
        var computedValue = this._computeValue.apply(this, __spreadArray([value], filterNonFunctions.apply(void 0, operators)));
        return computedValue;
    };
    return Fleuve;
}());
export { Fleuve };
