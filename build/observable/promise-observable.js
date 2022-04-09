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
import { OperationResult, OperationResultFlag } from "../models/operator";
import { Observable } from "./observable";
var PromiseObservable = /** @class */ (function (_super) {
    __extends(PromiseObservable, _super);
    function PromiseObservable(promise) {
        var _this = _super.call(this) || this;
        promise
            .then(function (res) {
            _this._innerSequence.push(new OperationResult(res));
        })
            .catch(function (err) {
            _this._innerSequence.push(new OperationResult(void 0, OperationResultFlag.OperationError, err));
        })
            .finally(function () { return _this._subscribers.forEach(function (s) { return _this.executeSubscriber(s, _this._innerSequence); }); });
        return _this;
    }
    return PromiseObservable;
}(Observable));
export { PromiseObservable };
