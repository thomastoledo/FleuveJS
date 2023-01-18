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
import { OperationResult, OperationResultFlag } from "../../../models";
import { Observable } from "../../../observable/observable";
var ProxyObservable = /** @class */ (function (_super) {
    __extends(ProxyObservable, _super);
    function ProxyObservable(f) {
        var _this = _super.call(this) || this;
        _this.proxy = Object.assign(new Proxy(f, {
            apply: function (target, thisArg, args) {
                var res;
                var operationResult;
                try {
                    operationResult = new OperationResult(res = target.apply(thisArg, args));
                }
                catch (e) {
                    operationResult = new OperationResult(res, OperationResultFlag.OperationError, e);
                }
                _this._innerSequence = [operationResult];
                _this._subscribers.forEach(function (s) { return _this.executeSubscriber(s, _this._innerSequence); });
                if (operationResult.isOperationError()) {
                    throw operationResult.error;
                }
                return res;
            },
        }));
        return _this;
    }
    ProxyObservable.create = function (f) {
        var instance = new ProxyObservable(f);
        var res = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return instance.proxy.apply(instance, args);
        };
        instance._innerSequence = [];
        res.subscribe = instance.subscribe.bind(instance);
        res.pipe = instance.pipe.bind(instance);
        res.asObservable = function () { return instance; };
        return res;
    };
    return ProxyObservable;
}(Observable));
export var fromFunction = function (f) {
    return ProxyObservable.create(f);
};
