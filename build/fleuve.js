"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fleuve = void 0;
var errors_1 = require("./models/errors");
var event_1 = require("./models/event");
var Fleuve = /** @class */ (function () {
    function Fleuve(_innerValue) {
        this._innerValue = _innerValue;
        this._subscribers = [];
        this._preProcessOperations = [];
        this._isStarted = false;
        this._isComplete = false;
        this._forks$ = [];
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
    Fleuve.prototype.dam = function () {
        // TODO - TTO: rajouter un onError et un onComplete sur les subscribers pour pouvoir tous les exécuter
        this._forks$.forEach(function (fork$) {
            fork$.dam();
            fork$._complete();
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
                var nextValue = fork$._computeValue.apply(fork$, __spreadArray([value], fork$._preProcessOperations));
                fork$.next(nextValue);
            }
            catch (err) {
                if (!(err instanceof errors_1.FilterError)) {
                    throw err;
                }
            }
        });
        this._forks$.push(fork$);
        return fork$;
    };
    Fleuve.prototype.next = function () {
        var _this = this;
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        if (!this._isComplete) {
            if (!this._isStarted) {
                this._isStarted = arguments.length > 0;
            }
            if (this._isStarted) {
                events.forEach(function (event) {
                    _this._innerValue = event;
                    _this._callSubscribers(event);
                });
            }
        }
        return this;
    };
    Fleuve.prototype.pile = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        try {
            var value = this._computeValue.apply(this, __spreadArray([this._innerValue], this._filterNonFunctions.apply(this, operations)));
            this.next(value);
        }
        catch (err) {
            if (!(err instanceof errors_1.FilterError)) {
                throw err;
            }
        }
        return this;
    };
    Fleuve.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        var fleuve$ = new Fleuve();
        if (this._isStarted) {
            try {
                var value = this._computeValue.apply(this, __spreadArray([this._innerValue], this._filterNonFunctions.apply(this, operations)));
                fleuve$.next(value);
            }
            catch (err) {
                if (!(err instanceof errors_1.FilterError)) {
                    throw err;
                }
            }
        }
        return fleuve$;
    };
    Fleuve.prototype.subscribe = function (subscriber) {
        if (!this._isFunction(subscriber)) {
            throw new Error("Please provide a function");
        }
        this._subscribers.push(subscriber);
        if (this._isStarted) {
            subscriber(this._innerValue);
        }
    };
    Fleuve.prototype._filterNonFunctions = function () {
        var _this = this;
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i] = arguments[_i];
        }
        return fns.filter(function (f) { return _this._isFunction(f); });
    };
    Fleuve.prototype._isFunction = function (fn) {
        return typeof fn === "function";
    };
    Fleuve.prototype._callSubscribers = function (event) {
        this._subscribers.forEach(function (s) { return s(event); });
    };
    Fleuve.prototype._computeValue = function (initValue) {
        var operations = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            operations[_i - 1] = arguments[_i];
        }
        if (operations.length > 0) {
            return operations
                .slice(1)
                .reduce(function (val, fn) { return fn(val); }, operations[0](initValue));
        }
        else {
            return initValue;
        }
    };
    Fleuve.prototype._createEventListenerFromListener = function (listener) {
        var _this = this;
        return function (event) { return listener(_this._innerValue, event); };
    };
    Fleuve.prototype._complete = function () {
        this._isComplete = true;
    };
    return Fleuve;
}());
exports.Fleuve = Fleuve;
