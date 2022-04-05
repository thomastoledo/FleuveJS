var OperationResult = /** @class */ (function () {
    function OperationResult(_value, _flag, _error) {
        this._value = _value;
        this._flag = _flag;
        this._error = _error;
    }
    Object.defineProperty(OperationResult.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OperationResult.prototype, "flag", {
        get: function () {
            return this._flag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OperationResult.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: false,
        configurable: true
    });
    OperationResult.prototype.isUnwrapSwitch = function () {
        return this._flag === OperationResultFlag.UnwrapSwitch;
    };
    OperationResult.prototype.isMustStop = function () {
        return this._flag === OperationResultFlag.MustStop;
    };
    OperationResult.prototype.isFilterNotMatched = function () {
        return this._flag === OperationResultFlag.FilterNotMatched;
    };
    OperationResult.prototype.isOperationError = function () {
        return this._flag === OperationResultFlag.OperationError;
    };
    return OperationResult;
}());
export { OperationResult };
export var OperationResultFlag;
(function (OperationResultFlag) {
    OperationResultFlag["UnwrapSwitch"] = "UnwrapSwitch";
    OperationResultFlag["MustStop"] = "MustStop";
    OperationResultFlag["FilterNotMatched"] = "FilterNotMatched";
    OperationResultFlag["OperationError"] = "OperationError";
})(OperationResultFlag || (OperationResultFlag = {}));
