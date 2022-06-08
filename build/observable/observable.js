var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { filterNonFunctions, isFunction } from "../helpers/function.helper";
import { OperationResult, OperationResultFlag, } from "../models/operator";
import { isInstanceOfSubscriber, subscriberOf, Subscription, } from "../models/subscription";
var Observable = /** @class */ (function () {
    function Observable() {
        var initialSequence = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            initialSequence[_i] = arguments[_i];
        }
        this._subscribers = [];
        this._isComplete = true;
        this._innerSequence = initialSequence.map(function (value) { return new OperationResult(value); });
    }
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        var obs$ = new Observable();
        var newSequence = [];
        var sourceSequence = this._innerSequence;
        for (var i = 0, l = sourceSequence.length; i < l && !sourceSequence[i].isMustStop(); i++) {
            try {
                var operationResult = this._executeOperations(sourceSequence[i].value, operations);
                if (!operationResult.isFilterNotMatched()) {
                    newSequence.push(operationResult);
                }
            }
            catch (error) {
                newSequence.push(new OperationResult(sourceSequence[i].value, OperationResultFlag.OperationError, error));
                i = l;
            }
        }
        obs$._innerSequence = newSequence;
        return obs$;
    };
    Observable.prototype.subscribe = function (subscriber) {
        var _this = this;
        if (!isFunction(subscriber) && !isInstanceOfSubscriber(subscriber)) {
            throw new Error("Please provide either a function or a Subscriber");
        }
        var _subscriber = !isInstanceOfSubscriber(subscriber)
            ? subscriberOf(subscriber)
            : subscriber;
        this._subscribers.push(_subscriber);
        this.executeSubscriber(_subscriber, this._innerSequence);
        return new Subscription(function () {
            return (_this._subscribers = _this._subscribers.filter(function (s) { return s !== subscriber; }));
        });
    };
    Observable.prototype.executeSubscriber = function (_subscriber, sequence) {
        var _loop_1 = function (i, l) {
            var operationResult = sequence[i];
            if (operationResult.isOperationError()) {
                this_1._error = operationResult.error;
                (_subscriber.error || (function () { throw operationResult.error; }))(operationResult.error);
                return "break";
            }
            if (operationResult.isFilterNotMatched()) {
                return "continue";
            }
            if (operationResult.isMustStop()) {
                return "break";
            }
            _subscriber.next && _subscriber.next(operationResult.value);
        };
        var this_1 = this;
        for (var i = 0, l = sequence.length; i < l; i++) {
            var state_1 = _loop_1(i, l);
            if (state_1 === "break")
                break;
        }
        this._isComplete && _subscriber.complete && _subscriber.complete();
    };
    Observable.prototype._computeValue = function (initValue) {
        var _a;
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
                    res = new OperationResult((_a = res.value._innerSequence.pop()) === null || _a === void 0 ? void 0 : _a.value);
                    break;
                default:
                    break;
            }
        }
        return res;
    };
    Observable.prototype._executeOperations = function (value, operators) {
        var computedValue = this._computeValue.apply(this, __spreadArray([value], filterNonFunctions.apply(void 0, operators), false));
        return computedValue;
    };
    return Observable;
}());
export { Observable };
