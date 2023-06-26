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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { isFunction } from "../helpers/function.helper";
import { isInstanceOfSubscriber, subscriberOf, Subscription, } from "../models";
import { OperationResult, OperationResultFlag, } from "../models/operator";
import { fork } from "../operators";
import { Observable } from "./observable";
var PromiseObservable = /** @class */ (function (_super) {
    __extends(PromiseObservable, _super);
    function PromiseObservable(promise) {
        var _this = _super.call(this) || this;
        _this.promise = promise
            .then(function (res) {
            _this.innerSequence.push(new OperationResult(res));
        })
            .catch(function (err) {
            _this.innerSequence.push(new OperationResult(void 0, OperationResultFlag.OperationError, err));
        });
        return _this;
    }
    PromiseObservable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return fork.apply(void 0, __spreadArray([this], operations, false));
    };
    PromiseObservable.prototype.subscribe = function (subscriber) {
        var _this = this;
        if (subscriber === undefined) {
            subscriber = subscriberOf(function () { });
        }
        if (!isFunction(subscriber) && !isInstanceOfSubscriber(subscriber)) {
            throw new Error("Please provide either a function or a Subscriber");
        }
        var _subscriber = !isInstanceOfSubscriber(subscriber)
            ? subscriberOf(subscriber)
            : subscriber;
        this._subscribers.push(_subscriber);
        var handler = function () { return _this.executeSubscriber(_this.innerSequence, _subscriber); };
        this.promise.then(handler);
        return new Subscription(function () {
            return (_this._subscribers = _this._subscribers.filter(function (s) { return s !== subscriber; }));
        });
    };
    return PromiseObservable;
}(Observable));
export { PromiseObservable };
