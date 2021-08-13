"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fleuve = void 0;
var function_helper_1 = require("../helpers/function.helper");
var errors_1 = require("../models/errors");
var event_1 = require("../models/event");
var subscription_1 = require("../models/subscription");
var Fleuve = /** @class */ (function () {
    function Fleuve(_innerValue) {
        this._innerValue = _innerValue;
        this._subscribers = [];
        this._preProcessOperations = [];
        this._isStarted = false;
        this._isComplete = false;
        this._isOperating = false;
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
        return new event_1.EventSubscription(elem, eventType, eventListener);
    };
    /**
     * @deprecated use the close() method
     */
    Fleuve.prototype.dam = function () {
        this._forks$.forEach(function (fork$) {
            fork$.close();
            fork$._complete();
            fork$._nextComplete();
        });
    };
    Fleuve.prototype.close = function () {
        this.dam();
    };
    Fleuve.prototype.fork = function () {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        var fork$ = new Fleuve();
        fork$._preProcessOperations = operators;
        this.subscribe(function (value) {
            fork$._executeOperations(value, fork$._preProcessOperations)
                .then(function (value) { return fork$.next(value); })
                .catch(function (err) {
                fork$._error = !(err instanceof errors_1.FilterError) && err;
                fork$._nextError();
            });
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
    /**
     * @deprecated please use compile - won't work next version
     * @param operations
     * @returns
     */
    Fleuve.prototype.pile = function () {
        var _this = this;
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (this._isComplete || !!this._error) {
            return this;
        }
        this._executeOperations(this._innerValue, operations)
            .then(function (value) { return _this.next(value); })
            .catch(function (err) {
            _this._error = !(err instanceof errors_1.FilterError) && err;
            _this._nextError();
        });
        return this;
    };
    Fleuve.prototype.compile = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return this.pile.apply(this, operations);
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
        this._executeOperations(this._innerValue, operations)
            .then(function (value) { return fleuve$.next(value); })
            .catch(function (err) {
            fleuve$._error = !(err instanceof errors_1.FilterError) && err;
            fleuve$._nextError();
            fleuve$._isComplete = err instanceof errors_1.FilterError;
            fleuve$._nextComplete();
        });
        return fleuve$;
    };
    Fleuve.prototype.subscribe = function (onNext, onError, onComplete) {
        var _this = this;
        if (!function_helper_1.isFunction(onNext) && !subscription_1.Subscriber.isInstanceOfSubscriber(onNext)) {
            throw new Error("Please provide either a function or a Subscriber");
        }
        var subscriber = this._createSubscriber(onNext, onError, onComplete);
        this._doNext(subscriber);
        this._doError(subscriber);
        this._doComplete(subscriber);
        this._subscribers.push(subscriber);
        return new subscription_1.Subscription(function () {
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
        var _this = this;
        if (function_helper_1.isFunction(onNext)) {
            return subscription_1.Subscriber.of(function (value) {
                !_this._isOperating && onNext(value);
            }, (function_helper_1.isFunction(onError) && onError) || undefined, (function_helper_1.isFunction(onComplete) && onComplete) || undefined);
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
        var _this = this;
        var operations = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            operations[_i - 1] = arguments[_i];
        }
        if (operations.length > 0) {
            return operations
                .slice(1)
                .reduce(function (promise, fn) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve(promise).then(function (val) { return fn(val); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }, operations[0](initValue));
        }
        else {
            return initValue;
        }
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
    Fleuve.prototype._executeOperations = function (value, operations) {
        var _this = this;
        this._isOperating = true;
        var computedValue = this._computeValue.apply(this, __spreadArray([value], function_helper_1.filterNonFunctions.apply(void 0, operations)));
        return Promise.resolve(computedValue)
            .finally(function () { return (_this._isOperating = false); });
    };
    return Fleuve;
}());
exports.Fleuve = Fleuve;
