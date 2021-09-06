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
var MutableObservable = /** @class */ (function (_super) {
    __extends(MutableObservable, _super);
    function MutableObservable() {
        var initialSequence = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            initialSequence[_i] = arguments[_i];
        }
        var _this = _super.apply(this, initialSequence) || this;
        _this._forks$ = [];
        _this._preProcessOperations = [];
        _this._isComplete = false;
        return _this;
    }
    MutableObservable.prototype.close = function () {
        this._complete();
        this._triggerOnComplete();
        this.closeForks();
    };
    MutableObservable.prototype.closeForks = function () {
        this._forks$.forEach(function (fork$) {
            fork$.closeForks();
            fork$._complete();
            fork$._triggerOnComplete();
        });
    };
    /**
     * @param operations
     * @returns
     */
    MutableObservable.prototype.compile = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (this._isComplete || !!this._error) {
            return this;
        }
        var newSequence = this._buildNewSequence(this._innerSequence, operations);
        this.next.apply(this, newSequence);
        return this;
    };
    MutableObservable.prototype.fork = function () {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        var fork$ = new MutableObservable();
        fork$._preProcessOperations = operators;
        fork$._error = this._error;
        this.subscribe(function (value) { fork$.next(value); }, function (err) {
            fork$._error = err;
            fork$._triggerOnError();
            fork$.close();
        }, function () { return fork$.close(); });
        this._forks$.push(fork$);
        return fork$;
    };
    MutableObservable.prototype.next = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        if (this._isComplete || !!this._error) {
            return this;
        }
        this._innerSequence = this._buildNewSequence(events, this._preProcessOperations);
        this._triggerOnNext(this._innerSequence, this._subscribers);
        this._triggerOnError();
        this._triggerOnComplete();
        return this;
    };
    MutableObservable.prototype._buildNewSequence = function (events, operations) {
        var newSequence = [];
        for (var i = 0; i < events.length; i++) {
            try {
                var operationResult = this._executeOperations(events[i], operations);
                if (operationResult.isMustStop()) {
                    this.close();
                    break;
                }
                if (operationResult.isFilterNotMatched()) {
                    break;
                }
                newSequence.push(operationResult.value);
            }
            catch (error) {
                this._error = error;
                this._triggerOnError();
                this.close();
            }
        }
        return newSequence;
    };
    MutableObservable.prototype._triggerOnNext = function (events, subscribers) {
        events.forEach(function (event) { return subscribers.forEach(function (s) { return s.next(event); }); });
    };
    return MutableObservable;
}(Observable));
export { MutableObservable };
