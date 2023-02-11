var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Observable } from "./observable";
import { isFunction } from "../helpers/function.helper";
import { OperationResult, OperationResultFlag, } from "../models/operator";
import { isInstanceOfSubscriber, subscriberOf, Subscription, } from "../models/subscription";
var ObservableFork = /** @class */ (function (_super) {
    __extends(ObservableFork, _super);
    function ObservableFork(sourceObs$) {
        var operators = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            operators[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.sourceObs$ = sourceObs$;
        _this.subscriptions = [];
        _this.operators = [];
        _this._isClosed = false;
        _this.operators = operators;
        _this._isComplete = sourceObs$._isComplete;
        _this.sourceObs$._forks.push(_this);
        _this.sourceObs$.subscribe({
            next: function (value) {
                _this._subscribers
                    .filter(function (s) { return s.next; })
                    .forEach(function (s) {
                    var result = _this._executeOperations(value, operators);
                    if (!result.isFilterNotMatched() && !result.isMustStop()) {
                        return s.next(result.value);
                    }
                    if (result.isMustStop()) {
                        _this.close();
                    }
                });
            },
            error: function (err) {
                _this._error = err;
                _this._subscribers
                    .filter(function (s) { return s.error; })
                    .forEach(function (s) { return s.error(err); });
            },
            complete: function () {
                _this._isComplete = true;
                _this.unsubscribe();
                _this._subscribers
                    .filter(function (s) { return s.complete; })
                    .forEach(function (s) { return s.complete(); });
            },
        });
        return _this;
    }
    Object.defineProperty(ObservableFork.prototype, "innerSequence", {
        get: function () {
            return this.sourceObs$.innerSequence;
        },
        set: function (sequence) {
            this._innerSequence = sequence;
        },
        enumerable: false,
        configurable: true
    });
    ObservableFork.prototype.subscribe = function (subscriber) {
        var _this = this;
        if (subscriber === undefined) {
            //TODO - TTO: might be useful not to assign a default one but rather a new empty one each time
            subscriber = subscriberOf(function () { });
        }
        if (!isFunction(subscriber) && !isInstanceOfSubscriber(subscriber)) {
            throw new Error("Please provide either a function or a Subscriber");
        }
        var _subscriber = !isInstanceOfSubscriber(subscriber)
            ? subscriberOf(subscriber)
            : subscriber;
        this._subscribers.push(_subscriber);
        var newSequence = [];
        var sourceSequence = this.sourceObs$.innerSequence; // FIXME ew
        for (var i = 0, l = sourceSequence.length; i < l; i++) {
            try {
                if (sourceSequence[i].isOperationError()) {
                    throw sourceSequence[i].error;
                }
                newSequence.push(this._executeOperations(sourceSequence[i].value, this.operators));
            }
            catch (error) {
                newSequence.push(new OperationResult(sourceSequence[i].value, OperationResultFlag.OperationError, error));
                i = l;
            }
        }
        if (this._isClosed) {
            (_subscriber.complete && _subscriber.complete());
        }
        else {
            this.executeSubscriber(newSequence, _subscriber);
        }
        return new Subscription(function () {
            return (_this._subscribers = _this._subscribers.filter(function (s) { return s !== subscriber; }));
        });
    };
    ObservableFork.prototype.close = function () {
        this._isClosed = true;
        this._forks.forEach(function (fork) { return fork.close(); });
        this._subscribers.forEach(function (s) { return s.complete && s.complete(); });
        this.unsubscribe();
    };
    ObservableFork.prototype.unsubscribe = function () {
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
    };
    return ObservableFork;
}(Observable));
export { ObservableFork };
