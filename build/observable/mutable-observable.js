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
import { OperationResult, OperationResultFlag, } from "../models/operator";
import { Observable } from "./observable";
var MutableObservable = /** @class */ (function (_super) {
    __extends(MutableObservable, _super);
    function MutableObservable() {
        var initialSequence = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            initialSequence[_i] = arguments[_i];
        }
        var _this = _super.apply(this, initialSequence) || this;
        _this._preProcessOperations = [];
        _this._isComplete = false;
        return _this;
    }
    MutableObservable.prototype.close = function () {
        if (this._isComplete) {
            return this;
        }
        this._isComplete = true;
        this._subscribers
            .filter(function (s) { return s.complete; })
            .forEach(function (s) {
            s.complete();
        });
        return this;
    };
    /**
     * @param operations
     * @returns this
     */
    MutableObservable.prototype.compile = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (this._isComplete) {
            return this;
        }
        var newSequence = this._buildNewSequence(this._innerSequence
            .filter(function (event) { return !event.isOperationError(); })
            .map(function (event) { return event.value; }), operations).filter(function (event) { return !event.isMustStop(); });
        var idxError = newSequence.findIndex(function (opRes) { return opRes.isOperationError(); });
        if (idxError > -1) {
            this._innerSequence = newSequence.slice(0, idxError);
            this.next.apply(this, this._innerSequence.map(function (event) { return event.value; }));
            this._innerSequence.push(newSequence[idxError]);
            this._triggerExecution([newSequence[idxError]], this._subscribers);
            return this;
        }
        return this.next.apply(this, (this._innerSequence = newSequence).map(function (event) { return event.value; }));
    };
    MutableObservable.prototype.next = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        if (this._isComplete) {
            return this;
        }
        this._innerSequence = this._buildNewSequence(events, this._preProcessOperations);
        this._triggerExecution(this._innerSequence, this._subscribers);
        return this;
    };
    MutableObservable.prototype._buildNewSequence = function (events, operations) {
        var newSequence = [];
        for (var i = 0, l = events.length; i < l; i++) {
            try {
                var operationResult = this._executeOperations(events[i], operations);
                if (operationResult.isMustStop()) {
                    newSequence.push(operationResult);
                    break;
                }
                if (!operationResult.isFilterNotMatched()) {
                    newSequence.push(operationResult);
                }
            }
            catch (error) {
                this._error = error;
                newSequence.push(new OperationResult(events[i], OperationResultFlag.OperationError, error));
                i = l; // Do we really want to stop the whole stream if there is an error?
            }
        }
        return newSequence;
    };
    MutableObservable.prototype._triggerExecution = function (sequence, subscribers) {
        var _this = this;
        subscribers.forEach(function (s) { return _this.executeSubscriber(s, sequence); });
    };
    return MutableObservable;
}(Observable));
export { MutableObservable };
