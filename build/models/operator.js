var OperationResult = /** @class */ (function () {
    function OperationResult(_value, _flag) {
        this._value = _value;
        this._flag = _flag;
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
    OperationResult.prototype.isUnwrapSwitch = function () {
        return this._flag === OperationResultFlag.UnwrapSwitch;
    };
    OperationResult.prototype.isMustStop = function () {
        return this._flag === OperationResultFlag.MustStop;
    };
    OperationResult.prototype.isFilterNotMatched = function () {
        return this._flag === OperationResultFlag.FilterNotMatched;
    };
    return OperationResult;
}());
export { OperationResult };
export var OperationResultFlag;
(function (OperationResultFlag) {
    OperationResultFlag[OperationResultFlag["UnwrapSwitch"] = 0] = "UnwrapSwitch";
    OperationResultFlag[OperationResultFlag["MustStop"] = 1] = "MustStop";
    OperationResultFlag[OperationResultFlag["FilterNotMatched"] = 2] = "FilterNotMatched";
})(OperationResultFlag || (OperationResultFlag = {}));
