var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { filterNonFunctions, isFunction } from "../helpers/function.helper";
import { EventSubscription } from "../models/event";
import { OperationResult, OperationResultFlag, } from "../models/operator";
import { Subscriber, Subscription, } from "../models/subscription";
var Fleuve = /** @class */ (function () {
    function Fleuve(_innerValue) {
        this._innerValue = _innerValue;
        this._subscribers = [];
        this._preProcessOperations = [];
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
        this._forks$.forEach(function (fork$) {
            fork$.close();
            fork$._complete();
            fork$._nextComplete();
        });
    };
    Fleuve.prototype.fork = function () {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        var fork$ = new Fleuve();
        fork$._preProcessOperations = operators;
        this.subscribe(function (value) {
            try {
                var operationResult = fork$._executeOperations(value, fork$._preProcessOperations);
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
        }, function (err) { return (fork$._error = err); }, function () { return fork$._complete(); });
        this._forks$.push(fork$);
        return fork$;
    };
    Fleuve.prototype.next = function () {
        var _this = this;
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        if (this._isComplete || !!this._error) {
            return this;
        }
        if ((this._isStarted = this._isStarted || arguments.length > 0)) {
            events.forEach(function (event) {
                _this._innerValue = event;
                _this._callSubscribers.apply(_this, __spreadArray([event], _this._subscribers));
            });
        }
        return this;
    };
    Fleuve.prototype.compile = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (this._isComplete || !!this._error) {
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
        }
        return this;
    };
    Fleuve.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        var fleuve$ = new Fleuve();
        if (!this._isStarted || !!this._error || this._isComplete) {
            fleuve$._complete();
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
        if (!isFunction(onNext) && !Subscriber.isInstanceOfSubscriber(onNext)) {
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
            return Subscriber.of(function (value) { return onNext(value); }, (isFunction(onError) && onError) || undefined, (isFunction(onComplete) && onComplete) || undefined);
        }
        return onNext;
    };
    Fleuve.prototype._doComplete = function (subscriber) {
        var _a;
        if (this._isComplete) {
            subscriber.onComplete((_a = this._error) !== null && _a !== void 0 ? _a : this._innerValue);
        }
    };
    Fleuve.prototype._doError = function (subscriber) {
        if (!this._isComplete && !!this._error) {
            subscriber.onError(this._error);
        }
    };
    Fleuve.prototype._doNext = function (subscriber) {
        if (this._isStarted && !this._isComplete && !this._error) {
            subscriber.onNext(this._innerValue);
        }
    };
    Fleuve.prototype._callSubscribers = function (event) {
        var subscribers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            subscribers[_i - 1] = arguments[_i];
        }
        subscribers.forEach(function (s) { return s.onNext(event); });
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
